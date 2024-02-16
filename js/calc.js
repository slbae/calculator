let displayInput = document.getElementById('calc-display');
let historyList = document.getElementById('history-list');
let currentInput = '';
let currentOperation = '';
let history = [];
let error = false;

/**
 * Displays the characters that the user clicks on the calculator or keyboard and the results of calculations.
 * @param {*} value 
 */
function updateDisplay(value) {
    // Calculator must be in a ready state to display input
    if (!error) {
        if ((value >= '0' && value <= '9') || value === '.') { // Check if value is a number or a decimal point
            currentInput += value;
            displayInput.value = currentInput; // Display it
        } else if (value === '+' || value === '-' || value === '*' || value === '/') { // Value is an operation
            let prev = 0;
            if (currentInput) {
                prev = currentInput[currentInput.length - 1];
            }
            if (value === '-' && !currentInput) { // Special case: negative number if the '-' is the first input
                currentInput += value;
                displayInput.value = currentInput; // Just display it
            }
            else if (prev === '+' || prev === '-' || prev === '*' || prev === '/') { // If the previous input is an operation, replace with the new one
                currentOperation = value;
                currentInput += value;
                displayInput.value = currentInput;
                currentInput = currentInput.slice(0, -2) + value;
            }
            else if (currentOperation && (prev >= '0' && prev <= '9')) {
                calculate(); // If there's a current operation, calculate the intermediate result
                currentOperation = value; // Update currentOperation 
                currentInput += value;
                displayInput.value = currentInput; // Display new operator
            }
            else { // Value is the first operation
                currentOperation = value;
                currentInput += value;
                displayInput.value = currentInput;
            }
        }
    }
}


/**
 * Handles keyboard input. If most recent result is Error 'C' must be clicked to
 * put calculator back into ready state.
 * @param {KeyboardEvent} event 
 */
function handleKeyPress(event) {
    const key = event.key;
    if (!error && ((key >= '0' && key <= '9') || key === '+' || key === '-' || key === '*' || key === '/' || key === '.')) { // Use keyboard instead od calc buttons
        event.preventDefault();
        updateDisplay(key);
    } else if (!error && (key === '=' || key === 'Enter')) { // Press enter key to calculate an expression
        event.preventDefault();
        calculate();
    } else if (key === 'c' || key === 'C') {
        error = false;
        event.preventDefault();
        clearDisplay();
    }
}

/**
 * Changes the sign of current input when the +/- button is clicked.
 * Must be in a ready state to click on calc buttons.
 */
function changeSign() {
    if (!error && currentInput !== '') {
        currentInput *= -1;
        displayInput.value = currentInput;
    }
}

/**
 * Clears the calculator display and puts an Error state into ready state.
 */
function clearDisplay() {
    currentInput = '';
    currentOperation = '';
    displayInput.value = '';
    error = false;
}

/**
 * Clear the history.
 */
function clearHistory() {
    if (!error) {
        history = [];
        updateHistoryList();
    }
}

/**
 * Creates list items in the history container and allows items to be clicked on
 * if the item is the first number of the calculation or the number after an operation.
 * Else, the item cannot be clicked on.
 */
function updateHistoryList() {
    historyList.innerHTML = '';
    history.forEach(entry => {
        let li = document.createElement('li');
        li.textContent = entry; // Add item to history
        li.onclick = () => { // Clickable items
            if (!error && (!currentInput || '+-*/'.includes(currentInput[currentInput.length - 1]))) {
                currentInput += entry; // Add item to currentInput if able to click on it
                displayInput.value = currentInput; // Display it
            }
        };
        historyList.appendChild(li);
    });

}

/**
 * Performs calculations and displays the result.
 */
function calculate() {
    if (currentOperation === '*') {
        multiply();
    } else if (currentOperation === '/') {
        divide();
    } else if (currentOperation === '-') {
        subtract();
    } else if (currentOperation === '+') {
        add();
    }
    if (isNaN(result) || !isFinite(result)) { // Error state
        displayInput.value = 'Error';
        error = true;
        currentInput = '';
    } else {
        history.push(result); // Store the operation and result
        updateHistoryList(); // Add result to history
        currentInput = result.toString();
        displayInput.value = result; // Display result of calculation
    }
    currentOperation = ''; // Reset operation
}

/**
 * Multiplies 2 numbers.
 */
function multiply() {
    let numbers = currentInput.split('*');
    result = parseFloat(numbers[0]) * parseFloat(numbers[1]);
}

/**
 * Divide 2 numbers.
 */
function divide() {
    let numbers = currentInput.split('/');
    result = parseFloat(numbers[0]) / parseFloat(numbers[1]);
}

/**
 * Subtracts 2 numbers. Handles negative signs. 
 */
function subtract() {
    if (currentInput[0] === '-') { // Subtract with a negative number as one of the terms
        currentInput = currentInput.substring(1); // Treat currentInput as 2 positive numbers
        let numbers = currentInput.split('-'); // Find the two numbers
        result = parseFloat(numbers[0] * -1) - parseFloat(numbers[1]); // Subtract accounting for the first number being negative
    }
    else { // Subtract positive numbers
        let numbers = currentInput.split('-');
        result = parseFloat(numbers[0]) - parseFloat(numbers[1]);
    }
}

/**
 * Add 2 numbers.
 */
function add() {
    let numbers = currentInput.split('+');
    result = parseFloat(numbers[0]) + parseFloat(numbers[1]);
}