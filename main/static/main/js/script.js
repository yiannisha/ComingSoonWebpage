
/*
  WELCOME PAGE JAVASCRIPT
*/

/*
  WORD CHANGING COMPONENT
*/

// list of words
let words = ["TEDX", "AWESOME", "VERY NICE", "LOADING..."];

// make container div big enough for all the words
var wordContainerElem = document.querySelector(".welcome-container");
wordContainerElem.style.paddingBottom = words.length * window.innerHeight;
// console.log(window.getComputedStyle(wordContainerElem).paddingBottom);

// map words to y coordinates
let welcomeContainerStyle = window.getComputedStyle(wordContainerElem);
// calculate total height of container
let wContainerHeight = parseInt(welcomeContainerStyle.height);
let wContainerPaddingTop = parseInt(welcomeContainerStyle.paddingTop);
let wContainerPaddingBottom = parseInt(welcomeContainerStyle.paddingBottom);
var containerHeight = wContainerHeight + wContainerPaddingTop + wContainerPaddingBottom;
//console.log(containerHeight);

// divide total height into (words.length) parts and assign a word to each path
var word_map = [];
let div = containerHeight / words.length;
let mapping = div;
for (let i=0;i<words.length;i++) {
  word_map.push(mapping);
  mapping+=div;
}
console.log(word_map);

// add function to change word based on y coordinates
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

  document.querySelector(".word-container").innerHTML = words[index];
}

// add event listener to element
window.addEventListener("scroll", function (e) {
  console.log(this.scrollY);
  updateWord(this.scrollY);
});

// call updateWord one time manually to initially write the first word
updateWord(0);
