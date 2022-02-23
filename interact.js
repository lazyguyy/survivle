// (() => {
class DefaultDict {
  constructor(defaultVal) {
    return new Proxy({}, {
      get: function(target, name) {
        if (!(name in target))
            target[name] = defaultVal()
        return target[name]
        },
      has: (target, name) => name in target
    })
  }
}


let keyboard_buttons = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                        ["↵", "z", "x", "c", "v", "b", "n", "m", "←"]]

let keyboard_commands = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                         ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                         ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]]

let valid_words = new Set(["hallo", "crazy", "upset"])
let notifications = document.getElementById("notifications")
let game_area = document.getElementById("game-area")
let target_word = "wuble"
let target_length = target_word.length
let entered_word = ""

let hints = Object()
// index -> letter
hints.fixed_positions = {}
// index -> {letter1, letter2, ...}
hints.blocked_positions = new DefaultDict(() => new Set())
// letter -> count
hints.contained_letters = new DefaultDict(() => 0)
// {letter1, letter2, ...}
hints.uncontained_letters = new Set()


function uses_info(word, hints){
    contained_letters = new DefaultDict(() => 0)
    for (let i = 0; i < word.length; ++i) {
        if (i in hints.fixed_positions && word[i] != hints.fixed_positions[i]) {
            notifications.textContent = `Letter ${i + 1} must be ${hints.fixed_positions[i].toUpperCase()}`
            return false
        }
        if (hints.blocked_positions[i].has(word[i])) {
            notifications.textContent = `Letter ${i + 1} cannot be ${word[i].toUpperCase()}`
            return false
        }
        contained_letters[word[i]]++
        if (hints.uncontained_letters.has(word[i])) {
            notifications.textContent = `The word must not contain ${word[i].toUpperCase()}`
            return false
        }
    }
    for (const letter of Object.keys(hints.contained_letters)) {
        if (hints.contained_letters[letter] > contained_letters[letter]) {
            notifications.textContent = `The word must contain more of the letter ${letter.toUpperCase()}`
            return false
        }
    }
    return true
}

function updateHints(word, score, hints) {
    counts = new DefaultDict(() => 0)
    uncontained_letters = new Set()
    for (let i = 0; i < word.length; ++i) {
        switch (score[i]){
            case 0:
                uncontained_letters.add(word[i])
                break
            case 1:
                hints.blocked_positions[i].add(word[i])
                counts[word[i]]++
                break
            case 2:
                hints.fixed_positions[i] = word[i]
                counts[word[i]]++
        }
    }
    for (const key of Object.keys(counts)) {
        if (counts[key] > hints.contained_letters[key]) {
            hints.contained_letters[key] = counts[key]
        }
    }
    console.log(counts)
    for (const key of uncontained_letters) {
        console.log(`${key} in ${Object.keys(counts)}`)
        if (!(key in counts)) {
            hints.uncontained_letters.add(key)
        }
    }
}

function computeScore(target, entered) {
    n = target.length
    counts = new DefaultDict(() => 0)
    for (let i = 0; i < n; ++i) {
        counts[target[i]]++
    }
    score = new Array(n).fill(0)
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

function updateBoard(board, word) {
    notifications.textContent = ""
    let row = board.rows.item(board.rows.length - 1)
    length = board.rows[0].children.length
    for (var i = 0; i < length; ++i) {
        row.children[i].textContent = i < word.length ? word[i].toUpperCase() : ""
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

function make_keyboard(react_function) {
    keyboard = document.getElementById("keyboard")
    for (let r = 0; r < keyboard_buttons.length; ++r) {
        let row = document.createElement("div")
        row.className = "keyboard-row"
        keyboard.appendChild(row)
        for (let c = 0; c < keyboard_buttons[r].length; ++c) {
            let btn = document.createElement("button")
            btn.onclick = () => react_function(keyboard_commands[r][c])
            btn.textContent = keyboard_buttons[r][c]
            row.appendChild(btn)
        }
    }
}

function submitWord(board, word, hints) {
    target_length = board.rows[0].children.length
    if (word.length < target_length) {
        notifications.textContent = `Word must have ${target_length} letters.`
        return
    }

    // if (!valid_words.has(word.toLowerCase())) {
    //     notifications.textContent = `${word} is not in the word list.`
    //     return
    // }

    if (!uses_info(word, hints)) {
        return
    }

    score = computeScore(target_word, word)
    updateHints(word, score, hints)
    let row = board.rows.item(board.rows.length - 1)
    for (var i = 0; i < target_word.length; ++i) {
        row.children[i].className = ["gray", "yellow", "green"][score[i]]
    }
    createNewRow(board)
    game_area.scrollTop = game_area.scrollHeight
    entered_word = ""
}

function createNewRow(board, length) {
    if (!length > 0) {
        length = board.rows[0].children.length
    }
    row = board.insertRow(board.rows.length)
    row.className = "board-row"
    row.innerHTML = "<td></td>".repeat(length)
}

function react(key) {
    if (key == "Backspace"){
        entered_word = entered_word.slice(0, -1)
        updateBoard(board, entered_word)
        return
    }

    if (key == "Enter") {
        submitWord(board, entered_word, hints)
        return
    }
    if (entered_word.length < 5 && key.length == 1 && (/[a-zA-Z]/).test(key)) {
        key = key.toLowerCase()
        entered_word += key
        updateBoard(board, entered_word)
    }
}

window.onload = function() {

    createNewRow(board, target_length)
    window.addEventListener("keydown", event => react(event.key))
    make_keyboard(react)
}
// })()
