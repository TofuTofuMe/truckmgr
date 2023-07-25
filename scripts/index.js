async function handleSelectorChange(selectorId, formFieldIds, referenceFieldId) {
    const selector = document.getElementById(selectorId);

    const referenceField = document.getElementById(referenceFieldId);
    const dropButton = document.getElementById('dropButton');

    selector.addEventListener('change', () => {
        const selected = selector.value;

        formFieldIds.forEach(fieldId => {
            const formField = document.getElementById(fieldId);

            if (selected === 'new') {
                formField.value = '';
            } else {
                formField.value = document.getElementById(`${fieldId}-${selected - 1}`).innerHTML;
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
}

async function retrieveTableData(tableId) {
    var dataRow = 0;
    const table = document.getElementById(tableId);
    document.addEventListener('DOMContentLoaded', () => {
        switch (table.id) {
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
                {}
        }
        tableBody = document.querySelector('#table-body');
        fetch(request).then((response) => {
            response.json().then(responseData => {

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
                })
            })
        });
    })
}