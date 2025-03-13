// Main content container
const content = document.getElementById("content");

// Notepad and header for dragging functionality
const notepad = document.getElementById("notepad-outer");
const notepadHeader = document.getElementById("notepad-header");

// Calculator and header for dragging functionality
const calculator = document.getElementById("calc-outer");
const calculatorHeader = document.getElementById("calc-header");

// Variables for calculator operations
let currentInput = ""; // Stores current user input
let operator = ""; // Stores the selected operator
let firstOperand = null; // Stores the first operand for calculations
const resultWindow = document.getElementById("result-window"); // Calculator display

// Variables for drag functionality
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let lastIndex = 10; // Tracks z-index for current element focus

/**
 * Evaluates the mathematical expression based on given operands and operator.
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @param {string} op - Operator (+, -, *, /)
 * @returns {number|string} - Returns the computed result or "Error" for division by zero
 */
function evaluate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b !== 0 ? a / b : "Error";
    default:
      return b;
  }
}

// Click handlers
document.addEventListener("click", (event) => {
  let nextIndex = lastIndex + 1;

  // Bring clicked elements to the front
  if (notepad.contains(event.target)) {
    notepad.style.zIndex = nextIndex;
  }

  if (calculator.contains(event.target)) {
    calculator.style.zIndex = nextIndex;
  }

  if (content.contains(event.target)) {
    content.style.zIndex = nextIndex;
  }

  // Handle calculator button clicks
  if (event.target.classList.contains("button-square")) {
    event.target.classList.add("animate-press");
    setTimeout(() => event.target.classList.remove("animate-press"), 100);
    
    let value = event.target.innerText;

    if (!isNaN(value) || value === ".") {
      // Append digit or decimal
      currentInput += value;
      resultWindow.innerText = currentInput;
    } else if (["+", "-", "*", "/"].includes(value)) {
      // Handle operator
      if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
      } else if (currentInput !== "") {
        firstOperand = evaluate(firstOperand, parseFloat(currentInput), operator);
        resultWindow.innerText = firstOperand;
      }
      operator = value;
      currentInput = "";
    } else if (value === "=") {
      // Handle equals
      if (firstOperand !== null && currentInput !== "") {
        resultWindow.innerText = evaluate(firstOperand, parseFloat(currentInput), operator);
        firstOperand = null;
        currentInput = "";
        operator = "";
      }
    } else if (value === "C") {
      // Handle clear
      currentInput = "";
      firstOperand = null;
      operator = "";
      resultWindow.innerText = "0";
    } else if (value === "+-") {
      // Toggle positive/negative
      if (currentInput !== "") {
        currentInput = (-parseFloat(currentInput)).toString();
        resultWindow.innerText = currentInput;
      }
    } else if (value === "%") {
      // Convert to percentage
      if (currentInput !== "") {
        currentInput = (parseFloat(currentInput) / 100).toString();
        resultWindow.innerText = currentInput;
      }
    }
  }

  lastIndex = nextIndex;
});

// Drag
document.addEventListener("mousedown", (event) => {
  let nextIndex = lastIndex + 1;

  if (notepadHeader.contains(event.target)) {
    if (!notepad.classList.contains("active")) {
      notepad.style.zIndex = nextIndex;
    }
    document.body.classList.add("interacting");
    notepadHeader.classList.add("grabbing");
    offsetX = event.clientX - notepad.offsetLeft;
    offsetY = event.clientY - notepad.offsetTop;
  }

  if (calculatorHeader.contains(event.target)) {
    if (!calculator.classList.contains("active")) {
      calculator.style.zIndex = nextIndex;
    }
    document.body.classList.add("interacting");
    calculatorHeader.classList.add("grabbing");
    offsetX = event.clientX - calculator.offsetLeft;
    offsetY = event.clientY - calculator.offsetTop;
  }

  isDragging = true;
  lastIndex = nextIndex;
});

document.addEventListener("mouseup", () => {
  if (notepadHeader.classList.contains("grabbing")) {
    notepadHeader.classList.remove("grabbing");
  }
  if (calculatorHeader.classList.contains("grabbing")) {
    calculatorHeader.classList.remove("grabbing");
  }
  document.body.classList.remove("interacting");
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
});

document.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  let target = null;
  if (notepadHeader.classList.contains("grabbing")) target = notepad;
  if (calculatorHeader.classList.contains("grabbing")) target = calculator;

  if (target) {
    target.style.left = `${event.clientX - offsetX}px`;
    target.style.top = `${event.clientY - offsetY}px`;
  }
});