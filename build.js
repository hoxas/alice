// Hello
const fs = require('fs');
const path = require('path');
const exec = require('child_process');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class Builder {
  constructor() {
    this.indexFile = path.join(__dirname, 'blog', 'index.json');
    this.postsPath = path.join(__dirname, 'blog', 'posts');
    this.textsPath = path.join(__dirname, 'blog', 'texts');
    this.postTemplatePath = path.join(__dirname, 'blog', 'post_template.html');
    this.files = fs.readdirSync(this.textsPath);
    this.indexContent = [];
  }
  
  cleanup() {
    // Clear index file
    if (fs.existsSync(this.indexFile)) {
      fs.unlinkSync(this.indexFile);
      console.log('index.json deleted');
    }
    
    // Clear posts path
    if (fs.existsSync(this.postsPath)) {
      fs.rmdirSync(this.postsPath, { recursive: true });
      console.log('posts folder cleared');
    }
    fs.mkdirSync(this.postsPath);
  }
  
  getFileInfo(file) {
    const name = path.basename(file, '.txt');
    const link = `/blog/posts/${encodeURI(name)}.html`;
    // Get file creation date
    const stats = fs.statSync(file) 
    const createdAt = new Date(stats.birthtimeMs).toLocaleString('pt-BR');
    
    return {
      name,
      createdAt,
      link
    };
  }
  
  createHtml(file, fileInfo) {
    console.log(`Creating ${fileInfo.name}.html`);
    
    const text = fs.readFileSync(path.join(this.textsPath, file), 'utf8');
    const formattedText = text.replace(/\n/g, '<br>');
    
    const template_html = fs.readFileSync(this.postTemplatePath, 'utf8');
    const template = new JSDOM(template_html);
    const document = template.window.document;
    
    document.querySelector('#post').innerHTML = `
    <div id="postHeader">
      <div id="postTitle">
        <h2>${fileInfo.name}</h2><p>${fileInfo.createdAt}</p>
      </div>
      <a href="/blog/main.html" id="backButton">&larr;</a>
    </div>
    <div id="postContent">
      ${formattedText}
    </div>
    `;
    
    fs.writeFileSync(path.join(this.postsPath ,`${fileInfo.name}.html`), template.serialize());
  }
  
  sortIndex() {
    this.indexContent.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });
  }
  
  createIndex() {
    console.log('Creating index.json');
    const indexJson = JSON.stringify(this.indexContent, null, 2);
    fs.writeFileSync(this.indexFile, indexJson);
  }
  
  build() {
    this.cleanup();
    this.files.forEach(file => {
      const fileInfo = this.getFileInfo(path.join(this.textsPath, file));
      this.indexContent.push(fileInfo);
      this.createHtml(file, fileInfo);
    });
    this.sortIndex();
    this.createIndex();
  }
}

// Get arguments from command line
// const args = process.argv.slice(2);

const builder = new Builder();
builder.build();