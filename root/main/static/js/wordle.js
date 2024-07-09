function reloadIfDayChanged() {
    
    const currentDate = new Date();

    
    if (currentDate.getDate() !== window.lastCheckedDay) {
        window.location.reload(true); // Reload the page
    }

    
    window.lastCheckedDay = currentDate.getDate();
}


window.lastCheckedDay = new Date().getDate();

setInterval(reloadIfDayChanged, 60000);



var state = {
    ans: "",
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
    ongoing: 0,
};

function closeModal(modal_id) {
    modal = document.querySelector(modal_id);
    modal.close();
    modal.style.display = "none";
}


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


function EvalWord(word) {
    return new Promise((resolve, reject) => {
        var apiUrl = `https://api.datamuse.com/words?sp=${word}&max=1`;
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log(data);
                resolve(data[0].word === word);
            })
            .catch(error => {
                reject(error);
            });
    });
    
}

function revealWord(guess) {
    const row = state.currentRow;

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if (letter === state.ans[i]) {
                box.classList.add('right');
            } else if (state.ans.includes(letter)) {
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            }
        }, ((i + 1) * 500) / 2);
        box.classList.remove('animatedInval');
        box.classList.add('animatedVal');
        box.style.animationDelay = `${(i * 500) / 2}ms`;
    }
    //var pending = true;
    //setTimeout(() => {
    if (state.ans === guess) {
        state.ongoing = 2;
        setTimeout(() => {
            document.getElementById("reveau").textContent = state.ans;
            document.getElementById("winModal").style.display = "flex";
            document.getElementById("winModal").showModal();
        }, 2000);
        
    } else if (state.currentRow === 5) {
        state.ongoing = 3;
        setTimeout(() => {
            document.getElementById("revea").textContent = state.ans;
            document.getElementById("loseModal").style.display = "flex";
            document.getElementById("loseModal").showModal();
        }, 2000);
    }
    //}, 3 * 500);
    
}

function revealIncorrect() {
    boxes = document.querySelectorAll(`[id^='box${state.currentRow}']`)
    boxes.forEach(e => {
        e.classList.add('animatedInval');
    });
    setTimeout(() => {
        boxes.forEach(e => {
            e.classList.remove('animatedInval');
        });
    }, 300);
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let v = 0; v < state.grid[i].length; v++) {
            const box = document.getElementById(`box${i}${v}`);
            box.textContent = state.grid[i][v];
        }
    }
}



function drawBox(container, row, col) {
    const box = document.createElement('div');
    box.className = "box";
    box.id = `box${row}${col}`;
    box.textContent = '';

    container.appendChild(box);
    return box;
}

function eventListener() {
    return (e) => {
        if (!state.ongoing || state.ongoing === 1) {
            if (e.key === "Enter") {
                if (state.currentCol === 5) {
                    const word = getWord();
                    //console.log(word);
                    EvalWord(word).then(result => {
                        if (result) {
                            revealWord(word);
                            state.currentRow++;
                            state.currentCol = 0;
                            fetch('/update_wordle_progress/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: `guess=${encodeURIComponent(word)}&state=${state.ongoing}`,
                            })
                            .then(response => response.json())
                            .then(data => {
                                //console.log(data.message);  
                            })
                            .catch(error => console.error('Error:', error));
                        } else {
                            revealIncorrect();
                        }
                    }).catch(error => {
                        console.error('Error fetching data from Datamuse API:', error);
                        revealIncorrect();
                    });
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
}




document.body.addEventListener('keydown', eventListener());

function setup() {
    var wordleDataElement = document.getElementById('wordle-data');
    //var subongoing = wordleDataElement.getAttribute('data-ongoing');
    var gameState = wordleDataElement.getAttribute('data-state');
    var data = wordleDataElement.getAttribute('data-data');
    //var curr_row = wordleDataElement.getAttribute('data-row');
    
    state.ongoing = parseInt(gameState);

    //console.log("State:", state.ongoing);
    //console.log("Data:", data);
    

    const grid = document.querySelector(".grid");

    

    //grid.className = "grid";
    var flag = false;
    for (let i = 0; i < 6; i++) {
        for (let v = 0; v < 5; v++) {
            drawBox(grid, i, v); 
        }
    }
    for (let i = 0; i < 6; i++) {
        for (let v = 0; v < 5; v++) {
            if (data) {
                addLetter(data[0]);
                data = data.slice(1);
                flag = true;
                
            } 
        }
        if (flag) {
            updateGrid();
            const word = getWord();
            revealWord(word);
            state.currentRow++;
            state.currentCol = 0;
            flag = false;
        }
    }
    eventListener();

    
    if (state.ongoing === 2) {
        document.getElementById("reveau").textContent = state.ans;
        document.getElementById("winModal").style.display = "flex";
        document.getElementById("winModal").showModal();
    } else if (state.ongoing === 3) {
        document.getElementById("revea").textContent = state.ans;
        document.getElementById("loseModal").style.display = "flex";
        document.getElementById("loseModal").showModal();
    }
    
    
    //grid.addEventListener('keydown', eventListener());

    
    
    
}

async function fetchDailyWord() {
    try {
        const response = await fetch('/api/secret-word/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseJson = await response.json();
        state.ans = (responseJson.secret_word).toLowerCase();

        setup();

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

fetchDailyWord();
