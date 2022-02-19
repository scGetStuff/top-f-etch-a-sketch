"use strict"

const GRID = document.querySelector(".container");
const sizeInput = document.querySelector("#size");
const options = document.getElementsByName("option");
const colorPicker = document.querySelector("#color");
const resetBtn = document.querySelector(".reset button")

const GRID_SIZE = 600;

// user input
let gridSize = 1;
let optionValue = 0;
let colorValue = 'black';

// calculated
let squareSize = 0;


options.forEach(option => {
    option.addEventListener('change', function () {
        optionValue = this.value;
    })
});

colorPicker.addEventListener('change', function () {
    colorValue = this.value;
});

resetBtn.addEventListener('click', function () {
    emptyGrid();
    createGrid();
});


function emptyGrid() {
    while (GRID.firstChild) {
        GRID.removeChild(GRID.firstChild);
    }
}

function createGrid() {
    gridSize = sizeInput.value;
    updateSquareSize();

    for (let row = 0; row < gridSize; row++)
        createRow(GRID, row);
}

// modify the css in memory
function updateSquareSize() {
    squareSize = GRID_SIZE / gridSize;
    const rule = getSquareRule();
    console.assert(rule)
    rule.style.setProperty('width', `${squareSize}px`);
    rule.style.setProperty('height', `${squareSize}px`);
}

// TODO: kind of hate this code, make it less dumb
// cssRules in chrome broke when launching as file
// had to set up live server to test, CORS stuff
function getSquareRule() {
    // assumption that there is only one sheet
    console.assert(document.styleSheets.length === 1);
    const rules = document.styleSheets.item(0).cssRules;
    const len = rules.length
    let ret = undefined;

    for (let i = 0; i < len; i++) {
        let rule = rules.item(i);
        if (rule.selectorText === '.square') {
            ret = rule;
            break;
        }
    }
    return ret;
}

// TODO: using dummy row to control wrap, should be a better way, want to try grid too
function createRow(parentDiv, row) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    rowDiv.dataset.row = row; // create custom data attribute on the element
    for (let col = 0; col < gridSize; col++)
        createCell(rowDiv, row, col);
    parentDiv.appendChild(rowDiv);
}

function createCell(parentDiv, row, col) {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('square');
    cellDiv.dataset.row = row;
    cellDiv.dataset.col = col;
    // TODO: do something with bubbling, event deligation
    // this is brute force, too many bindings
    cellDiv.addEventListener('mouseenter', changeCellColor);
    parentDiv.appendChild(cellDiv);
}

// only change if an option is selected and they hold down left mouse button
// TODO: why am i using numbers?  hard coded crap many as well be strings
// TODO: something in the timing is screwed up, move just as you click and the
// cursor changes to a NO symbol, circle with slash
// breaks event code, figure it out
function changeCellColor(e) {
    if (optionValue == 0)
        return;

    if (e.buttons == 1) {
        if (optionValue == 1)
            this.style.setProperty('background-color', `${colorValue}`);
        else if (optionValue == 2)
            this.style = '';
    }
}

console.clear();
createGrid();
