
/* --- WELCOME PAGE JAVASCRIPT --- */

/* --- WORD CHANGING COMPONENT --- */

// list of words
var words = ["TEDX", "AWESOME", "VERY NICE", "LOADING..."];
var range = 1000;
const wordChangeElem = document.querySelector("#wordChange");

// map range to each word
var word_map = [];
let mapping = range;
for (let i=0;i<words.length;i++) {
  word_map.push(mapping);
  mapping+=range;
}

// add event listener to update Y coordinate on wheel
var cordY = 0;
var transition_animation = false; // used in transitions
window.addEventListener("wheel", function (e) {
  if(cordY <= 0) cordY=0;
  if(!transition_animation) cordY += parseInt(e.deltaY);
  updateWord(cordY);
});

// add function to change word based on Y coordinate
var prev_index=0;
function updateWord (y) {
  // changes the innerText of the element mapping the Y coordinate to a word

  // find in what part y belongs
  var index; // index of word mapped to current Y coordinate
  if(y <= word_map[0]){
    index = 0; // return first word in list if Ycord < 0
  }
  if(y >= word_map[word_map.length-1]) index = word_map.length-1;
  else {
    for( let i=1;i<word_map.length;i++ ) {
      if(y <= word_map[i] && y > word_map[i-1]){
        index = i;
        break;
      }
    }
  }

  // animate word transition
  if(index != prev_index){
    let a = wordChangeElem;

    a.classList.remove("visible_up");
    a.classList.remove("visible_down");

    // move both words upwards when exiting/entering
    var direction = "up";
    // move both words downwards when exiting/entering
    if (index < prev_index) direction = "down";

    a.classList.add(`invisible_${direction}`);

    // make new word appear once old one dissapears
    a.onanimationend = () => {
      a.classList.remove("invisible_up");
      a.classList.remove("invisible_down");

      a.classList.add(`visible_${direction}`);
      // change innerText to new word
      a.innerText = words[index];
      prev_index = index;
    };
  }
}

// initialize word element with the first word
wordChangeElem.innerHTML = words[0];

/* --- PARTICLES --- */

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

/* --- TRANSITION --- */

// Detect when reaching the end of the welcome page
var welcomePage = document.getElementById("welcomePage"); // welcome page container
var mainPage = document.getElementById("mainPage"); // main page container
var mainStartY = range * words.length; // Y coordinate that transition event happens
var mainActiveLast = false; // main page was the last active page

// SLIDERS
var slider1 = document.getElementById("slider1");
var slider2 = document.getElementById("slider2");
var delay = 200 // delay in ms between the two slider's animations

// Main Event Listener for transitions
window.addEventListener("wheel", function () {
  // debug
  // console.log(`(${cordY}, ${mainStartY})`);

  if (mainActiveLast) {
    // MAIN PAGE -> WELCOME PAGE
    if (cordY < mainStartY && this.scrollY == 0) {

      // animate slider and new page
      pageTransition(
        sliders = [slider1, slider2],
        slider_animation = "slider_down",
        delay = delay,
        new_page = welcomePage,
        old_page = mainPage,
        page_animation = "page_down");

      mainActiveLast = !mainActiveLast;
    }
  }
  else {
    // WELCOME PAGE -> MAIN PAGE
    if (cordY >= mainStartY) {

      // animate slider and new page
      pageTransition(
        sliders = [slider1, slider2],
        slider_animation = "slider_up",
        delay = delay,
        new_page = mainPage,
        old_page = welcomePage,
        page_animation = "page_up");

      mainActiveLast = !mainActiveLast;
    }
  }
});

function pageTransition (sliders, slider_animation, delay, new_page, old_page, page_animation) {
  // animate sliders and page

  old_page.style.zIndex = 0;

  // disable scrolling until animation finishes
  disableScroll();

  // disable wheel registering
  transition_animation = true;

  // animate slider and new page
  let tempDelay = 0;
  for (let i=0; i<sliders.length; i++) {
    sliders[i].style.zIndex = 2;
    setTimeout(function () { sliders[i].classList.add(slider_animation); }, tempDelay);
    tempDelay += delay;
  }
  new_page.classList.add(page_animation);

  // make new page appear on top
  new_page.style.zIndex = 1;
  new_page.style.display = "block";

  sliders[0].onanimationend = () => {
    // remove animation class
    let tempDelay = 0;
    for (let i=0; i<sliders.length; i++) {
      sliders[i].style.zIndex = 0;
      setTimeout(function () { sliders[i].classList.remove(slider_animation); }, delay);
      tempDelay += delay;

    transition_animation = false;
    }
    new_page.classList.remove(page_animation);

    enableScroll();

    // make old page dissapear
    old_page.style.display = "none";
  };

}

function disableScroll() {
  // adds class that disables scrolling to body
  document.body.classList.add("stop-scrolling");
}

function enableScroll() {
  // removes class that disables scrolling from body
    document.body.classList.remove("stop-scrolling");
}
