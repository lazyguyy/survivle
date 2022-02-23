function computeScore(target, entered) {
    n = target.length
    counts = new Proxy({}, {
            get: (target, name) => name in target ? target[name] : 0
        })
    for (let i = 0; i < n; ++i) {
        counts[target[i]]++
    }
    n = target.length
    score = new Array(target.length).fill(0)
    for (let i = 0; i < n; ++i) {
        if (target[i] == entered[i]) {
            score[i] = 2
            counts[target[i]]--
        }
    }
    for (let i = 0; i < n; ++i) {
        if (score[i] == 0 && counts[entered[i]] > 0) {
            counts[entered[i]] -= 1
            score[i] = 1
        }
    }
    return score
}

window.onload = function() {
    var boards = document.getElementById("board")
    var word = ""
    var notifications = document.getElementById("notifications")
    var valid_words = new Set(["hallo", "crazy", "upset"])
    var target_word = "wuble"
    var target_length = target_word.length
    createNewRow()
    window.addEventListener("keydown", event => react(event.key))


    let keyboard_buttons = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                            ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                            ["↵", "z", "x", "c", "v", "b", "n", "m", "←"]]

    let keyboard_commands = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                             ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                             ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]]

    make_keyboard()

    function make_keyboard() {
        keyboard = document.getElementById("keyboard")
        for (let r = 0; r < keyboard_buttons.length; ++r) {
            let row = document.createElement("div")
            row.className = "keyboard-row"
            keyboard.appendChild(row)
            for (let c = 0; c < keyboard_buttons[r].length; ++c) {
                let btn = document.createElement("button")
                btn.onclick = () => react(keyboard_commands[r][c])
                btn.textContent = keyboard_buttons[r][c]
                row.appendChild(btn)
            }
        }
    }


    function load_file(filename) {
        let relative_path = "./data/" + filename
        fetch(relative_path).then(
            function(answer) {
                if (answer.status != 200) {
                    console.log("request failed")
                    return
                }
                answer.json().then(function(content) {
                    console.log(content)
                })
            }).catch(function(err) {
                console.log("fetch error ", err)
            })
    }


    function updateBoard() {
        notifications.textContent = ""
        let row = board.rows.item(board.rows.length - 1)
        for (var i = 0; i < target_length; ++i) {
            row.children[i].textContent = i < word.length ? word[i] : ""
        }
    }

    function submitWord() {
        if (word.length < target_length) {
            notifications.textContent = `Word must have ${target_length} letters.`
            return
        }

        if (!valid_words.has(word.toLowerCase())) {
            notifications.textContent = `${word} is not in the word list.`
            return
        }

        score = computeScore(target_word, word.toLowerCase())
        let row = board.rows.item(board.rows.length - 1)
        for (var i = 0; i < target_word.length; ++i) {
            row.children[i].className = ["gray", "yellow", "green"][score[i]]
        }
        createNewRow()
        board.scrollTop = board.scrollHeight
        word = ""
    }

    function createNewRow() {
        row = board.insertRow(board.rows.length)
        row.className = "board-row"
        row.innerHTML = "<td></td>".repeat(target_length)
    }


    function react(key) {
        if (key == "Backspace"){
            word = word.slice(0, -1)
            updateBoard()
            return
        }

        if (key == "Enter") {
            submitWord()
            return
        }
        if (word.length < 5 && key.length == 1 && (/[a-zA-Z]/).test(key)) {
            key = key.toUpperCase()
            word += key
            updateBoard()
        }
    }
}
