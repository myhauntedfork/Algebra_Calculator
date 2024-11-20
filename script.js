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
    const variableMatch = equationInput.match(/[a-zA-Z]/);
    if (variableMatch) {
        return variableMatch[0];
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

function solveQuadraticEquation(equation) {
    const regex =
        /([-+]?\d*\.?\d*)x\^2\s*([-+]\s*\d*\.?\d*)x\s*([-+]\s*\d*\.?\d*)\s*=\s*0/;
    const matches = equation.replace(/\s+/g, "").match(regex);

    if (!matches) {
        displayResult("Error in solving the equation: Invalid format.");
        return;
    }

    const a = parseFloat(matches[1] || 1);
    const b = parseFloat(matches[2].replace(/\s+/g, ""));
    const c = parseFloat(matches[3].replace(/\s+/g, ""));

    const discriminant = b * b - 4 * a * c;
    let result = "";

    if (discriminant > 0) {
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const denominator = 2 * a;
        const numerator1 = -b + sqrtDiscriminant;
        const numerator2 = -b - sqrtDiscriminant;

        result = `x = ${toRadicalForm(
            numerator1,
            denominator
        )}, x = ${toRadicalForm(numerator2, denominator)}`;
    } else if (discriminant === 0) {
        const root = -b / (2 * a);
        result = `x = ${toRadicalForm(-b, 2 * a)}`;
    } else {
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        result = `x = ${toRadicalForm(-b, 2 * a)} ± ${toRadicalForm(
            Math.sqrt(-discriminant),
            2 * a
        )}i`;
    }

    displayResult(result);
}

function solvePolynomialEquation(equation) {
    // Parse the polynomial equation into coefficients
    const regex = /([-+]?\d*\.?\d*)x\^(\d+)/g;
    let coefficients = [];
    let match;
    let maxDegree = 0;

    while ((match = regex.exec(equation)) !== null) {
        const coeff = parseFloat(match[1] || 1);
        const degree = parseInt(match[2], 10);

        if (degree > maxDegree) {
            maxDegree = degree;
        }

        coefficients[degree] = (coefficients[degree] || 0) + coeff;
    }

    // If equation contains only constants and/or linear terms, handle them
    const constantTerm = parseFloat(
        equation.match(/[-+]?\d+\.?\d*(?=\s*=\s*0)/) || 0
    );
    const linearTerm = parseFloat(
        equation.match(/([-+]?\d+\.?\d*)x(?=\s*[-+])/) || 0
    );

    coefficients[0] = (coefficients[0] || 0) - constantTerm;
    coefficients[1] = (coefficients[1] || 0) - linearTerm;

    // Solve polynomial using numerical methods
    const result = numericalPolynomialSolver(coefficients);
    displayResult(result.join(", "));
}

function newtonRaphson(coefficients, initialGuess) {
    const maxIterations = 100;
    const tolerance = 1e-6;
    let x = initialGuess;

    for (let i = 0; i < maxIterations; i++) {
        const fValue = polynomialValue(coefficients, x);
        const fDerivative = polynomialDerivative(coefficients, x);

        if (Math.abs(fDerivative) < tolerance) {
            return null; // Avoid division by zero
        }

        const nextX = x - fValue / fDerivative;

        if (Math.abs(nextX - x) < tolerance) {
            return nextX;
        }

        x = nextX;
    }

    return null; // If no convergence
}

function polynomialValue(coefficients, x) {
    return coefficients.reduce(
        (sum, coeff, i) =>
            sum + coeff * Math.pow(x, coefficients.length - 1 - i),
        0
    );
}

function polynomialDerivative(coefficients, x) {
    return coefficients
        .slice(0, -1)
        .reduce(
            (sum, coeff, i) =>
                sum +
                coeff *
                    (coefficients.length - 1 - i) *
                    Math.pow(x, coefficients.length - 2 - i),
            0
        );
}

//used in solvePolynomialEquation
function numericalPolynomialSolver(coefficients) {
    const roots = [];
    const degree = coefficients.length - 1;

    // Use multiple initial guesses to find distinct roots
    const guesses = [-10, -5, 0, 5, 10]; // Extended guesses
    guesses.forEach((guess) => {
        const root = newtonRaphson(coefficients, guess);
        if (root !== null) {
            const roundedRoot = Math.round(root * 1e6) / 1e6; // Round for precision
            // Check if the root is already included, with some tolerance for close roots
            if (
                !roots.some(
                    (existingRoot) =>
                        Math.abs(existingRoot - roundedRoot) < 1e-6
                )
            ) {
                roots.push(roundedRoot);
            }
        }
    });

    // Sort and return roots
    roots.sort((a, b) => a - b);
    return roots.map((root) => toRadicalForm(root));
}

function toRadicalForm(numerator, denominator) {
    if (denominator === 0) return "undefined";

    // Simplify the fraction
    const gcd = Math.abs(getGCD(numerator, denominator));
    numerator /= gcd;
    denominator /= gcd;

    // If denominator is 1, just return the numerator
    if (denominator === 1) return numerator.toString();

    // Check if numerator is a perfect square
    const sqrtNumerator = Math.sqrt(Math.abs(numerator));
    if (Number.isInteger(sqrtNumerator)) {
        return `${numerator < 0 ? "-" : ""}${sqrtNumerator}/${denominator}`;
    }

    // If not a perfect square, return in radical form
    return `(${numerator < 0 ? "-" : ""}√${Math.abs(
        numerator
    )})/${denominator}`;
}

function getGCD(a, b) {
    return b === 0 ? a : getGCD(b, a % b);
}

function displayResult(message) {
    if (Array.isArray(message)) {
        message = message.join(", ");
    }
    document.getElementById("result").innerHTML = message;
}
