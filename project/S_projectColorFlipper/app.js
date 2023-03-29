var colors = ["#16a085", "#f39c12", "#34495e", "#3498db", "#e74c3c", "#fff"];
var btnElement = document.querySelector("button"); //console.log(btnElement);
var colorELement = document.querySelector(".color"); //console.log(colorELement);
var anchorsElement = document.querySelectorAll('a');
//console.log(anchorsElement);

function getRandomIndex(arrlength) {
    var length = arrlength - 1;
    return Math.round(Math.random() * length);
}


function changebackgroundColor () {
    //get random number between 0 - 4
    var randomIndex = getRandomIndex(colors.length);
    //get random color
    var randomColor = colors[randomIndex];
    //console.log(randomIndex);
    document.body.style.backgroundColor = randomColor;
    colorELement.textContent = randomColor;
    //console.log(randomIndex);
}

btnElement.addEventListener("click",changebackgroundColor);

for(var i = 0, length = anchorsElement.length; i < length; i++) {
    //console.log(anchorsElement[i]);
    anchorsElement[i].setAttribute("target","_blank");
}
//anchorsElement[0].setAttribute("target","_blank");
console.log(anchorsElement[0]);

// for(var i in anchorsElement) {
//     console.log(anchorsElement[i]);
// }