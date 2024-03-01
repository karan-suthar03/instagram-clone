const params = new URLSearchParams(window.location.search);
const username = params.get('username');

function createProfile(data) {
    console.log(data);
    function isMe(isMe) {
        if (!isMe) {
            return `<button class="followB">follow</button>
                    <button class="massageB">massage</button>`;
        }else{
            return `<button class="editProfile" onclick="window.location.href = 'editProfile'">Edit Profile</button>
                    <button class="logOut">log out</button>`;
        }
    }

    function isNoPosts(posts) {
        if(posts == 0){
            return `<div class="noPost">
            <img src="/home/logos/photos.svg" alt="">
        </div>`;
        }else{
            return "";
        }
    }

    return `                <div class="userProfileArea">
                    <div class="user_profile">
                        <img src="../home/Default_pfp.jpg" alt="Instagram">
                    </div>
                    <div class="userDetails">
                        <div class="user_nameAndContact">
                            <p class="username">${username}</p>`+ isMe(data.data.isMe) +
        `<div class="user_more">
                                <img src="../home/logos/navigationLogo/more.svg" alt="Instagram">
                            </div>
                        </div>
                        <div class="userProfileDetails">
                            <div class="userPosts">
                                <p><span>${data.data.posts.length}</span> posts</p>
                            </div>
                            <div class="userFollow">
                                <p><span>${data.data.followers}</span> followers</p>
                            </div>
                            <div class="userFollowing">
                                <p><span>${data.data.following}</span> following</p>
                            </div>
                        </div>
                        <div class="userBio">
                            <p>${data.data.bio}</p>
                        </div>
                    </div>
                </div>
                <div class="userPostsArea">
                    <div class="postAreaHeading">
                        <div><img src="/home/logos/postLogo.svg" alt=""> POSTS</div>
                    </div>
                    <div class="postArea">`+
                            isNoPosts(data.data.posts.length)
                        +
                    `</div>
                </div>`
}

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
        if(!data.success){
            document.getElementsByClassName('mainContent')[0].innerHTML = '<h1>Invalid User</h1>';
        }else{
            document.getElementsByClassName('mainContent')[0].innerHTML = createProfile(data);
        }
        return data.data.posts;
    }).then(posts => {
    function createProfilePost(post) {
        let postDiv = document.createElement('div');
        postDiv.classList.add('profilePost');
        let img = document.createElement('img');
        img.src = `/posts/${post}`;
        postDiv.appendChild(img);
        return postDiv;
    }

    if (posts.length > 0) {
            let container = document.getElementsByClassName('postArea')[0];
            container.innerHTML = '<div class="postContainer"></div>';
            let postContainer = container.getElementsByClassName('postContainer')[0];
            posts.forEach(post => {
                postContainer.appendChild(createProfilePost(post));
            })
        }
    });