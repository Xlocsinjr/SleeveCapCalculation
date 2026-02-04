/**
 * visualisation.js
 *
 * This script creates a world map, a scatterplot and a bar chart showing data
 * from allData.json in progProject.html. This script is loaded by
 * progProject.html to create the charts.
 *
 * Sources:
 *  https://www.w3schools.com/howto/howto_js_rangeslider.asp
 *    for the slider.
 *  https://www.w3schools.com/howto/howto_js_dropdown.asp
 *    for the dropdown menu.
 *
 * Author: Xander Locsin
 * StudentID: 10722432
 */


// =================== INITIALISATIONS =========================================

// Copied from https://www.w3schools.com/howto/howto_js_rangeslider.asp
// Looks for the textarea in the document.
var inputField = document.getElementById("InputField");
var calcButton = document.getElementById("InputField");
var heightResultBox = document.getElementById("HeightResult");
var widthResultBox = document.getElementById("WidthResult");

// =================== MAIN FUNCTION DATA LOAD =================================

function main() {
    heightResultBox.contentEditable = false;
    widthResultBox.contentEditable = false;
}

// =================== FUNCTIONS ===============================================

var testCount = 0
function DoCalculation() {
  heightResultBox.textContent = testCount++;
  widthResultBox.textContent = testCount;
}

// ------------------- WHEN LOADED ---------------------------------------------
window.onload = function() {
  main();
};