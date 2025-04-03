const mainCanvas = document.getElementById('mainCanvas');

const ctx = mainCanvas.getContext('2d');

mainCanvas.width = window.innerWidth;
mainCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  if (window.innerWidth >= 900 || window.innerWidth !== mainCanvas.width) {
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight;
  }
});

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

strokeStyleColors = ['#000', '#222']

ctx.strokeStyle = '#222';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(Math.floor(Math.random() * mainCanvas.width), Math.floor(Math.random() * mainCanvas.height));

/* setInterval(() => {
    ctx.lineTo(Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight));
    ctx.stroke();
}, 100); */


let lastTime

function drawCanvasLines(time) {
  if (lastTime != null) {
    const deltaTime = time - lastTime;
    if (deltaTime >= 10) {
      ctx.lineTo(Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight));
      ctx.stroke();
    }
  }
  lastTime = time;
  
  window.requestAnimationFrame(drawCanvasLines);
}

window.requestAnimationFrame(drawCanvasLines);
