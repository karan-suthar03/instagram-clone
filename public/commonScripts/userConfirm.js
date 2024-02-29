checkValid().then(isValid => {
    if (!isValid) {
        window.location = '/';
    }
});