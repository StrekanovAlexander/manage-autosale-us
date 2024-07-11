(() => {
    const selectors = document.querySelectorAll('.form-select-required');
    [...selectors].forEach(el => {
        el.addEventListener('change', function(ev) {
            handleSelect(ev, this);
            validate();
        });
    });

    const texts = document.querySelectorAll('.form-input-text-required');
    [...texts].forEach(el => {
        el.addEventListener('keyup', function(ev) {
            handleText(ev, this);
            validate();
        });
    });

    const numbers = document.querySelectorAll('.form-input-number-required');
    [...numbers].forEach(el => {
        el.addEventListener('keyup', function(ev) {
            handleNumber(ev, this);
            validate();
        });
    });

    const button = document.querySelector('#button-submit');

    function validate() {
        const result = checkSelects() && checkTexts() && checkNumbers();
        button.disabled = !result;
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

    function checkTexts() {
        for (let i = 0; i < texts.length; i++) {
            if (!texts[i].value) {
                texts[i].className = setClass('is-invalid');
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

    function handleSelect(ev, that) {
        const value = ev.target.value;
        that.className = value.length === 0 ? setClass('is-invalid') : setClass('is-valid');
    }

    function handleText(ev, that) {
        const text = ev.target.value.trim();
        that.className = !text.length ? setClass('is-invalid') : setClass('is-valid');
    }

    function handleNumber(ev, that) {
        const notNumber = isNaN(ev.target.value.trim());
        that.className = notNumber ? setClass('is-invalid') : setClass('is-valid');
    }

    function setClass(value) {
        return `form-control form-control-sm ${value}`;
    }

    document.querySelector('#brand_id').addEventListener('change', (ev) => {
        const selector = document.querySelector('#model_id');
        selector.innerHTML = '';
        if (!ev.target.value) {
            return;
        }
        (async () => {
            try {
                const res = await fetch(`https://manage.auto-sale.us/brands/${ev.target.value}/models/json`);
                const data = await res.json();
                build(selector, data);
            } catch (err) {
                console.log('Wrong request...');
            }
        })();
    });

    function build(selector, data) {
        data.forEach(el => {
            const option = document.createElement('option');
            option.value = el.id;
            option.innerHTML = el.title;
            selector.appendChild(option);
        });
    }
})();