document.getElementById("solveBtn").addEventListener("click", solveEquation);

function solveEquation() {
    const equationInput = document.getElementById("equation").value.trim();

    if (!equationInput.includes("=")) {
        displayResult('Please enter a valid equation with an "=" sign.');
        return;
    }

    const sides = equationInput.split("=");
    if (sides.length !== 2) {
        displayResult('Please enter a valid equation with only one "=" sign.');
        return;
    }

    const leftSide = sides[0].trim();
    const rightSide = sides[1].trim();

    try {
        // Detect the variable
        const variableMatch = equationInput.match(/[a-zA-Z]/);
        if (!variableMatch) {
            displayResult("No variable found in the equation.");
            return;
        }
        const variable = variableMatch[0];

        const expr = new algebra.Equation(
            algebra.parse(leftSide),
            algebra.parse(rightSide)
        );

        const solution = expr.solveFor(variable);

        displayResult(`${variable} = ${solution.toString()}`);
    } catch (error) {
        displayResult("Error in solving the equation: " + error.message);
    }
}

function displayResult(message) {
    document.getElementById("result").innerHTML = message;
}
