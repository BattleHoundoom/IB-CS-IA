const wordList = ['penis', 'house', 'radio', 'flame', 'shoot', 'crane'];

var state = {
    ans: wordList[Math.floor(Math.random() * wordList.length)],
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function getWord() {
    return state.grid[state.currentRow].join('');
}

function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = "";
    state.currentCol--;
}

function revealWord(guess) {
    const row = state.currentRow;

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if (letter === state.ans[i]) {
            console.log(letter, state.ans[i]);
            box.classList.add('right');
        } else if (state.ans.includes(letter)) {
            console.log(letter, state.ans[i]);
            box.classList.add('wrong');
        } else {
            console.log(letter, state.ans[i]);
            box.classList.add('empty');
        }
    }

    if (state.ans === guess) {
        alert("congrats");
    } else if (state.currentRow === 5) {
        alert("game over");
    }
}

function updateGrid() {
    for (let i = 0; i <state.grid.length; i++) {
        for (let v = 0; v < state.grid[i].length; v++) {
            const box = document.getElementById(`box${i}${v}`);
            box.textContent = state.grid[i][v];
        }
    }
}

function drawBox(container, row, col, val = '') {
    const box = document.createElement('div');
    box.className = "box";
    box.id = `box${row}${col}`;
    box.textContent = val;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement("div");
    grid.className = "grid";

    for (let i = 0; i < 6; i++) {
        for (let v = 0; v < 5; v++) {
            drawBox(grid, i, v);
        }
    }

    container.appendChild(grid);
}

function eventListener() {
    document.body.onkeydown = (e) => {
        
        if (e.key === "Enter") {
            if (state.currentCol === 5) {
                const word = getWord();
                console.log(word);
                if (wordList.includes(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert("Invalid Word");
                }
            }
        }
        if (e.key === "Backspace") {
            removeLetter();
        }
        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
            addLetter(e.key);
        }

        updateGrid();
    }
}

function setup() {
    const grid = document.querySelector(".grid");
    //grid.className = "grid";

    for (let i = 0; i < 6; i++) {
        for (let v = 0; v < 5; v++) {
            drawBox(grid, i, v);
        }
    }

    eventListener();
    console.log(state.ans);
}

setup();