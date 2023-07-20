window.onload = function() {
    const agreeAll = document.getElementById('agreeAll');
    const checkboxes = [
        document.getElementById('agree1'),
        document.getElementById('agree2'),
        document.getElementById('agree3'),
    ];

    agreeAll.addEventListener('change', function() {
        checkboxes.forEach((checkbox) => {
            checkbox.checked = agreeAll.checked;
        });
    });

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                agreeAll.checked = false;
            } else {
                const allChecked = checkboxes.every((checkbox) => checkbox.checked);
                agreeAll.checked = allChecked;
            }
        });
    });
};
