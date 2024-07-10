(() => {
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

    //

    const btns = document.querySelectorAll('.btn-modal-edit');
    if (btns) {
        btns.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                document.querySelector('.modal-title').innerHTML = 'Edit operation type';
                const id = ev.target.dataset.btnModalId;
                const cells = document.querySelector(`#row-id-${ id }`).getElementsByTagName('td');
                const form = document.querySelector('#form-edit');

                form.action = '/operation-types/edit';
                form.querySelector('#title').value = cells[1].innerText;

                document.querySelector('#direction-in').checked = cells[2].innerText.trim() === 'in';
                document.querySelector('#direction-out').checked = cells[2].innerText.trim() === 'out';
                document.querySelector('#is_car_cost').checked = cells[3].children[0].checked;
                document.querySelector('#activity').checked = cells[4].children[0].checked;
                document.querySelector('#button-submit').disabled = false;

                form.querySelector('#hidden-id').value = id;
            });
        });
    }

    //

    document.querySelector('#btn-modal').addEventListener('click', () => {
        document.querySelector('.modal-title').innerHTML = 'Create operation type';
        const form = document.querySelector('#form-edit');
        form.action = '/operation-types/create';

    });

})();