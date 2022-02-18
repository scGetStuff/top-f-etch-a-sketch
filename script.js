"use strict"

const container = document.querySelector(".container");
const GRID_SIZE = 16;
// rather than truncate a fractional square size, let the grid adjust for rounding
const CONTAINER_SIZE = 600;
// TODO: this will be user input
let squareSize = 0;


// TODO: mouseenter event and detect mouse button down
// will replace tempory css :hover thing i started with


// TODO: kind of hate this code, make it less dumb
function getSquareRule() {
    // TODO: assumption that there is only one sheet
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

function updateSquareSize() {
    squareSize = Math.round(CONTAINER_SIZE / GRID_SIZE);
    // console.log({ squareSize });

    const rule = getSquareRule();
    console.assert(rule)
    rule.style.setProperty('width', `${squareSize}px`);
    rule.style.setProperty('height', `${squareSize}px`);
}

function createGrid() {
    updateSquareSize();

    for (let row = 0; row < GRID_SIZE; row++)
        createRow(container, row);
}

function createRow(parentDiv, row) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    rowDiv.dataset.row = row; // create custom data attribute on the element
    for (let col = 0; col < GRID_SIZE; col++)
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
