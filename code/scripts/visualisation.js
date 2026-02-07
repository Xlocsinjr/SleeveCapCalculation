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
var waveFunctionDiv = document.getElementById("WaveFunction");

const nanResponse = "Input is not numeric!";
const defaultWaveFunction = "$$ y(x) = A \\; sin (\\frac{2 \\pi}{ \\lambda } \\; x ) $$";
const dx = 0.1;
const bigDWvl = 1.0
const smallDWvl = 0.01
const wvlAccuracy = 0.01

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

  // Calculate wavelength.
  var wavelength = NaN;
  var found = false;
  var overshotWvl = NaN;

  // Loop through different wavelengths 
  // and checks if the resulting arclength matches the armhole circumference.
  for (var trialWvl = bigDWvl; trialWvl < 100; trialWvl += bigDWvl) {
    widthResultBox.textContent = `Checking ${trialWvl} ...`;

    var arcLength = calc_arclength(amplitude, trialWvl);

    if (circumference < arcLength + wvlAccuracy && circumference > arcLength - wvlAccuracy) {
      wavelength = trialWvl;
      found = true;
      break;
    }

    // Break if overshot.
    if (arcLength > circumference) {
      overshotWvl = trialWvl;
      break;
    }
  }

  // If overshot, loop back in opposite direction with smaller interval
  if (!found) {
    for (var smallTrialWvl = overshotWvl - smallDWvl; smallTrialWvl >= overshotWvl - bigDWvl; smallTrialWvl -= smallDWvl) {
      widthResultBox.textContent = `Checking ${smallTrialWvl} ...`;
      var arcLength = calc_arclength(amplitude, smallTrialWvl);

      if (circumference < arcLength + wvlAccuracy && circumference > arcLength - wvlAccuracy) {
        wavelength = smallTrialWvl;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    widthResultBox.textContent = "Could not determine wavelength :(";
    return;
  }

  // Display wavefunction.
  var ampString = amplitude.toFixed(2);
  var wvlString = wavelength.toFixed(2);
  widthResultBox.textContent = wvlString;

  waveFunctionDiv.innerHTML = `$$ y(x) = ${ampString} \\; sin (\\frac{2 \\pi}{ ${wvlString} } \\; x ) $$`;
  MathJax.typeset();
}

// -----------------------------------------------------------------------------

function wave(A, wvl, x) {
  return A * Math.sin((2 * Math.PI * x) / wvl);
}

function dy(A, wvl, x) {
  return wave(A, wvl, x + dx) - wave(A, wvl, x);
}

function arcpart(A, wvl, x) {
  return Math.sqrt(Math.pow(dy(A, wvl, x), 2) + Math.pow(dx, 2));
}

function calc_arclength(A, wvl) {
  var L = 0;
  for (var x = dx; x <= wvl; x += dx) {
    L += arcpart(A, wvl, x)
  }
  return L;
}

// ------------------- WHEN LOADED ---------------------------------------------
window.onload = function () {
  main();
};