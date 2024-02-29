function loadFeed(){
    let feed = document.getElementById('feed');
    fetch('/feed/load', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json())
        .then(data => {
            console.log(data);
            data.forEach(post => {
                console.log(post);
                let div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = createPost(post);
                feed.appendChild(div);
            });
        });
}
function createPost(post){
    return `<div class="postHeader">
                                <div class="user">
                                    <img src="logos/post.jpg" alt="user">
                                    <div class="userName">${post.username}</div>
                                </div>
                                <div class="more">
                                    <img src="logos/navigationLogo/more.svg" alt="more">
                                </div>
                            </div>
                            <div class="postImage">
                                <img src="..${post.image}" alt="post">
                            </div>
                            <div class="postFooter">
                                <div class="postIcons">
                                    <div class="lcs">
                                        <div class="like">
                                            <img src="logos/navigationLogo/heart.svg" alt="like">
                                        </div>
                                        <div class="comment">
                                            <img src="logos/commentLogo.svg" alt="comment">
                                        </div>
                                        <div class="share">
                                            <img src="logos/share.svg" alt="share">
                                        </div>
                                    </div>
                                </div>
                                <div class="likes">${post.likes} likes</div>
                                <div class="caption">
                                    <div class="userName">${post.username}</div>
                                    <div class="captionText">this is a caption</div>
                                </div>
                            </div>`;
}
loadFeed();