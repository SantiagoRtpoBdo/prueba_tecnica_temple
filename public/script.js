const $ = id => document.getElementById(id);
let currentMatrix = [];
let foundPositions = new Set();

$('wordSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const matrixText = $('matrix').value.trim();
    const wordsText = $('words').value.trim();

    if (!matrixText || !wordsText) {
        alert('Por favor complete ambos campos');
        return;
    }

    try {
        const matrix = matrixText.split('\n').map(r => r.split(',').map(c => c.trim().toUpperCase()));
        if (!matrix.every(row => row.length === matrix[0].length)) {
            throw new Error('La matriz debe tener todas las filas del mismo tamaño.');
        }

        currentMatrix = matrix;
        const words = wordsText.split('\n').map(w => w.trim().toUpperCase()).filter(Boolean);
        foundPositions.clear();

        const results = words.reduce((acc, word) => {
            (searchInMatrix(matrix, word) ? acc.found : acc.notFound).push(word);
            return acc;
        }, { found: [], notFound: [] });

        displayResults(results);
        $('showMatrixBtn').classList.toggle('hidden', results.found.length === 0);
    } catch (err) {
        alert(err.message || 'Error en el formato de datos');
    }
});

$('clearBtn').addEventListener('click', function () {
    $('matrix').value = '';
    $('words').value = '';
    $('results').classList.add('hidden');
    $('matrixDisplay').classList.add('hidden');
    $('showMatrixBtn').classList.add('hidden');
    currentMatrix = [];
    foundPositions.clear();
});

$('showMatrixBtn').addEventListener('click', function () {
    if (!currentMatrix.length) {
        alert('Primero debes buscar palabras');
        return;
    }
    displayMatrix();
});

function searchInMatrix(matrix, word) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            for (let [dr, dc] of directions) {
                if (checkWord(matrix, word, row, col, dr, dc)) {
                    for (let i = 0; i < word.length; i++) {
                        foundPositions.add(`${row + i * dr}-${col + i * dc}`);
                    }
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWord(matrix, word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dr;
        const c = col + i * dc;
        if (
            r < 0 || r >= matrix.length ||
            c < 0 || c >= matrix[0].length ||
            matrix[r][c] !== word[i]
        ) {
            return false;
        }
    }
    return true;
}

function displayResults({ found, notFound }) {
    renderList('foundList', found);
    renderList('notFoundList', notFound);
    $('foundCount').textContent = found.length;
    $('notFoundCount').textContent = notFound.length;
    $('results').classList.remove('hidden');
    $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderList(containerId, items) {
    const ul = $(containerId);
    ul.innerHTML = '';
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
    });
}

function displayMatrix() {
    const matrixGrid = $('matrixGrid');
    matrixGrid.innerHTML = '';

    const rows = currentMatrix.length;
    const cols = currentMatrix[0].length;

    matrixGrid.style.display = 'grid';
    matrixGrid.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
    matrixGrid.style.gridAutoRows = '25px';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = currentMatrix[row][col] || '?';
            if (foundPositions.has(`${row}-${col}`)) {
                cell.classList.add('found');
            }
            matrixGrid.appendChild(cell);
        }
    }

    $('matrixDisplay').classList.remove('hidden');
    $('matrixDisplay').scrollIntoView({ behavior: 'smooth', block: 'start' });
}