(() => {
    if (document.querySelector('.alert')) {
        const alert = document.querySelector('.alert'); 
        const delay = 3000;
        setTimeout(() => alert.parentNode.removeChild(alert), delay);
    }    
})();
