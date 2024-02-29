checkValid()
    .then(isValid => {
        if (isValid) {
            window.location.href = '/home';
        }
        console.log(isValid);
    });