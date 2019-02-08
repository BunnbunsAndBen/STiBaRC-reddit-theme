//
//CREDIT TO https://stibarc.gq/
//
function toLink(id, item) {
  try {
    if (item["deleted"]) {
      item["title"] = "Post deleted";
    }
    document.getElementById("list").innerHTML = document
      .getElementById("list")
      .innerHTML.concat('<div class="post"> <div class="flexy-boi"><div class="post-up_down">'
      )
      .concat(
        "&#8679; " +
          item["upvotes"] +
          " &#8681; " +
          item["downvotes"] +
          ""
      ).concat('</div> <div class="post-list-boi"> <a style="font-size:100%;text-decoration:none;" href="https://stibarc.gq/post.html?id=')
      .concat(id)
      .concat('"><b>')
      .concat(
        item["title"]
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
      )
      .concat('</b></a><br><span class="posted-by">Posted by: <a href="https://stibarc.gq/user.html?id=')
      .concat(item["poster"])
      .concat('">')
      .concat(item["poster"])
    .concat('</a><br></span> </div> </div> </div>');
    lastid = id;
  } catch (err) {
    console.log(err);
  }
}

function getAnnounce() {
  var sess = window.localStorage.getItem("sess");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.stibarc.gq/getannounce.sjs?sess=" + sess, true);
  xhr.send(null);
  xhr.onload = function(e) {
    if (xhr.responseText != "\n") {
      var tmp = JSON.parse(xhr.responseText);
        document.getElementsByTagName("body")[0].innerHTML;
    }
  };
}

function checkSess() {
  var sess = window.localStorage.getItem("sess");
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "get",
    "https://api.stibarc.gq/checksess.sjs?sess=" + sess,
    false
  );
  xmlHttp.send(null);
  if (xmlHttp.responseText.split("\n")[0] == "bad") {
    window.localStorage.removeItem("sess");
    window.localStorage.removeItem("username");
    location.reload();
  }
}

function getUsername() {
  var sess = window.localStorage.getItem("sess");
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "https://api.stibarc.gq/getusername.sjs", false);
  xmlHttp.send("sess=" + sess);
  window.localStorage.setItem("username", xmlHttp.responseText.split("\n")[0]);
}

var lastid = 1;

function loadMore() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    "https://api.stibarc.gq/v2/getposts.sjs?id=" + lastid,
    false
  );
  xmlHttp.send(null);
  if (xmlHttp.responseText.trim() != "") {
    var tmp = JSON.parse(xmlHttp.responseText);
    var tmp2 = lastid - 1;
    for (var i = tmp2; i > tmp2 - 20; i--) {
      toLink(i, tmp[i]);
    }
  } else {
    document.getElementById("loadmorecontainer").style.display = "none";
  }
}

function doneLoading() {
  document.getElementById("load").style.display = "none";
  document.getElementById("page").style.display = "";
}

window.onload = function() {
  var offline = false;
  var sess = window.localStorage.getItem("sess");
  if (sess != undefined && sess != null && sess != "") {
    checkSess();
    document.getElementById("loggedout").style.display = "none";
    document.getElementById("loggedin").style.display = "";
    document.getElementById("footerout").style.display = "none";
    document.getElementById("footerin").style.display = "";
  }
  document.getElementById("loadmore").onclick = function(evt) {
    loadMore();
  };
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.stibarc.gq/v2/getposts.sjs", false);
  try {
    xmlHttp.send(null);
  } catch (err) {
    offline = true;
  }
  if (!offline) {
    getAnnounce();
    if (
      window.localStorage.getItem("username") == "" ||
      window.localStorage.getItem("username") == undefined
    ) {
      if (sess != undefined && sess != null && sess != "") {
        getUsername();
      }
    }
    var tmp = JSON.parse(xmlHttp.responseText);
    document.getElementById("list").innerHTML = "";
    for (var i = tmp["totalposts"]; i > tmp["totalposts"] - 20; i--) {
      toLink(i, tmp[i]);
    }
    document.getElementById("loadmorecontainer").style.display = "";
  } else {
    document.getElementById("list").innerHTML =
      "Error loading posts. Device offline.";
  }
  document.getElementById("sm-search-bar").style.display = "none";
  document.getElementById("search-btn").onclick = function(evt) {
    searchBtnClicked();
  };
  doneLoading();
  startNotifs();
};

//search btn //
function searchBtnClicked(){
  var searchBar = document.getElementById("sm-search-bar");
  if(searchBar.style.display == "none"){
    searchBar.style.display = "block";
    searchBar.querySelector('input').autofocus = true;
  }else{
    searchBar.querySelector('input').autofocus = false;
    searchBar.style.display = "none";
  }
}
