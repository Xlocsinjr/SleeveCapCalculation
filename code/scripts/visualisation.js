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
var radioUnder = document.getElementById("SeamUnder");
var radioBack = document.getElementById("SeamBack");
var calcButton = document.getElementById("calcButton");
var heightResultBox = document.getElementById("HeightResult");
var widthResultBox = document.getElementById("WidthResult");
var waveFunctionDiv = document.getElementById("WaveFunction");
var pointsTable = document.getElementById("PointsTable")

const nanResponse = "Input is not numeric!";
const defaultWaveFunction = "$$ y(x) = A \\; sin (\\frac{2 \\pi}{ \\lambda } \\; x ) $$";
const dx = 0.1;
const bigDWvl = 2.0
const smallDWvl = 0.01
const circAccuracy = 0.01
const pointInterval = 2.0

var isCalculated = false

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

  var funcString = "cos"
  // https://www.geeksforgeeks.org/javascript/how-to-check-whether-a-radio-button-is-selected-with-javascript/
  if (radioBack.checked){ funcString = "sin"; GeneratePoints(amplitude, wavelength, 0); }
  else{ GeneratePoints(amplitude, wavelength, 0.5*Math.PI); }

  waveFunctionDiv.innerHTML = `$$ y(x) = ${ampString} + ${ampString} \\; ${funcString} (\\frac{2 \\pi}{ ${wvlString} } \\; x ) $$`;
  MathJax.typeset();
}

// -----------------------------------------------------------------------------

function GeneratePoints(amp, wvl, phase){
  var tableString = "<tr> <th> X </th> <th> Y </th> </tr>";

  var fourthCount = 0;
  var nextFourth = 0.25 * wvl;

  for (var x = 0; x <= wvl; x += pointInterval){
    var y = amp + amp * Math.sin( ((2 * Math.PI)/wvl) * x + phase );

    var tableElementString = `<tr> <th>${x.toFixed(2)}</th> <th>${y.toFixed(2)}</th> </tr>`;
    tableString += tableElementString;

    if (x + pointInterval >= nextFourth){
      var fourthY =  amp + amp * Math.sin( ((2 * Math.PI)/wvl) * nextFourth + phase );
      tableString += `<tr> <th><b>${nextFourth.toFixed(2)}</b></th> <th><b>${fourthY.toFixed(2)}</b></th> </tr>`;
    
      fourthCount++;
      nextFourth = (fourthCount + 1) * 0.25 * wvl;
    }
  }
  pointsTable.innerHTML = tableString;
}

// ------------------- WHEN LOADED ---------------------------------------------
window.onload = function () {
  main();
};