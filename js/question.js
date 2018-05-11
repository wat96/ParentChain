var posts = getPosts();
var answers = getAnswers();
var liked = {};
var currentPost;
var replying;
var nextComment = 4; //TODO delete

function onLoad() {
    var searchResults = getSearchResults(sessionStorage.getItem("clicked"));

    var results = document.getElementById("results-content");

    for (var i = 0; i < searchResults.length; i++) {
        console.log(i);
        var id = searchResults[i];

        var result = Util.create("div", {"class": "result", "id":"r"+id, "onclick":"loadPost("+id+")"});

        var header = Util.create("h3", {"class": "result-header"});
        header.innerText = posts[id]["title"];

        var content = Util.create("div", {"class": "result-content"});
        content.innerText = posts[id]["content"];

        result.appendChild(header);
        result.appendChild(content);

        console.log(result);
        results.appendChild(result);
    }

    currentPost = searchResults[0];
    loadPost(searchResults[0]);


}

function newPostForm() {
    var results = document.getElementById("results-content");

    console.log(document.getElementById("results-content"));
    for (var i = 0; i < results.children.length; i++) {
        results.children[i].classList.remove("current");
    }

    document.getElementById("question").hidden = true;
    document.getElementById("answers").hidden = true;
}

function loadPost(id) {
    document.body.style.setProperty("--writing", "none");
    var results = document.getElementById("results-content");
    currentPost = id;

    for (var i = 0; i < results.children.length; i++) {
        results.children[i].classList.remove("current");
    }

    var active = document.getElementById("r"+id);
    active.classList.add("current");

    document.getElementById("question").hidden = false;
    document.getElementById("answers").hidden = false;
    updateQuestion(posts[id]);

    var answersList = document.getElementById("answers-list");
    while (answersList.lastChild) {
        answersList.removeChild((answersList.lastChild));
    }
    if (id in answers) {
        updateAnswer(answers[id]);
    } else {
        var answersList = document.getElementById("answers-list");
        var header = Util.create("h1",{"class":"heading comment"});
        header.innerText = "No comments";
        answersList.appendChild(header);
    }
}

function switchArrow(id, increase) {
    var up = document.getElementById("au-"+id);
    var down = document.getElementById("ad-"+id);
    if (increase > 0) {
        up.classList.add("active");
        down.classList.remove("active");
    } else {
        down.classList.add("active");
        up.classList.remove("active");
    }
}

function updateRating(id, increase) {
    var val = parseInt(document.getElementById("aa-"+id).innerText);

    if (id in liked && !(liked[id] === increase)) {
        document.getElementById("aa-"+id).innerText = val + increase * 2;
        liked[id] = increase;
        switchArrow(id, increase);
    } else if (!(id in liked)) {
        document.getElementById("aa-"+id).innerText = val + increase;
        liked[id] = increase;
        switchArrow(id, increase);
    } else {
        document.getElementById("aa-"+id).innerText = val - increase;
        delete liked[id];

        var up = document.getElementById("au-"+id);
        var down = document.getElementById("ad-"+id)
        up.classList.remove("active");
        down.classList.remove("active");
    }
    return document.getElementById("aa-"+id).innerText;
}

function updateQuestion(post) {
    var title = document.getElementById("question-header");
    var content = document.getElementById("question-content");
    var tags = document.getElementById("tags");
    var user = document.getElementById("question-user");

    title.innerText = post["title"];
    content.innerText = post["content"];

    while (tags.lastChild) {
        tags.removeChild(tags.lastChild);
    }

    for (var i = 0; i < post["tags"].length; i++) {
        var newTag = Util.create("div", {"class": "tag button"});
        // newTag.classList.add("tag");
        newTag.innerText = post["tags"][i];
        tags.appendChild(newTag);
    }

    user.innerText = post["user"];
}

function updateAnswer(answers) {
    var answersList = document.getElementById("answers-list");

    for (var i in answers) {
        var id = answers[i]["id"];

        var answer = createAnswer(answers[i]);
        answersList.appendChild(answer);
    }
}

function createReplyData(content) {
    nextComment += 1;
    return {
        "user": "me",
        "rating": 0,
        "content": content,
        "id": nextComment
    };
}

function createReply(id, parent, data) {
    if (Util.one(id).value.length > 0) {
        var newAnswer = createReplyData(Util.one(id).value);
        clearAnswer();
        if ("replies" in data) {
            data["replies"].push(newAnswer);
        } else {
            data["replies"] = [newAnswer];
        }

        var answer = createAnswer(newAnswer);
        parent.appendChild(createAnswer(newAnswer));
    }
}

