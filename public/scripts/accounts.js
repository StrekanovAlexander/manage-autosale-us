(() => { 
    const btns = document.querySelectorAll('.btn-modal-edit');
    if (btns) {
        btns.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                document.querySelector('.modal-title').innerHTML = 'Edit account';
                const id = ev.target.dataset.btnModalId;
                const cells = document.querySelector(`#row-id-${ id }`).getElementsByTagName('td');
                const form = document.querySelector('#form-edit');

                form.action = '/accounts/edit';
                form.querySelector('#title').value = cells[1].innerText;
    
                [...document.querySelector('#user_id').getElementsByTagName('option')].forEach(el => {
                    if (cells[2].innerText === el.label) {
                        el.defaultSelected = true;
                    }
                });

                document.querySelector('#activity').checked = cells[3].children[0].checked;

                form.querySelector('#hidden-id').value = id;
                form.querySelector('#button-submit').disabled = false;
            });
        });
    }

    document.querySelector('#btn-modal').addEventListener('click', (ev) => {
        const form = document.querySelector('#form-edit');
        form.action = '/accounts/create';
        const hiddenId = form.querySelector('#hidden-id');
        hiddenId.value = '';
        hiddenId.name = 'id';
            
        form.querySelector('#button-submit').disabled = true;
    });

// Validator
    const min = 1;

    const title = document.querySelector('#title');
    const button = document.querySelector('#button-submit');

    title.addEventListener('keyup', function(ev) {
        handle(ev, this);
        validate();
    });

    function validate() {
        button.disabled = title.value.length < min;
    }

    function handle(ev, that) {
        const value = ev.target.value;
        that.className = value.length < min ? setClass('is-invalid') : setClass('is-valid');
    }

    function setClass(value) {
        return `form-control form-control-sm ${value}`;
    }
})();
