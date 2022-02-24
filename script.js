"use strict"

const GRID = document.querySelector(".container");
const sizeInput = document.querySelector("#size");
const options = document.getElementsByName("option");
const colorPicker = document.querySelector("#color");
const resetBtn = document.querySelector(".reset button")

const GRID_SIZE = 600;
const OPTION_NONE = 'none'
const OPTION_PEN = 'pen'
const OPTION_ERASE = 'erase'

// user input
let gridSize = 1;
let optionValue = OPTION_NONE;
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
    rowDiv.dataset.row = row;
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
    cellDiv.addEventListener('mousedown', changeCellColor);
    parentDiv.appendChild(cellDiv);
}

// only change if an option is selected and they hold down left mouse button
function changeCellColor(e) {
    // not concerned with strict compare for this
    if (optionValue == OPTION_NONE || e.buttons != 1)
        return;

    if (optionValue == OPTION_PEN)
        this.style.setProperty('background-color', `${colorValue}`);
    else if (optionValue == OPTION_ERASE)
        this.style = '';
}

console.clear();
createGrid();
