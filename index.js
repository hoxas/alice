const body = document.getElementsByTagName('body')[0];
const leftCanvas = document.getElementById('leftCanvas');
const rightCanvas = document.getElementById('rightCanvas');

class Text {
  constructor(text, position=0) {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', `/texts/${text}.txt`, false);
      request.send(null);
      
      if (request.status === 200) {
        this.text = request.responseText;
        this.position = position;
        this.restarted = false;
      } else {
        throw new Error('Text not found');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  getChars() {
    if (this.position >= this.text.length) {
      this.position = 0;
      this.restarted = true;
      return '<br>';
    }
    const char = this.text[this.position]
    this.position += 1;
    if (char === '\n') {
      return `<br>`;
    }
    return char;
  }
}

let textFolder = Math.floor(Math.random() * 2) + 1;
const textLeft = new Text(`${textFolder}/left`);
const textRight = new Text(`${textFolder}/right`);

const endChoices = ['A', 'a', '<br>'];

function getChoices() {
  return endChoices[Math.floor(Math.random() * endChoices.length)];
}

setInterval(() => {
  if (!textLeft.restarted) {
    leftCanvas.innerHTML += `${textLeft.getChars()}`;
  }
  if (!textRight.restarted) {
    rightCanvas.innerHTML += `${textRight.getChars()}`;
  }
  // body.style.backgroundColor = `rgb(${Math.random()*40},${Math.random()*10},${Math.random()*10})`;
}, 100);