let signUpButton = document.getElementById('signUpButton');

signUpButton.addEventListener('click', function() {
    let username = document.getElementById('SignInId').value;
    let password = document.getElementById('SignInPassword').value;
    // Regular expression patterns for username and password validation


    const usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
    const passwordPattern = /^(?!\s)(?=.*\S)(?=.*\S$).{8,}$/;


    if(username.trim() === "") {
        alert('Username cannot be empty');
    } else if (!usernamePattern.test(username)) {
        alert('Username must be between 4 to 20 characters and contain only letters, numbers, and underscores');
    } else if(password.trim() === "") {
        alert('Password cannot be empty');
    } else if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long');
    } else {
        fetch('/user/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        }).then(r => r.json())
            .then(data => {
                if(data.success) {
                    createCookie(data.id);
                    window.location.href = "/home";
                } else {
                    alert('signUP Failed');
                }
                console.log(data);
            });
    }
});