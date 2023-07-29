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
        libraries: ['maps', 'places', 'routes']
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

async function setupMap(mapElementId, inputElementIds, markerPosition) {
    try {
        await loadMapsAPI();

        const [originId, destinationId] = inputElementIds;
        var originPosition;
        var destinationPosition;

        const mapElement = document.getElementById(mapElementId);
        const originElement = document.getElementById(originId);
        const destinationElement = document.getElementById(destinationId);

        const {map, marker} = createMap(mapElement, markerPosition);

        const originAutocomplete = addLocationAutocomplete(originElement);
        const destinationAutocomplete = addLocationAutocomplete(destinationElement);

        originAutocomplete.addListener('place_changed', () => {
            const place = originAutocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const newPosition = place.geometry.location;
                updateMarker(marker, newPosition);
                map.panTo(newPosition);
                originPosition = newPosition;
            }
        })
        destinationAutocomplete.addListener('place_changed', () => {
            const place = destinationAutocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const newPosition = place.geometry.location;
                updateMarker(marker, newPosition);
                map.panTo(newPosition);
                destinationPosition = newPosition;
            }
        })
    } catch (error) {
        console.error('Error setting up map: ', error);
    }
}

originFormInput.addEventListener('focus', () => {
    mapModal.classList.add('is-active');
    originInputField.classList.remove('is-hidden');
    mapModalType.innerHTML = 'Origin';
    originInputField.value = originFormInput.value;
})

destinationFormInput.addEventListener('focus', () => {
    mapModal.classList.add('is-active');
    destinationInputField.classList.remove('is-hidden');
    mapModalType.innerHTML = 'Destination';
    destinationInputField.value = destinationFormInput.value;
})

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

setupMap('map', ['originInputField', 'destinationInputField'], {lat: 0, lng: 0});