document.getElementById("solveBtn").addEventListener("click", solveEquation);

function solveEquation() {
    const equationType = document.getElementById("equationType").value;
    const equationInput = document.getElementById("equation").value.trim();

    if (
        !equationInput.includes("=") &&
        equationType !== "inequality" &&
        equationType !== "piecewise"
    ) {
        displayResult('Please enter a valid equation with an "=" sign.');
        return;
    }

    try {
        switch (equationType) {
            case "linear":
                solveLinearEquation(equationInput);
                break;
            case "quadratic":
                solveQuadraticEquation(equationInput);
                break;
            case "polynomial":
                solvePolynomialEquation(equationInput);
                break;
            case "rational":
                solveRationalEquation(equationInput);
                break;
            case "exponential":
                solveExponentialEquation(equationInput);
                break;
            case "logarithmic":
                solveLogarithmicEquation(equationInput);
                break;
            case "system":
                solveSystemOfEquations(equationInput);
                break;
            case "inequality":
                solveInequality(equationInput);
                break;
            case "absoluteValue":
                solveAbsoluteValueEquation(equationInput);
                break;
            case "piecewise":
                solvePiecewiseFunction(equationInput);
                break;
            case "trigonometric":
                solveTrigonometricEquation(equationInput);
                break;
            case "matrix":
                solveMatrixEquation(equationInput);
                break;
            default:
                displayResult("Invalid equation type selected.");
        }
    } catch (error) {
        displayResult("Error in solving the equation: " + error.message);
    }
}

function detectVariable(equationInput) {
    // Detect variables by finding any alphabetic character in the equation input
    const variableMatch = equationInput.match(/[a-zA-Z]/);
    if (variableMatch) {
        return variableMatch[0]; // Return the first detected variable
    } else {
        throw new Error("No variable found in the equation.");
    }
}

function solveLinearEquation(equationInput) {
    try {
        const sides = equationInput.split("=");
        const leftSide = sides[0].trim();
        const rightSide = sides[1].trim();

        const leftExpr = algebra.parse(leftSide);
        const rightExpr = algebra.parse(rightSide);

        const equation = new algebra.Equation(leftExpr, rightExpr); // Create an equation object

        // Find a variable by detecting letters in the input string (a more basic approach)
        const variable = detectVariable(equationInput);

        const solution = equation.solveFor(variable); // Solve for the variable

        displayResult(`${variable} = ${solution.toString()}`);
    } catch (error) {
        displayResult("Error: " + error.message);
    }
}

function solveQuadraticEquation(equationInput) {
    try {
        const sides = equationInput.split("=");
        const leftSide = sides[0].trim();
        const rightSide = sides[1].trim();

        const fullEquation = `${leftSide} - (${rightSide})`;

        const expr = algebra.parse(fullEquation);

        const quadraticEquation = algebra.parse(fullEquation);

        const solutions = algebra.solve(
            quadraticEquation,
            detectVariable(equationInput)
        );

        const formattedSolutions = solutions
            .map((solution) => solution.toString())
            .join(", ");
        displayResult(`x = ${formattedSolutions}`);
    } catch (error) {
        displayResult("Error: " + error.message);
    }
}

function solvePolynomialEquation(equationInput) {
    // Handle higher-degree polynomials
    // Display result using displayResult function
}

function solveRationalEquation(equationInput) {
    // Handle rational equations
    // Display result using displayResult function
}

function solveExponentialEquation(equationInput) {
    // Handle exponential equations
    // Display result using displayResult function
}

function solveLogarithmicEquation(equationInput) {
    // Handle logarithmic equations
    // Display result using displayResult function
}

function solveSystemOfEquations(equations) {
    const parsedEquations = equations.map((eq) => algebra.parse(eq));
    const variables = parsedEquations[0]
        .terms()
        .map((term) => term.variable.toString());
    const solution = algebra.solveSystem(parsedEquations, variables);
    displayResult(
        `Solutions: ${solution
            .map((sol, i) => `${variables[i]} = ${sol}`)
            .join(", ")}`
    );
}

function solveInequality(equationInput) {
    // Handle inequalities
    // Display result using displayResult function
}

function solveAbsoluteValueEquation(equationInput) {
    // Handle absolute value equations
    // Display result using displayResult function
}

function solvePiecewiseFunction(equationInput) {
    // Handle piecewise functions
    // Display result using displayResult function
}

function solveTrigonometricEquation(equationInput) {
    // Handle trigonometric equations
    // Display result using displayResult function
}

function solveMatrixEquation(equationInput) {
    // Handle matrix equations
    // Display result using displayResult function
}

function displayResult(message) {
    document.getElementById("result").innerHTML = message;
}
