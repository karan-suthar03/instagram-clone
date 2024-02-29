function toggleCreate() {
    const x = document.getElementById("createPost");
    if (x.classList.contains("hidden")) {
        x.classList.remove("hidden");
        const cretaeHead = document.getElementsByClassName("createHead")[0];
        cretaeHead.innerHTML = "<p>Create new post</p>";
        const dropBody = document.getElementById("dropBody");
        dropBody.innerHTML = "<div class='uploadArea'>" +
            "<div class=\"buttonAndPhoto\">\n" +
            "                        <div class=\"photoLogo\">\n" +
            "                            <img src=\"\../home/logos/photos.svg\" alt=\"\">\n" +
            "                        </div>\n" +
            "                        <div class=\"photoUploadText\">\n" +
            "                            <p>Drag and drop your photos here</p>\n" +
            "                        </div>\n" +
            "                        <div class=\"postButton\">\n" +
            "                            <input style=\"display: none\" type=\"file\" accept=\"image/*\" id=\"photoInput\" name=\"photo\" onchange=\"handleFileSelect(event)\">\n" +
            "                            <button onclick=\"document.getElementById('photoInput').click()\">Select from computer</button>\n" +
            "                        </div>\n" +
            "                    </div>" +
            "</div>"
    } else {
        x.classList.add("hidden");
        const dropBody = document.getElementById("dropBody");
        dropBody.innerHTML = "";
    }
}

function createCaptionOP(){
    return "                        <div class=\"capProfile\">\n" +
        "                            <img src=\"../home/Default_pfp.jpg\" alt=\"user\">\n" +
        "                            <p>mera naam</p>\n" +
        "                        </div>\n" +
        "                        <p>Caption</p>\n" +
        "                        <div class=\"capText\">\n" +
        "                            <textarea name=\"caption\" id=\"caption\" placeholder=\"Write a caption...\"></textarea>\n" +
        "                        </div>\n"
}

function captionAndConfirm() {
    const createHead = document.getElementsByClassName("createHead")[0];
    createHead.innerHTML = "<span class='CancelPost' onclick='toggleCreate()'>Cancel</span>" +
        "<p>Create new post</p>" +
        "<span class='next' onclick='createPost()'>Confirm</span>";
    const img = document.getElementById("upImage");
    img.style.display = "none";
    const dropBody = document.getElementById("dropBody");
    const createCaption = document.createElement("div");
    createCaption.className = "createCaption";
    createCaption.innerHTML = createCaptionOP();
    dropBody.appendChild(createCaption);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const dropBody = document.getElementById("dropBody");

        const img = document.createElement("img");
        img.id = "upImage";
        img.src = e.target.result;
        dropBody.innerHTML = "";
        dropBody.appendChild(img);
    };

    reader.readAsDataURL(file);
    const createHead = document.getElementsByClassName("createHead")[0];
    createHead.innerHTML = "<span class='CancelPost'>Cancel</span>" +
        "<p>Create new post</p>" +
        "<span class='next' onclick='captionAndConfirm()'>next</span>";
}

function createPost() {
    const img = document.getElementById("upImage");
    const caption = document.getElementById("caption");

    fetch('/post/create',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({image: img.src, caption: caption.value,id: getCookie('userData')})
        }
    ).then(r => r.json())
        .then(data => {
            if(data.success) {
                toggleCreate();
            }
        });

}