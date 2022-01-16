
/*
  WELCOME PAGE JAVASCRIPT
*/

/*
  WORD CHANGING COMPONENT
*/

// list of words
let words = ["TEDX", "AWESOME", "VERY NICE", "LOADING..."];
const wordChangeElem = document.querySelector("#wordChange");
// make container div big enough for all the words
var wordContainerElem = document.querySelector(".welcome-container");
wordContainerElem.style.paddingBottom = (words.length * window.innerHeight).toString() + "px";

// map words to y coordinates
let welcomeContainerStyle = window.getComputedStyle(wordContainerElem);
// calculate total height of container
let wContainerHeight = parseInt(welcomeContainerStyle.height);
let wContainerPaddingTop = parseInt(welcomeContainerStyle.paddingTop);
let wContainerPaddingBottom = parseInt(welcomeContainerStyle.paddingBottom);
var containerHeight = wContainerHeight + wContainerPaddingTop + wContainerPaddingBottom;

// divide total height into (words.length) parts and assign a word to each part
var word_map = [];
let div = containerHeight / words.length;
let mapping = div;
for (let i=0;i<words.length;i++) {
  word_map.push(mapping);
  mapping+=div;
}

// add function to change word based on y coordinates
var prev_index=0;
function updateWord (y) {
  // changes elem.innerHtml mapping the y coordinate to a word

  // find in what part y belongs
  var index;
  if(y <= word_map[0]){
    index = 0;
  }
  else {
    for( let i=1;i<word_map.length;i++ ) {
      if(y <= word_map[i] && y > word_map[i-1]){
        index = i;
        break;
      }
    }
  }

  if(index != prev_index){
    let a = wordChangeElem;
    a.classList.remove("visible_up");
    a.classList.remove("visible_down");
    if(index > prev_index) a.classList.add("invisible_up");
    else if (index < prev_index) a.classList.add("invisible_down");
    a.onanimationend = () => {
      a.classList.remove("invisible_up");
      a.classList.remove("invisible_down");
      if(index > prev_index) a.classList.add("visible_up");
      else if (index < prev_index) a.classList.add("visible_down");
      a.innerHTML = words[index];
      prev_index = index;
    };
  }
}

// add event listener to update on scroll
window.addEventListener("scroll", function (e) {
  updateWord(this.scrollY);
});

// initialize word element with the first word
wordChangeElem.innerHTML = words[0];

/*
  PARTICLES
*/

//canvas functions
function createCanvas(properties){
    let canvas = document.createElement('canvas');
    canvas.setAttribute("id", properties.id);
    canvas.width = properties.width;
    canvas.height = properties.height;
    let context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context
    }
  }

function writeText(canvas, context, text, color="#1111111"){
    let size = 100
    context.font = size + "px Montserrat";
    context.fillStyle = color;
    context.textAlign = "center";
    let lineheight = 70
    let lines = text.split('\n');
    for(let i = 0; i<lines.length; i++){
        context.fillText(lines[i], canvas.width/2, canvas.height/2 + lineheight*i - (lineheight*(lines.length-1))/3);
    }
}

function maskCanvas(){
    c3.context.drawImage(c2.canvas, 0, 0, c2.canvas.width, c2.canvas.height);
    c3.context.globalCompositeOperation = 'source-atop';
    c3.context.drawImage(c1.canvas, 0, 0);
   // blur(c2.context,c2.canvas, 2);
}

//Particle functions
class Particle{
  constructor(c, x, y, directionX, directionY, size, color){
    this.canvas = c.canvas;
    this.ctx = c.context;
    this.x=x;
    this.y=y;
    this.directionX=directionX;
    this.directionY=directionY;
    this.size=size;
    this.color=color;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  update() {
    if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray=[];
  let numberOfParticles=1000;
  for (let i=0; i<numberOfParticles; i++){
    let size = (Math.random() *20)+20;
    // let x = (Math.random() * ((c1.canvas.width - size * 2) - (size * 2)) + size * 2);
    // let y = (Math.random() * ((c1.canvas.height - size * 2) - (size * 2)) + size * 2);
    let x = c1.canvas.width/2;
    let y = c1.canvas.height/2;
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let color = size > 30 ? "#FF0000" : "#f03030";

    particlesArray.push(new Particle(c1,x,y,directionX,directionY,size,color));
  }
}

function animate() {
  c1.context.clearRect(0,0,c1.canvas.width, c1.canvas.height);
  for(let i=0; i<particlesArray.length; i++){
    particlesArray[i].update();
  }
  maskCanvas();
  id = requestAnimationFrame(animate);
}


//main
    let particlesArray=[];
    //crate the canvas
    let c1 = createCanvas({width: window.innerWidth, height: window.innerHeight, id: "c1"}); //c1 -> particles
    let c2 = createCanvas({width: window.innerWidth, height: window.innerHeight, id: "c2"}); //c2 -> text
    let c3 = createCanvas({width: window.innerWidth, height: window.innerHeight, id: "c3"}); //c3 -> the canvas on which we will draw c1 and c2
    //add c3 to html
    let wrap = document.getElementById("canvas-container");
    wrap.appendChild(c3.canvas);
    //wrap.appendChild(c1.canvas);
    //wrap.appendChild(c2.canvas);
    let text = "TEDxNTUA 2022\n";
    writeText(c2.canvas, c2.context, text);

    init();
    var id = requestAnimationFrame(animate);

    window.addEventListener('resize', function(e){
      cancelAnimationFrame(id);
      c3.canvas.width = window.innerWidth;
      c1.canvas.width = window.innerWidth;
      c2.canvas.width = window.innerWidth;

      c3.canvas.height = window.innerHeight;
      c1.canvas.height = window.innerHeight;
      c2.canvas.height = window.innerHeight;

      writeText(c2.canvas, c2.context, text);
      init();
      requestAnimationFrame(animate);
    });
