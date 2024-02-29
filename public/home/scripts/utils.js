function createCookie(value){
    let d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = "userData" + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie value by name
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}
function checkValid() {
    if (document.cookie.includes('userData')) {
        // Return the promise created by fetch
        return fetch('/user/isUserValid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: getCookie('userData') })
        })
            .then(r => r.json())
            .then(data => {
                console.log(data);
                return data.success;
            });
    } else {
        return Promise.resolve(false);
    }
}