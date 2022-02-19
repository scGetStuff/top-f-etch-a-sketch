"use strict"

const container = document.querySelector(".container");
const sizeInput = document.querySelector("#size");
const resetBtn = document.querySelector(".reset button");
resetBtn.addEventListener('click', resetGrid);
let gridSize = 1;
// rather than truncate a fractional square size, let the grid adjust for rounding
const CONTAINER_SIZE = 600;
// TODO: this will be user input
let squareSize = 0;


// TODO: mouseenter event and detect mouse button down
// will replace tempory css :hover thing i started with


function resetGrid() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    createGrid();
}

function createGrid() {

    gridSize = sizeInput.value;
    updateSquareSize();

    for (let row = 0; row < gridSize; row++)
        createRow(container, row);
}

function updateSquareSize() {
    squareSize = CONTAINER_SIZE / gridSize;
    const rule = getSquareRule();
    console.assert(rule)
    rule.style.setProperty('width', `${squareSize}px`);
    rule.style.setProperty('height', `${squareSize}px`);
}

// TODO: kind of hate this code, make it less dumb
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
    // this is the shitty inline way
    // cellDiv.style.width = `${squareSize}px`;
    // cellDiv.style.height = `${squareSize}px`;
    parentDiv.appendChild(cellDiv);
}

console.clear();
createGrid();
