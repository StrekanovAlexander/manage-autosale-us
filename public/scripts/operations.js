(() => {
    const btnModalEdits = document.querySelectorAll('.btn-modal-edit');
    if (btnModalEdits) {
        btnModalEdits.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const id = ev.target.dataset.btnModalId;
                const cells = document.querySelector(`#row-id-${ id }`).getElementsByTagName('td');
                const form = document.querySelector('#form-edit');
                form.action = '/operations/edit';

                form.querySelector('#date_reg').value = cells[1].innerText;

                [...document.querySelector('#account_id').getElementsByTagName('option')].forEach(el => {
                    if (cells[2].innerText === el.label) {
                        el.defaultSelected = true;
                    }
                });

                [...document.querySelector('#sub_account_id').getElementsByTagName('option')].forEach(el => {
                    if (cells[3].innerText === el.label) {
                        el.defaultSelected = true;
                    }
                });

                [...document.querySelector('#operation_type_id').getElementsByTagName('option')].forEach(el => {
                    if (cells[4].innerText === el.label) {
                        el.defaultSelected = true;
                    }
                }); 

                form.querySelector('#amount').value = cells[5].innerText.replace(',','');
                form.querySelector('#description').value = cells[6].innerText;

                const hiddenId = form.querySelector('#hidden-id');
                hiddenId.value = id;
                hiddenId.name = 'id';
            
                form.querySelector('#button-submit').disabled = false;
            });
        });
    }

    document.querySelector('#btn-modal').addEventListener('click', (ev) => {
        const form = document.querySelector('#form-edit');
        form.action = '/operations/create';
        const hiddenId = form.querySelector('#hidden-id');
        hiddenId.value = '';
        hiddenId.name = 'id';
            
        form.querySelector('#button-submit').disabled = true;
    });

    const btnModalRemoves = document.querySelectorAll('.btn-modal-remove');
    const formRemove = document.querySelector('#form-remove');
    if (btnModalRemoves) {
        btnModalRemoves.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                
                const id = ev.target.dataset.btnModalId;
                const cells = document.querySelector(`#row-id-${ id }`).getElementsByTagName('td');
                document.querySelector('#rm-id').innerHTML = id;
                document.querySelector('#rm-date-reg').innerHTML = cells[1].innerText;
                document.querySelector('#rm-account').innerHTML = cells[2].innerText;
                document.querySelector('#rm-subject').innerHTML = cells[3].innerText;
                document.querySelector('#rm-operation-type').innerHTML = cells[4].innerText;
                document.querySelector('#rm-amount').innerHTML = cells[5].innerText;
                document.querySelector('#rm-description').innerHTML = cells[6].innerText;
                formRemove.querySelector('#hidden-rm-id').value = id;
            });
        });
    }

    document.querySelector('#rm-check-box').addEventListener('change', function(ev) {
        document.querySelector('#btn-rm-submit').disabled = !this.checked;
    })

    // Validators
    const selectors = document.querySelectorAll('select');
    [...selectors].forEach(el => {
        el.addEventListener('change', function(ev) {
            handleSelect(ev, this);
            validate();
        });
    });

    const numbers = document.querySelectorAll('.number');
    [...numbers].forEach(el => {
        el.addEventListener('keyup', function(ev) {
            handleNumber(ev, this);
            validate();
        });
    });

    const dateReg = document.querySelector('#date_reg');

    dateReg.addEventListener('keyup', function (ev) {
        handleDate(ev, this);
        validate();
    });

    const button = document.querySelector('#button-submit');

    function validate() {
        const result = checkSelects() && checkNumbers() && checkDateReg();
        button.disabled = !result;
    }

    function checkDateReg() {
        if (!isDateValid(dateReg.value)) {
            dateReg.className = setClass('is-invalid');
            return false; 
        }
        return true;
    }

    function checkSelects() {
        for (let i = 0; i < selectors.length; i++) {
            if (!selectors[i].value) {
                selectors[i].className = setClass('is-invalid');
                return false; 
            }
        }
        return true;
    }

    function checkNumbers() {
        for (let i = 0; i < numbers.length; i++) {
            if (!numbers[i].value || Number(numbers[i].value) <= 0) {
                numbers[i].className = setClass('is-invalid');
                return false;
            }
        } 
        return true;   
    }

    function isDateValid(date) {
        const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        return date.match(regex);
    } 

    function handleDate(ev, that) {
        that.className = !isDateValid(ev.target.value) ? setClass('is-invalid') : setClass('is-valid');
    }

    function handleSelect(ev, that) {
        const value = ev.target.value;
        that.className = value.length === 0 ? setClass('is-invalid') : setClass('is-valid');
    }

    function handleNumber(ev, that) {
        const notNumber = isNaN(ev.target.value.trim());
        that.className = notNumber ? setClass('is-invalid') : setClass('is-valid');
    }

    function setClass(value) {
        return `form-control form-control-sm ${value}`;
    }
})();