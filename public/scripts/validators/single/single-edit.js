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