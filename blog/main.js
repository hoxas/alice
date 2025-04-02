const main = document.getElementById("main");
const post = document.getElementById("post");

function fetchFileInfo(htmlElement) {
  const parser = new DOMParser();
  const fileItem = parser.parseFromString(htmlElement.innerHTML, "text/html");
  const innerElement = fileItem.getElementsByTagName("a")[0];
  const fileLink = innerElement.href;
  const fileName = innerElement.getElementsByClassName("name")[0].innerHTML.replace(".txt", "");
  const fileDate = innerElement.getElementsByClassName("date")[0].innerHTML;
  return {
    fileLink,
    fileName,
    fileDate
  };
}

async function openPost(postInfo) {
  const response = await fetch(postInfo.fileLink);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
    return;
  }
  let text = await response.text();
  text = text.replaceAll("\n", "<br>");
  console.log(text);
  main.style.display = "none";
  post.innerHTML = `
  <div id="postHeader">
  <div id="postTitle">
    <h2>${postInfo.fileName}</h2><p>${postInfo.fileDate}</p>
  </div>
  <button id="backButton">&larr;</button>
  </div>
  <div id="postContent">
  ${text}
  </div>
  `;
  const backButton = document.getElementById("backButton");
  backButton.addEventListener("click", (e) => {
    e.preventDefault();
    post.innerHTML = "";
    main.style.display = "flex";
  })
}

function createPost(postInfo) {
  const post = document.createElement("div");
  post.classList.add("post");
  const postHeader = document.createElement("div");
  postHeader.classList.add("postHeader");
  const postLink = document.createElement("a");
  postLink.href = postInfo.fileLink;
  postLink.addEventListener("click", (e) => {
    e.preventDefault();
    const fileLink = postLink.href;
    openPost(postInfo);
    
  });
  const postTitle = document.createElement("h2");
  postTitle.innerHTML = `${postInfo.fileName} - ${postInfo.fileDate}`;
  postLink.appendChild(postTitle);
  postHeader.appendChild(postLink);
  post.appendChild(postHeader);
  return post;
}

async function loadPosts() {
  const response = await fetch("posts/")
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
    return;
  }
  const parser = new DOMParser();
  const posts = parser.parseFromString(await response.text(), "text/html");
  const postsDomElements = posts.getElementById("files").children;
  const postList = [];
  for (let i = 1; i < postsDomElements.length; i++) {
    const postInfo = fetchFileInfo(postsDomElements[i]);
    postList.push(postInfo);
  }
  
  for (const post of postList) {
    main.appendChild(createPost(post));
  }
}

loadPosts();