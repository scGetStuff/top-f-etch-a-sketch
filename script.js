"use strict"

const container = document.querySelector(".container");
const GRID_SIZE = 32;

// container.textContent = "container";

function createGrid() {
    for (let row = 0; row < GRID_SIZE; row++)
        createRow(container, row);
}

function createRow(parentDiv, row) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    rowDiv.dataset.row = row; // create custom data attribute on the element
    for (let col = 0; col < GRID_SIZE; col++)
        createSquare(rowDiv, row, col);
    parentDiv.appendChild(rowDiv);
}

function createSquare(parentDiv, row, col) {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('square');
    cellDiv.dataset.row = row;
    cellDiv.dataset.col = col;
    parentDiv.appendChild(cellDiv);
}

createGrid();
