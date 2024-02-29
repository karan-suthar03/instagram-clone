const params = new URLSearchParams(window.location.search);
const username = params.get('username');

fetch(`/user/getUser?username=${username}`,
    {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ myUsername: getCookie('userData') })
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
    });