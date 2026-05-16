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
var calcPart = document.getElementById("calcPart")
var explanationPart = document.getElementById("explanationPart")
var inputField = document.getElementById("InputField");
var radioUnder = document.getElementById("SeamUnder");
var radioBack = document.getElementById("SeamBack");
var calcButton = document.getElementById("calcButton");
var heightResultBox = document.getElementById("HeightResult");
var widthResultBox = document.getElementById("WidthResult");
var waveFunctionDiv = document.getElementById("WaveFunction");
var pointColumns = [document.getElementById("PointsCol1"), document.getElementById("PointsCol2"), document.getElementById("PointsCol3"), document.getElementById("PointsCol4")]

const nanResponse = "Input is not numeric!";
const defaultWaveFunction = "$$ y(x) = A \\; sin (\\frac{2 \\pi}{ \\lambda } \\; x ) $$";
const dx = 0.01;
const bigDWvl = 0.1
const smallDWvl = 0.001
const circAccuracy = 0.01
const pointInterval = 2.0

var isCalculated = false

// =================== MAIN FUNCTION DATA LOAD =================================

function main() {
  heightResultBox.contentEditable = false;
  widthResultBox.contentEditable = false;
}

// =================== FUNCTIONS ===============================================

function DoCalcSelect() {
  calcPart.style = "display: visible;"
  explanationPart.style = "display: none;";
}

// -----------------------------------------------------------------------------

function DoExplanationSelect() {
  calcPart.style = "display: none;"
  explanationPart.style = "display: visible;"
}

// -----------------------------------------------------------------------------

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

  var calculation = CalculateWaveParameters(circumference, 45);
  var amplitude = calculation[0];
  var wavelength = calculation[1];

  var sleeveCapHeight = 2 * amplitude;
  heightResultBox.textContent = sleeveCapHeight.toFixed(2);
  widthResultBox.textContent = wavelength.toFixed(2);

  // Display wavefunction.
  var ampString = amplitude.toFixed(2);
  var wvlString = wavelength.toFixed(2);
  widthResultBox.textContent = wvlString;

  var funcString = "cos"
  // https://www.geeksforgeeks.org/javascript/how-to-check-whether-a-radio-button-is-selected-with-javascript/
  if (radioBack.checked) { funcString = "sin"; GeneratePoints(amplitude, wavelength, 0); }
  else { GeneratePoints(amplitude, wavelength, -0.5 * Math.PI); }

  waveFunctionDiv.innerHTML = `$$ y(x) = ${ampString} + ${ampString} \\; ${funcString} (\\frac{2 \\pi}{ ${wvlString} } \\; x ) $$`;
  MathJax.typeset();
}

// -----------------------------------------------------------------------------

function CalculateWaveParameters(circumference, sleeveAngle) {
  console.log("begin")
  var angle = DegToRad(sleeveAngle);
  var amplitude = (circumference / (2 * Math.PI)) * Math.cos(angle);
  var resultWavelength = 0;

  // Calculate the arc lengths for different wavelengths until a given wavelength
  // is found that results in an arc length that is equal to the armhole circumference.
  var EndBigWvl = 0;
  var arcLength = 0;
  var wvlLowerBound = 0.7 * circumference;
  console.log("about to enter wvl loop")
  for (var wavelength = wvlLowerBound; wavelength < 100.0; wavelength += bigDWvl) {
    arcLength = CalcArclength(amplitude, wavelength)
    console.log("Finished arclength calculation")
    // Stop at the first found arc length that stepped over the circumference,
    // and register at what wavelength it ended.
    if (arcLength > circumference) {
      EndBigWvl = wavelength;
      break
    }
  }

  // Loop back in smaller steps until the wavelength is found.
  for (var wavelength = EndBigWvl - smallDWvl; wavelength > wvlLowerBound; wavelength -= smallDWvl) {
    // Consider the wavelength found if the arc length stepped back over the circumference again.
    arcLength = CalcArclength(amplitude, wavelength)
    if (arcLength <= circumference) {
      resultWavelength = wavelength
      break;
    }
  }

  var resultArray = new Array(amplitude, resultWavelength)
  return resultArray;
}

// -----------------------------------------------------------------------------

function GeneratePoints(amp, wvl, phase) {
  var targetCol = pointColumns[0];
  var fourthCount = 0;
  var nextFourth = 0.25 * wvl;

  var tableString = "<tr> <th> X (cm) </th> <th> Y (cm) </th> </tr>";
  for (var x = 0; x <= wvl; x += pointInterval) {

    var y = amp + amp * Math.sin(((2 * Math.PI) / wvl) * x + phase);

    var tableElementString = `<tr> <th>${x.toFixed(2)}</th> <th>${y.toFixed(2)}</th> </tr>`;
    tableString += tableElementString;

    if (x + pointInterval >= nextFourth) {
      var fourthY = amp + amp * Math.sin(((2 * Math.PI) / wvl) * nextFourth + phase);
      tableString += `<tr> <th><b>${nextFourth.toFixed(2)}</b></th> <th><b>${fourthY.toFixed(2)}</b></th> </tr>`;

      targetCol.innerHTML = tableString;
      fourthCount++;
      nextFourth = (fourthCount + 1) * 0.25 * wvl;
      targetCol = pointColumns[fourthCount];
      tableString = "<tr> <th> X (cm) </th> <th> Y (cm) </th> </tr>";
    }
  }
}

// -----------------------------------------------------------------------------

function Wave(A, wvl, x) {
  return A * Math.sin(((2 * Math.PI) / wvl) * x);
}

function Dy(A, wvl, x, dx) {
  return Wave(A, wvl, x + dx) - Wave(A, wvl, x);
}

function arcpart(A, wvl, x, dx) {
  var dy = Dy(A, wvl, x, dx);
  var result = Math.sqrt(dy * dy + dx * dx);
  return result;
}

function CalcArclength(A, wvl) {
  var L = 0;
  var dx = wvl / 1000.0;

  for (var x = 0.01; x < wvl + dx; x += dx) {
    L += arcpart(A, wvl, x, dx);
  }
  return L;
}

function DegToRad(angle) {
  return (angle / 360) * 2 * Math.PI;
}

// ------------------- WHEN LOADED ---------------------------------------------
window.onload = function () {
  main();
};