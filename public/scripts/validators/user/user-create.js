const min = 5;

const username = document.querySelector('#username');
const password = document.querySelector('#password');
const password2 = document.querySelector('#password2');
const button = document.querySelector('#button-submit');

username.addEventListener('keyup', function(ev) {
    handle(ev, this);
    validate();
});

password.addEventListener('keyup', function(ev) {
    handle(ev, this);
    validate();
});

password2.addEventListener('keyup', function(ev) {
    handle(ev, this);
    validate();
});

function validate() {
    if (username.value.length < min) {
        button.disabled = true;
        return;
    }

    if (password.value.length < min) {
        button.disabled = true;
        return;
    }

    if (password2.value.length < min) {
        button.disabled = true;
        return;
    }

    if (password.value !== password2.value) {
        password2.className = setClass('is-invalid');
        button.disabled = true;
        return;
    }

    button.disabled = false;
}

function handle(ev, that) {
    const value = ev.target.value;
    that.className = value.length < min ? setClass('is-invalid') : setClass('is-valid');
}

function setClass(value) {
    return `form-control form-control-sm ${value}`;
}