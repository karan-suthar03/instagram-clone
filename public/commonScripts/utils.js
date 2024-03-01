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
function createNav(username) {
    let navbar = document.getElementsByClassName('navigationBar')[0];
    if (navbar) {
        navbar.innerHTML = `<div class="logoContainer">
            <img src="/home/logos/instaLogo.svg" alt="Instagram">
        </div>
        <div class="menuItems">
            <div class="home_nav navOp" onclick="window.location.href = '/home'">
                <img src="/home/logos/navigationLogo/home.svg" alt="Instagram">
                <div class="navT">home</div>
            </div>
            <div class="search_nav navOp">
                <img src="/home/logos/navigationLogo/search.svg" alt="Instagram">
                <div class="navT">search</div>
            </div>
            <div class="create_nav navOp" onclick="toggleCreate()">
                <img src="/home/logos/navigationLogo/add.svg" alt="Instagram">
                <div class="navT">Create</div>
            </div>
            <div class="notification_nav navOp">
                <img src="/home/logos/navigationLogo/heart.svg" alt="Instagram">
                <div class="navT">notifications</div>
            </div>
            <div class="profile_nav navOp" onclick="window.location.href = '/user/?username=${username}'">
                <img src="/home/Default_pfp.jpg" id="profilePic" alt="Instagram">
                <div class="navT">profile</div>
            </div>
        </div>
        <div class="more_nav"></div>`;
    }
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
                createNav(data.username);
                return data.success;
            });
    } else {
        return Promise.resolve(false);
    }
}