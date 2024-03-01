let changes = {profile: false, bio: false};
function createProfileArea(data) {
    return `<img id="proPic" src="${data.profile}" alt="Instagram">
                    <p>${data.username}</p>`;
}
fetch(`/user/getUserDetails?userId=${getCookie('userData')}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(r => r.json())
    .then(data => {
        console.log(data);
        if(data.success){
            console.log(data);
            document.getElementsByClassName('cProfile')[0].innerHTML = createProfileArea(data.data);
            let bio = document.getElementById('bioText');
            bio.value = data.data.bio;
            bio.oninput = function () {
                changes.bio = true;
            }
        }else{
            window.location.href = '/';
        }
    })
    .catch(err => {
        console.log(err);
    });
function uploadProfile(event){
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = document.getElementById("proPic");
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    changes.profile = true;
}
function saveChanges() {
    const bio = document.getElementById('bioText');
    const profile = document.getElementById('proPic');
    fetch('/user/editProfile',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({isProfile: changes.profile, isBio: changes.bio, bioText: bio.value,profile: profile.src, id: getCookie('userData')})
        }
    ).then(r => r.json())
        .then(data => {
            console.log(data)
            if(data.success) {
                alert('Changes saved');
            }
        });
}