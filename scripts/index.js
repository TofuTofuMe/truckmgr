async function fetchTableData(tableId) {
    return new Promise((resolve, reject) => {
        switch (tableId) {
            case 'trucks':
                request = new Request('/trucks/list_trucks', {method: 'GET'});
                break;
            case 'trips':
                request = new Request('/trips/list_trips', {method: 'GET'});
                break;
            case 'maintenance':
                request = new Request('/maintenance/list_maintenance', {method: 'GET'});
                break;
            default:
                reject(new Error('Invalid table ID given'));
                break;
        }

        fetch(request)
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData);
            })
            .catch((error) => {
                console.error('Error fetching data table: ', error);
                reject(error);
            });
    });
}

async function setupTable(tableId) {
    try {
        const responseData = await fetchTableData(tableId);
        const tableBody = document.querySelector('#table-body');
        var dataRow = 0;

        if (responseData.length === 0) {
            responseData.push({
                blankmsg: 'No data available'
            })
        }

        responseData.forEach(entry => {
            const tableRow = document.createElement('tr');
            for (const data in entry) {
                const tableData = document.createElement('td');
                tableData.setAttribute('id', `${data}-${dataRow}`);
                tableData.textContent = entry[data];
                tableRow.appendChild(tableData);
            }
            tableRow.setAttribute('id', `entry-${dataRow}`);
            tableBody.appendChild(tableRow);
            dataRow++;
        });
    } catch (error) {
        console.error('Error setting up table: ', error);
    }
}

function handleSelectorChange(selectorId, formFieldIds, referenceFieldId) {
    try {
        const selector = document.getElementById(selectorId);

        const referenceField = document.getElementById(referenceFieldId);
        const dropButton = document.getElementById('dropButton');

        selector.addEventListener('change', () => {
            formFieldIds.forEach(fieldId => {
                const formField = document.getElementById(fieldId);

                if (selector.value === 'new') {
                    formField.value = '';
                } else {
                    formField.value = document.getElementById(`${fieldId}-${selector.selectedIndex - 1}`).innerHTML;
                }
            });

            if (selector.value !== 'new') {
                referenceField.readOnly = true;
                dropButton.disabled = false;
            } else {
                referenceField.readOnly = false;
                dropButton.disabled = true;
            }
        });
    } catch (error) {
        console.error('Error handling selector: ', error);
    }
}

async function setupSelectorOptions(selectorId, tableId, tableColumn) {
    try {
        const selector = document.getElementById(selectorId);
        const responseData = await fetchTableData(tableId);

        responseData.forEach(entry => {
            var option = new Option(entry[tableColumn], entry[tableColumn]);
            selector.add(option);
        })
    } catch (error) {
        console.error('Error setting up selector: ', error);
    }
}

function setFormAction(selectorId, formId, addUrl, updateUrl) {
    const selector = document.getElementById(selectorId);
    const form = document.getElementById(formId);

    const submitButton = document.getElementById('submitButton');
    const dropButton = document.getElementById('dropButton');

    selector.addEventListener('change', () => {
        switch (selector.value) {
            case 'new':
                form.action = addUrl;
                break;
            default:
                form.action = updateUrl;
                break;
        }
    }, {once: false})
}