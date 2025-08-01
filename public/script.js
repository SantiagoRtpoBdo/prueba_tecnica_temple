// Manejar el envío del formulario
document.getElementById('wordSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const matrixText = document.getElementById('matrix').value.trim();
    const wordsText = document.getElementById('words').value.trim();

    if (!matrixText || !wordsText) {
        alert('Por favor complete ambos campos');
        return;
    }

    try {
        const matrix = matrixText.split('\n').map(r => r.split(',').map(c => c.trim().toUpperCase()));
        const words = wordsText.split('\n').map(w => w.trim().toUpperCase()).filter(Boolean);

        const results = words.reduce((acc, word) => {
        (searchInMatrix(matrix, word) ? acc.found : acc.notFound).push(word);
        return acc;
        }, { found: [], notFound: [] });

        displayResults(results);
    } catch (err) {
        alert('Error en el formato de datos');
    }
});

// Este es el "Botón limpiar"
document.getElementById('clearBtn').addEventListener('click', function () {
    document.getElementById('matrix').value = '';
    document.getElementById('words').value = '';
    document.getElementById('results').classList.add('hidden');
});

// Aca se realiza la busqueda de la palabra en la matriz
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
            if (checkWord(matrix, word, row, col, dr, dc)) return true;
        }
        }
    }
    return false;
}

function checkWord(matrix, word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dr, c = col + i * dc;
        if (r < 0 || r >= matrix.length || c < 0 || c >= matrix[0].length || matrix[r][c] !== word[i]) {
        return false;
        }
    }
    return true;
}

// Para mostrar los resultados
function displayResults({ found, notFound }) {
    renderList('foundList', found);
    renderList('notFoundList', notFound);
    document.getElementById('foundCount').textContent = found.length;
    document.getElementById('notFoundCount').textContent = notFound.length;
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderList(containerId, items) {
    const ul = document.getElementById(containerId);
    ul.innerHTML = '';
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
    });
}