function addAnswer() {
    var answersList = document.getElementById("answers-list");
    if (!(currentPost in answers)) {
        while (answersList.lastChild) {
            answersList.removeChild((answersList.lastChild));
        }
    }
    if (Util.one("#post-textbox").value.length > 0) {
        var newAnswer = createReplyData(Util.one("#post-textbox").value);
        clearAnswer();
        if (currentPost in answers) {
            answers[currentPost].push(newAnswer);
        } else {
            answers[currentPost] = [newAnswer];
        }

        var answer = createAnswer(newAnswer);
        answersList.appendChild(createAnswer(newAnswer));
    }
}

function blockComment(buttonId) {
    Util.one("#a-"+buttonId).classList.add("toggle");
}

function createAnswer(data) {
    var id = data["id"];

    var answer = Util.create("div", {"class": "answer", "id": "a-"+id});
    var rating = Util.create("div", {"class": "answer-vote"});
    var amount = Util.create("div", {"class": "answer-vote-amount", "id": "aa-"+id});
    var arrowUp = Util.create("div", {"class": "arrow arrow-up", "id": "au-"+id});
    var arrowDown = Util.create("div", {"class": "arrow arrow-down", "id": "ad-"+id});

    arrowUp.addEventListener("click", function() {
        data["rating"] = updateRating(id, 1);
    });
    arrowDown.addEventListener("click", function() {
        data["rating"] = updateRating(id, -1);
    });

    if (id in liked) {
        if (liked[id] > 0) {
            arrowUp.classList.add("active");
        } else {
            arrowDown.classList.add("active");
        }
    }
    amount.innerText = data["rating"];

    rating.appendChild(arrowUp);
    rating.appendChild(amount);
    rating.appendChild(arrowDown);

    answer.appendChild(rating);

    var answerRight = Util.create("div", {"class": "answer-right"});
    var answerHeader = Util.create("div", {"class": "answer-header"});

    var answerProfile = Util.create("a", {"class": "profile", "id": "ap-"+id, "href":"dogtor.html"});
    var answerProfileIcon = Util.create("i", {"class": "fas fa-user-circle"});
    var answerProfileName = Util.create("div", {"class": "answer-user profile-name", "id": "an-"+id});
    answerProfileName.innerText = data["user"];

    answerProfileIcon.appendChild(answerProfileName);
    answerProfile.appendChild(answerProfileIcon);
    answerHeader.appendChild(answerProfile);

    var answerButtons = Util.create("div", {"class": "answer-buttons"});

    var saveButton = Util.create("a", {"class": "answer-button bookmark", "id": "as-"+id, "title":"Bookmark"});
    var saveIcon = Util.create("i", {"class": "far fa-bookmark"});
    saveButton.addEventListener("click", function () {
        if (saveButton.classList.contains("toggle")) {
            saveButton.classList.remove("toggle");
            saveIcon.classList.remove("fas");
            saveIcon.classList.add("far");
        } else {
            saveButton.classList.add("toggle");
            saveIcon.classList.remove("far");
            saveIcon.classList.add("fas");
        }
    })
    saveButton.appendChild(saveIcon);

    var replyButton = Util.create("a", {"class": "answer-button", "id": "ar-"+id, "title": "Reply"});
    replyButton.appendChild(Util.create("i", {"class": "fas fa-reply"}));

    console.log("adding "+id)

    var answerReply = Util.create("div", {});
    replyButton.addEventListener("click", function() {
        clearAnswer();
        addReplyBox(id, answerReply, data);
        replying = id;
    })

    var blockButton = Util.create("a",
    {"class": "answer-button", "id": "ab-"+id, "title": "Report"});
    blockButton.appendChild(Util.create("i", {"class": "far fa-times-circle"}));

    answerButtons.appendChild(saveButton);
    answerButtons.appendChild(replyButton);
    answerButtons.appendChild(blockButton);


    answerHeader.appendChild(answerButtons);

    var confirm = Util.create("div", {"id": "c-"+id, "class": "block-confirm"});
    var yes = Util.create("button", {"type": "button", "class": "block"});
    yes.innerText = "yes";
    yes.addEventListener("click", function () {
        blockComment(id);
    });
    var no = Util.create("button", {"type": "button", "class": "block"});
    no.innerText = "no";
    no.addEventListener("click", function () {
        confirm.classList.remove("toggle")
    })
    confirm.innerText = "Report and block this comment?";
    confirm.appendChild(yes);
    confirm.appendChild(no);
    answerHeader.appendChild(confirm);
    blockButton.addEventListener("click", function () {
        confirm.classList.add("toggle");
    });


    answerRight.appendChild(answerHeader);

    var answerContent = Util.create("div", {"class": "answer-content"});
    answerContent.innerText = data["content"];

    answerRight.appendChild(answerContent);
    answer.appendChild(answerRight);

    var replies = Util.create("div", {"class": "answer-replies", "id": "replies-"+id});
    if (data["replies"]) {
        for (var j = 0; j < data["replies"].length; j++) {
            replies.appendChild(createAnswer(data["replies"][j]));
        }
    }

    answer.appendChild(answerReply);
    answer.appendChild(replies);
    return answer;
}

