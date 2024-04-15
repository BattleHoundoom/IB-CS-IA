function reloadIfDayChanged() {
    // Get the current date
    const currentDate = new Date();

    // Check if the day has changed
    if (currentDate.getDate() !== window.lastCheckedDay) {
        window.location.reload(true); // Reload the page
    }

    // Update the last checked day
    window.lastCheckedDay = currentDate.getDate();
}

// Set the initial value for the last checked day
window.lastCheckedDay = new Date().getDate();

// Check for day changes every minute (adjust the interval as needed)
setInterval(reloadIfDayChanged, 60000);


//const wordList = ['penis', 'house', 'radio', 'flame', 'shoot', 'crane'];

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
                console.log(data);
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
                //console.log("green", letter, state.ans[i]);
                box.classList.add('right');
            } else if (state.ans.includes(letter)) {
                //console.log("yellow", letter);
                box.classList.add('wrong');
            } else {
                //console.log("grey", letter, state.ans[i]);
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
        state.ongoing = 1;
        setTimeout(() => {
            document.getElementById("winModal").style.display = "flex";
            document.getElementById("winModal").showModal();
        }, 2000);
        
    } else if (state.currentRow === 5) {
        state.ongoing = 2;
        setTimeout(() => {
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
        //console.log(typeof state.ongoing);
        if (!state.ongoing) {
            //console.log("state check passed");
            if (e.key === "Enter") {
                if (state.currentCol === 5) {
                    const word = getWord();
                    console.log(word);
                    EvalWord(word).then(result => {
                        if (result) {
                            console.log("inprogress");
                            revealWord(word);
                            console.log(state.ongoing);
                            state.currentRow++;
                            state.currentCol = 0;
                            fetch('/main/update_wordle_progress/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: `guess=${encodeURIComponent(word)}&state=${state.ongoing}`,
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data.message);  
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
    /*if (subongoing === "true") {
        state.ongoing = true;
    } else {
        state.ongoing = false;
    }*/
    //data = "bakedbooks";
    state.ongoing = parseInt(gameState);

    console.log("State:", state.ongoing);
    console.log("Data:", data);
    //console.log("curr_row:", curr_row);
    

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

    
    if (state.ongoing === 1) {
        document.getElementById("winModal").style.display = "flex";
        document.getElementById("winModal").showModal();
    } else if (state.ongoing === 2) {
        document.getElementById("loseModal").style.display = "flex";
        document.getElementById("loseModal").showModal();
    }
    
    
    //grid.addEventListener('keydown', eventListener());

    
    
    
    console.log(state.ans);
}
state.ans = daily_word.toLowerCase();
setup();