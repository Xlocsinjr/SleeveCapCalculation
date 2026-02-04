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
var calcButton = document.getElementById("calcButton");
var heightResultBox = document.getElementById("HeightResult");
var widthResultBox = document.getElementById("WidthResult");

const nanResponse = "Input is not numeric!"

// =================== MAIN FUNCTION DATA LOAD =================================

function main() {
    heightResultBox.contentEditable = false;
    widthResultBox.contentEditable = false;
}

// =================== FUNCTIONS ===============================================

function DoCalculation() {
  // Clear result boxes.
  heightResultBox.textContent = nanResponse;
  widthResultBox.textContent = nanResponse;

  // Check if user input can be parsed to float.
  var userInput = inputField.value;
  var isNumeric = parseFloat(userInput)
  if (!isNumeric) {
    heightResultBox.textContent = nanResponse;
    widthResultBox.textContent = nanResponse;
    return
  }

  // Calculate
  heightResultBox.textContent = "Test";
  widthResultBox.textContent = "Test";
}

// ------------------- WHEN LOADED ---------------------------------------------
window.onload = function() {
  main();
};