function recordingAnswer() {
    clearAnswer();
    document.body.style.setProperty("--writing", "inline-block");
}

function clearAnswer() {
    if (replying) {
        Util.one("#replying").remove();
        replying = undefined;
    }
    document.body.style.setProperty("--writing", "none");
    Util.one("#post-textbox").value = "";
}

function addReplyBox(id, answer, data) {
    var container = Util.create("div", {"class":"answer-reply-input", "id": "replying"});
    container.appendChild(Util.create("textarea", {"class": "answer-reply-textarea", "id": "replying-textbox"}));
    var submit = Util.create("button", {"class":"button post-button reply-button"});
    submit.innerText = "Post";
    submit.addEventListener("click", function(){
        createReply("#replying-textbox", Util.one("#replies-"+id), data);
    });

    var cancel = Util.create("button", {"class":"button post-button reply-button"});
    cancel.innerText = "Cancel";
    cancel.addEventListener("click", clearAnswer);

    container.appendChild(submit);
    container.appendChild(cancel);
    answer.appendChild(container);
}

function toggleResults() {
    var list = Util.one("#results-content");
    if (list.classList.contains("toggle")) {
        list.classList.remove("toggle");
        Util.one("#results-header").classList.remove("toggle");
    } else {
        list.classList.add("toggle");
        Util.one("#results-header").classList.add("toggle");
    }
}

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
    // Final initalization entry point: the Javascript code inside this block
    // runs at the end of start-up when the DOM is ready
    "DOMContentLoaded": function() {
        var searchResults = getSearchResults(sessionStorage.getItem("clicked"));

        var results = document.getElementById("results-content");

        if (searchResults.length < 10) {
            document.body.style.setProperty("--scroll", "none");
        }

        var postButton = Util.one("#post-me");
        if(postButton != null) {
            postButton.addEventListener("click", function() {
                sessionStorage.setItem("clicked", true);
                window.location.replace('question.html')
            });
        }
        if (postButton == null) {
            for (var i = 0; i < searchResults.length; i++) {
                console.log(i);
                var id = searchResults[i];

                var result = Util.create("div", {"class": "result", "id":"r"+id, "onclick":"loadPost("+id+")"});

                var header = Util.create("h3", {"class": "result-header"});
                header.innerText = posts[id]["title"];

                var content = Util.create("div", {"class": "result-content"});
                content.innerText = posts[id]["content"].replace(/\r?\n/, "");

                result.appendChild(header);
                result.appendChild(content);

                results.appendChild(result);
            }
            loadPost(searchResults[0]);

            Util.one("#post-textbox").addEventListener("click", recordingAnswer);

            Util.one("#post-submit").addEventListener("click", addAnswer);
            Util.one("#post-cancel").addEventListener("click", clearAnswer);
            Util.one("#new-post").addEventListener("click", function() {
                window.location.replace('newPost.html')
            });
            Util.one("#search").value = sessionStorage.getItem('query') == null ? "" : sessionStorage.getItem('query');
        }
        Util.one("#results-header").addEventListener("click", toggleResults);

        var saveButton = Util.one("#question-bookmark");
        var saveIcon = Util.one("#bookmark-icon");
        saveButton.addEventListener("click", function () {
            if (saveButton.classList.contains("toggle")) {
                saveButton.classList.remove("toggle");
                saveIcon.classList.remove("fas");
                saveIcon.classList.add("far");
            } else {
                saveButton.classList.add("toggle");
                saveIcon.classList.remove("far");
                saveIcon.classList.add("fas");
            }
        })

        Util.one("#question-reply").addEventListener("click", function () {
            Util.one("#post-textbox").focus();
            recordingAnswer();
        })
    }
});
