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