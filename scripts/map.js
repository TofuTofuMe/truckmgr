const originFormInput = document.getElementById('origin');
const destinationFormInput = document.getElementById('destination');
const originInputField = document.getElementById('originInputField');
const destinationInputField = document.getElementById('destinationInputField');
const mapModal = document.getElementById('mapModal');
const mapModalType = document.getElementById('mapModalType');
const mapModalSubmit = document.getElementById('mapModalSubmit');
const mapModalClose = document.getElementById('mapModalClose');

async function loadMapsAPI() {
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: '',
        version: 'weekly',
        libraries: ['maps', 'geocoding', 'places', 'routes']
    });

    try {
        await loader.load();
    } catch (error) {
        console.error('Error loading Google Maps API: ', error);
    }
}

function createMap(mapElement, markerPosition) {
    const map = new google.maps.Map(mapElement, {
        center: markerPosition,
        zoom: 20
    });

    const marker = new google.maps.Marker({
        position: markerPosition,
        map: map
    });

    return {map, marker};
}

function updateMarker(marker, markerPosition) {
    marker.setPosition(markerPosition);
}

function addLocationAutocomplete(inputField) {
	const autocomplete = new google.maps.places.Autocomplete(inputField);
	return autocomplete;
}

async function calculateDistance(originPosition, destinationPosition) {
    try {
        const matrixService = new google.maps.DistanceMatrixService();
        const distanceMatrixRequest = {
            origins: [originPosition],
            destinations: [destinationPosition],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        return new Promise((resolve, reject) => {
            matrixService.getDistanceMatrix(distanceMatrixRequest, (response, status) => {
                if (status === google.maps.DistanceMatrixStatus.OK) {
                    const distance = response.rows[0].elements[0].distance.value;
                    resolve(distance);
                } else {
                    reject(new Error('Error calculating distance: ', status));
                }
            });
        });
    } catch (error) {
        console.error('Error calculating distance: ', error);
    }
}

async function setupMap(mapElementId, inputElementIds, markerPosition) {
    try {
        await loadMapsAPI();

        const [originId, destinationId, tripMileageId, totalMileageId] = inputElementIds;
        var originPosition;
        var destinationPosition;

        const mapElement = document.getElementById(mapElementId);
        const originElement = document.getElementById(originId);
        const destinationElement = document.getElementById(destinationId);
        const tripMileageElement = document.getElementById(tripMileageId);
        const totalMileageElement = document.getElementById(totalMileageId);

        const {map, marker} = createMap(mapElement, markerPosition);

        const originAutocomplete = addLocationAutocomplete(originElement);
        const destinationAutocomplete = addLocationAutocomplete(destinationElement);

        originAutocomplete.addListener('place_changed', async () => {
            const place = originAutocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const newPosition = place.geometry.location;
                updateMarker(marker, newPosition);
                map.panTo(newPosition);
                originPosition = newPosition;

                if (destinationPosition) {
                    const distance = await calculateDistance(originPosition, destinationPosition);
                    tripMileageElement.value = distance / 1000;
                    totalMileageElement.value = (distance * 2) / 1000;
                }
            }
        })
        destinationAutocomplete.addListener('place_changed', async () => {
            const place = destinationAutocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const newPosition = place.geometry.location;
                updateMarker(marker, newPosition);
                map.panTo(newPosition);
                destinationPosition = newPosition;

                if (originPosition) {
                    const distance = await calculateDistance(originPosition, destinationPosition);
                    tripMileageElement.value = distance / 1000;
                    totalMileageElement.value = (distance * 2) / 1000;
                }
            }
        })

        originFormInput.addEventListener('focus', () => {
            mapModal.classList.add('is-active');
            originInputField.classList.remove('is-hidden');
            mapModalType.innerHTML = 'Origin';
            originInputField.value = originFormInput.value;
        
            if (originFormInput.value) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({address: originFormInput.value}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        const newPosition = results[0].geometry.location;
                        updateMarker(marker, newPosition);
                        map.panTo(newPosition);
                        originPosition = newPosition;
                    }
                })
            }
        })
        
        destinationFormInput.addEventListener('focus', () => {
            mapModal.classList.add('is-active');
            destinationInputField.classList.remove('is-hidden');
            mapModalType.innerHTML = 'Destination';
            destinationInputField.value = destinationFormInput.value;
        
            if (destinationFormInput.value) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({address: destinationFormInput.value}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        const newPosition = results[0].geometry.location;
                        updateMarker(marker, newPosition);
                        map.panTo(newPosition);
                        destinationPosition = newPosition;
                    }
                })
            }
        })
    } catch (error) {
        console.error('Error setting up map: ', error);
    }
}

mapModalSubmit.addEventListener('click', () => {
    mapModal.classList.remove('is-active');
    [originInputField, destinationInputField].forEach(field => field.classList.add('is-hidden'));
    switch (mapModalType.innerHTML) {
        case 'Origin':
            originFormInput.value = originInputField.value;
            originInputField.value = '';
            break;
        case 'Destination':
            destinationFormInput.value = destinationInputField.value;
            destinationInputField.value = '';
            break;
    }
})

mapModalClose.addEventListener('click', () => {
    mapModal.classList.remove('is-active');
    originInputField.classList.add('is-hidden');
    destinationInputField.classList.add('is-hidden');
})

setupMap('map',
    ['originInputField', 'destinationInputField',
    'trip_mileage', 'total_mileage'],
    {lat: 0, lng: 0}
);