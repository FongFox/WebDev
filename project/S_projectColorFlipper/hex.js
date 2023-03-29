var hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
var btnElement = document.querySelector('button'); 
//console.log(btnElement);
var textBtnElement = document.querySelector('.color');
//console.log(textBtnElement);



function getRandomItems(items) {
    var length = items.length - 1;
    return Math.round(Math.random() * length);
    //setTimeout(Math.round(Math.random() * length), 2000);
}

// for(var i = 0; i < hex.length; i++) {
//     //console.log(getRandomIndex(hex));
//     //setTimeout(console.log(getRandomIndex(hex)), 5000);
//     //getRandomIndex(hex);
//     console.log(getRandomIndex(hex));
// }

// function getRamdomcolor (items1, items2) {
//     // var length = hexColors.length;
//     for(var i = 0; i < 6; i++) {
//         items1 += items2[getRandomItems(items2)];
//     }
//     //console.log(hexColors);
//     //console.log(typeof hexColors);
//     document.body.style.backgroundColor = items1;
// }

// btnElement.addEventListener("click", getRamdomcolor(hexColors, hex));
 
function getRamdomcolor() {
    var hexColors = [7]; hexColors[0] = "#";
    for(var i = 0; i < 6; i++) {
        hexColors += hex[getRandomItems(hex)];
    }
    return hexColors;
}

btnElement.addEventListener("click", function() {
    var color = getRamdomcolor();
    document.body.style.backgroundColor = color;
    textBtnElement.textContent = color;
});
