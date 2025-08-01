// Se encarga de manejar el envío del formulario
document.getElementById('wordSearchForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Se evita que el formulario recargue la página

    // Aca se captura el contenido de los campos
    const matrixText = document.getElementById('matrix').value.trim();
    const wordsText = document.getElementById('words').value.trim();

    // Validación: ambos campos deben estar llenos
    if (!matrixText || !wordsText) {
        alert('Por favor complete ambos campos');
        return;
    }

    try {
        // Aca convierte el texto de la matriz en un array 2D
        const matrix = matrixText.split('\n').map(r => r.split(',').map(c => c.trim().toUpperCase()));

        // Aca convierte las palabras en un array en mayúsculas
        const words = wordsText.split('\n').map(w => w.trim().toUpperCase()).filter(Boolean);

        // Se clasifican las palabras en encontradas y no encontradas
        const results = words.reduce((acc, word) => {
            (searchInMatrix(matrix, word) ? acc.found : acc.notFound).push(word);
            return acc;
        }, { found: [], notFound: [] });

        // Aca muestra los resultados en pantalla
        displayResults(results);
    } catch (err) {
        alert('Error en el formato de datos');
    }
});

// Botón para limpiar o para reiniciar los campos y ocultar resultados
document.getElementById('clearBtn').addEventListener('click', function () {
    document.getElementById('matrix').value = '';
    document.getElementById('words').value = '';
    document.getElementById('results').classList.add('hidden');
});

// Se encarga de buscar una palabra en la matriz en todas las direcciones posibles
function searchInMatrix(matrix, word) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Los diferentes direccionamientos: derecha, izquierda, abajo, arriba, diagonales
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    // Aca se recorre toda la matriz
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            for (let [dr, dc] of directions) {
                // Aca, si encuentra la palabra en esa dirección, retorna true
                if (checkWord(matrix, word, row, col, dr, dc)) return true;
            }
        }
    }

    // Si no la encuentra en ninguna parte, retorna false
    return false;
}

// Se encarga de verificar si una palabra existe desde una posición y dirección dada
function checkWord(matrix, word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dr;
        const c = col + i * dc;

        // Aca se verifica que no se salga de los límites y que coincidan las letras
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

// Se encarga de mostrar en pantalla la cantidad y lista de palabras encontradas y no encontradas
function displayResults({ found, notFound }) {
    // Renderizado de palabras encontradas y no encontradas
    renderList('foundList', found);           
    renderList('notFoundList', notFound);     

    // Aca se actualiza los contadores
    document.getElementById('foundCount').textContent = found.length;
    document.getElementById('notFoundCount').textContent = notFound.length;

    // Aca se muestra la sección de resultados
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Se encarga de dibujar una lista (<ul>) de palabras en el contenedor correspondiente
function renderList(containerId, items) {
    const ul = document.getElementById(containerId);
    ul.innerHTML = ''; // Limpia la lista previa

    // Aca se crea y agrega cada elemento <li>
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
    });
}