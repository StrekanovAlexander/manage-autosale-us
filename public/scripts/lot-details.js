(() => {
    document.querySelector('#btn-specifications').addEventListener('click', (ev) => {
        const el = document.querySelector('#specifications');
        toggleVisibility(el);
        ev.target.text = el.classList.contains('visible') ? 'Hide specifications' : 'Show specifications';
    });

    document.querySelector('#button-submit').addEventListener('click', (ev) => {
        const el = document.querySelector('#create-operation');
        el.classList.remove('visible');
        el.classList.add('hidden');
        ev.target.text = el.classList.contains('visible') ? 'Close form' : 'Create operation';
    });

    function toggleVisibility(el) {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            el.classList.add('visible');
        } else if (el.classList.contains('visible')) {
            el.classList.remove('visible');
            el.classList.add('hidden');
        }
    }

    const btnCosts = document.querySelectorAll('.btn-edit-cost');
    if (btnCosts) {
        document.querySelectorAll('.btn-edit-cost').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const id = ev.target.dataset.btnEditCost;
                const row = document.querySelector(`#cost-row-id-${ id }`);
                const cells = row.getElementsByTagName('td');
                const form = document.querySelector('#form-cost-edit');
                form.action = '/operations/edit';
                form.querySelector('#date_reg').value = cells[1].innerText;
                
                [...document.querySelector('#sub_account_id').getElementsByTagName('option')].forEach(el => {
                    if (cells[2].innerText === el.label) {
                        el.defaultSelected = true;
                    }
                });
                
                [...document.querySelector('#operation_type_id').getElementsByTagName('option')].forEach(el => {
                    if (cells[3].innerText === el.label) {
                        el.defaultSelected = true;
                    }
                }); 

                form.querySelector('#amount').value = cells[4].innerText.replace(',', '');
                form.querySelector('#description').value = cells[5].innerText;
                
                const hiddenId = form.querySelector('#hidden-id');
                hiddenId.value = id;
                hiddenId.name = 'id';
            
                form.querySelector('#button-submit').disabled = false;

            });
        });
    }

    document.querySelector('#btn-add-cost').addEventListener('click', (ev) => {
        const form = document.querySelector('#form-cost-edit');
        form.action = '/operations/lot/create';
        const hiddenId = form.querySelector('#hidden-id');
        hiddenId.value = ev.target.dataset.lotId;
        hiddenId.name = 'lot_id';
           
        form.querySelector('#button-submit').disabled = true;
    });

    document.querySelector('#btn-edit-price').addEventListener('click', (ev) => {
        const form = document.querySelector('#form-price-edit');
        const targetPrice = form.querySelector('#target_price');
        targetPrice.value = parseInt(targetPrice.value);
    });

    // Validators
    const selectors = document.querySelectorAll('select');
    [...selectors].forEach(el => {
        el.addEventListener('change', function(ev) {
            handleSelect(ev, this);
            validate();
        });
    });

    const dateReg = document.querySelector('#date_reg');

    dateReg.addEventListener('keyup', function (ev) {
        handleDate(ev, this);
        validate();
    });

    document.querySelector('#amount').addEventListener('keyup', function(ev) {
        handleNumber(ev, this);
        validate();
    });

    const button = document.querySelector('#button-submit');

    function validate() {
        const result = checkSelects() && checkDateReg() && checkAmount();
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

    function checkAmount() {
        const amount = Number(document.querySelector('#amount').value);
        if (isNaN(amount) || amount <= 0) {
            amount.className = setClass('is-invalid');
            return false;
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