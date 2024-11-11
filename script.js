let fields = [
    null, null, null,
    null, null, null,
    null, null, null,
];

let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');
    let tableHTML = `<table>`;
    for (let i = 0; i < 3; i++) {
        tableHTML += `<tr>`;
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = "";

            // Überprüfen, ob das Feld bereits belegt ist, und den SVG-Code generieren
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }

            // Die <td>-Elemente mit onclick, um Klicks zu handhaben
            tableHTML += `<td onclick="handleClick(${index}, this)">${symbol}</td>`;
        }
        tableHTML += `</tr>`;
    }
    tableHTML += `</table>`;
    contentDiv.innerHTML = tableHTML;
}

function handleClick(index, element) {
    // Prüfen, ob das Feld schon belegt ist
    if (fields[index] !== null) return;

    // Setzen des aktuellen Symbols im Array fields
    fields[index] = currentPlayer;

    // Einfügen des entsprechenden SVG-Codes ins <td>-Element
    if (currentPlayer === 'circle') {
        element.innerHTML = generateCircleSVG();
    } else {
        element.innerHTML = generateCrossSVG();
    }

    // Entfernen des onclick-Handlers vom <td>-Element
    element.onclick = null;

    // Überprüfen, ob das Spiel vorbei ist
    if (checkGameOver()) {
        return; // Spiel ist vorbei, keine weiteren Klicks sind möglich
    }

    // Wechsel zum nächsten Spieler
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
}

function checkGameOver() {
    const winConditions = [
        // Horizontale Gewinnbedingungen
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Vertikale Gewinnbedingungen
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonale Gewinnbedingungen
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of winConditions) {
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Es gibt einen Gewinner, also zeichnen wir eine Linie und beenden das Spiel
            drawWinningLine([a, b, c]);
            return true; // Das Spiel ist vorbei
        }
    }

    // Überprüfen, ob das Spielfeld voll ist (Unentschieden)
    if (!fields.includes(null)) {
        // Unentschieden, keine Linie, nur das Spielfeld ist voll
        alert('Unentschieden!');
        return true;
    }

    return false; // Spiel geht weiter
}

function restartGame(){
    fields = [
        null, null, null,
        null, null, null,
        null, null, null,
    ];
    render();
}

function drawWinningLine(winningIndexes) {
    const tableCells = document.querySelectorAll('td');
    const lineCoordinates = winningIndexes.map(index => {
        const cell = tableCells[index];
        const rect = cell.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });

    // Berechnung der Linie, die die Zellen verbindet
    const x1 = lineCoordinates[0].x;
    const y1 = lineCoordinates[0].y;
    const x2 = lineCoordinates[2].x;
    const y2 = lineCoordinates[2].y;

    // Berechnung der Länge der Linie und der Drehung (Rotation)
    const lineLength = Math.hypot(x2 - x1, y2 - y1); // Länge der Linie
    const angle = Math.atan2(y2 - y1, x2 - x1); // Drehwinkel der Linie

    // Erstellen der Linie als div-Element
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.backgroundColor = 'white';
    line.style.width = `${lineLength}px`;
    line.style.height = '5px';

    // Berechnung der Linie-Position und Drehung
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Linie positionieren und rotieren
    line.style.left = `${midX - lineLength / 2}px`;
    line.style.top = `${midY - 2.5}px`; // Linie vertikal zentrieren
    line.style.transform = `rotate(${angle}rad)`;

    // Die Linie dem Dokument hinzufügen
    document.body.appendChild(line);

    // Deaktivieren aller Zellen, um das Spiel zu beenden
    const tableCellsDisable = document.querySelectorAll('td');
    tableCellsDisable.forEach(cell => {
        cell.onclick = null; // Entfernen der Event-Listener von allen Zellen
    });
}

function generateCircleSVG() {
    return `
        <svg width="50" height="50" viewBox="0 0 70 70" style="display: block; margin: 0 auto;">
            <circle 
                cx="35" 
                cy="35" 
                r="30" 
                stroke="#00B0EF" 
                stroke-width="5" 
                fill="none" 
                stroke-dasharray="188.4" 
                stroke-dashoffset="188.4"
                style="animation: fillCircle 125ms forwards ease-in-out;"
            />
        </svg>
        <style>
            @keyframes fillCircle {
                to {
                    stroke-dashoffset: 0;
                }
            }
        </style>
    `;
}

function generateCrossSVG() {
    return `
        <svg width="50" height="50" viewBox="0 0 70 70" style="display: block; margin: 0 auto;">
            <line 
                x1="15" 
                y1="15" 
                x2="55" 
                y2="55" 
                stroke="#FFC000" 
                stroke-width="5" 
                stroke-linecap="round" 
                style="animation: drawCross 125ms forwards ease-in-out;"
            />
            <line 
                x1="55" 
                y1="15" 
                x2="15" 
                y2="55" 
                stroke="#FFC000" 
                stroke-width="5" 
                stroke-linecap="round" 
                style="animation: drawCross 125ms forwards ease-in-out 125ms;"
            />
        </svg>
        <style>
            @keyframes drawCross {
                from {
                    stroke-dasharray: 0, 100;
                }
                to {
                    stroke-dasharray: 100, 0;
                }
            }
        </style>
    `;
}
