const main = document.getElementById("main");

async function loadPosts() {
  const response = await fetch("/blog/index.json");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
    return;
  }
  
  const posts = await response.json();
  for (const post of posts) {
    const postLink = document.createElement("a");
    postLink.href = post.link;
    postLink.classList.add("postLink");
    postLink.innerHTML = `<span class="icon" style="visibility: hidden;">☠</span><h2>${post.name}</h2><span class="createdAt">(${post.createdAt})</span>`;
    main.appendChild(postLink);
  }
}

loadPosts();