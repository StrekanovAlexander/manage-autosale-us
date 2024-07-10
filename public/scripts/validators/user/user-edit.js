const min = 5;

const username = document.querySelector('#username');
const button = document.querySelector('#button-submit');

username.addEventListener('keyup', function(ev) {
    handle(ev, this);
    validate();
});

function validate() {
    button.disabled = username.value.length < min;
}

function handle(ev, that) {
    const value = ev.target.value;
    that.className = value.length < min ? setClass('is-invalid') : setClass('is-valid');
}

function setClass(value) {
    return `form-control form-control-sm ${value}`;
}