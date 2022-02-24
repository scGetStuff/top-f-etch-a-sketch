"use strict"

const grid = document.querySelector(".container");
const resetBtn = document.querySelector(".reset button")
const sizeInput = document.getElementById("size");
const colorPicker = document.getElementById("color");
const options = document.getElementsByName("option");

const GRID_SIZE = 500;
const OPTION_SELECTED = 1;
const OPTION_ERASE = 2;
const OPTION_RANDOM = 3;
const OPTION_DARK = 4;


// user input
let gridSize = 1;
let optionValue = OPTION_SELECTED;
let colorValue = 'black';

// calculated
let squareSize = 0;


options.forEach(option => {
    option.addEventListener('change', function () {
        optionValue = Number.parseInt(this.value);
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
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

function createGrid() {

    gridSize = Number.parseInt(sizeInput.value);
    if (!(Number.isInteger(gridSize) && gridSize > 0))
        sizeInput.value = gridSize = 1;

    updateSquareSize();

    for (let row = 0; row < gridSize; row++)
        createRow(grid, row);
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
    // TODO: want to do something with event deligation
    // this is brute force, too many bindings
    // probalbly not going to happen, will look into it in a isolated app
    cellDiv.addEventListener('mouseenter', changeCellColor);
    cellDiv.addEventListener('mousedown', changeCellColor);
    parentDiv.appendChild(cellDiv);
}

// inline style to change the color
function changeCellColor(e) {

    if (e.buttons != 1)
        return;

    // not sure why, but could not get the background-color, setProperty() works fine
    // the computed thing makes it work, its a string i.e. rgb(0,0,0)
    const currentColor = window.getComputedStyle(this).getPropertyValue('background-color');
    this.style.setProperty('background-color', `${getColor(currentColor)}`);
}

function getColor(currentColor) {
    if (optionValue === OPTION_SELECTED)
        return colorValue;
    if (optionValue == OPTION_ERASE)
        return '';
    if (optionValue === OPTION_RANDOM)
        return randomColor();
    if (optionValue === OPTION_DARK)
        return fadeToBlack(currentColor);
}

function randomPart() {
    return Math.floor(Math.random() * 256);
}

function randomColor() {
    return `rgb(${randomPart()}, ${randomPart()}, ${randomPart()})`;
}

function fadeToBlack(currentColor = '') {
    // this is what i get from dom, so i'm stuck parsing a string
    // console.log(currentColor);
    // rgb(255, 255, 255)
    // rgb(0, 0, 0)

    const start = currentColor.indexOf('(');
    const end = currentColor.indexOf(')');
    const list = currentColor.substring(start + 1, end);
    const arr = list.split(', ');
    const darker = arr.map(s => addTenBlack(s));
    return `rgb(${darker[0]}, ${darker[1]}, ${darker[2]})`;
}

// from the spec:
// each pass just add another 10% of black to it so that only after 10 passes is the square completely black
// my understanding of this is that it should be like spraypaint
// white === 255, subtract 10% untill 0
function addTenBlack(s) {
    const n = Number.parseInt(s);
    const ten = 256 * 0.1;
    const ret = Math.round(n - ten);
    return ret < 0 ? 0 : ret;
}

console.clear();
createGrid();
