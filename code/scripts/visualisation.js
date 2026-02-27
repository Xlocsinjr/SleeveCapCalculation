/**
 * visualisation.js
 *
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
var waveFunctionDiv = document.getElementById("WaveFunction");

const nanResponse = "Input is not numeric!";
const defaultWaveFunction = "$$ y(x) = A \\; sin (\\frac{2 \\pi}{ \\lambda } \\; x ) $$";
const dx = 0.1;
const bigDWvl = 2.0
const smallDWvl = 0.01
const circAccuracy = 0.01

// =================== MAIN FUNCTION DATA LOAD =================================

function main() {
  heightResultBox.contentEditable = false;
  widthResultBox.contentEditable = false;
}

// =================== FUNCTIONS ===============================================

function DoCalculation() {
  // Clear result boxes.
  heightResultBox.textContent = "";
  widthResultBox.textContent = "";
  waveFunctionDiv.innerHTML = defaultWaveFunction;
  MathJax.typeset();

  // Gather user input.
  var userInput = inputField.value;
  var circumference = parseFloat(userInput)
  // Check if user input can be parsed to float.
  if (!circumference) {
    heightResultBox.textContent = nanResponse;
    widthResultBox.textContent = nanResponse;
    return
  }

  // Calculate Amplitude.
  // C = pi D,    => D = C / pi
  // 2a^2 = D^2,  => a = sqrt(D^2 / 2)
  // A = a / 2   = sqrt(D^2 / 2) / 2 = sqrt( (C / pi)^2 / 2) / 2
  var sleeveCapHeight = Math.sqrt(Math.pow(circumference / Math.PI, 2) / 2);
  var amplitude = sleeveCapHeight / 2;
  heightResultBox.textContent = sleeveCapHeight.toFixed(2);

  // Calculate wavelength
  // See CircToWavelength.py on how the 0.86883832 parameter is calculated.
  var wavelength = 0.86883832 * circumference
  widthResultBox.textContent = wavelength.toFixed(2);

  // Display wavefunction.
  var ampString = amplitude.toFixed(2);
  var wvlString = wavelength.toFixed(2);
  widthResultBox.textContent = wvlString;

  waveFunctionDiv.innerHTML = `$$ y(x) = ${ampString} \\; sin (\\frac{2 \\pi}{ ${wvlString} } \\; x ) $$`;
  MathJax.typeset();
}

// ------------------- WHEN LOADED ---------------------------------------------
window.onload = function () {
  main();
};