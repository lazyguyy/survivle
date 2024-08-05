let board = document.getElementById("board")
let notifications = document.getElementById("notifications")
let game_area = document.getElementById("game-area")



let keyboard_buttons = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                        ["↵", "z", "x", "c", "v", "b", "n", "m", "←"]]

let keyboard_commands = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                         ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                         ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]]

function writeTextToBoard(word) {
    let row = board.rows.item(board.rows.length - 1)
    length = board.rows[0].children.length
    for (var i = 0; i < length; ++i) {
        row.children[i].textContent = i < word.length ? word[i].toUpperCase() : ""
    }
    clearNotificationText()
}

function setNotificationText(text) {
    notifications.textContent = text
}

function getNotificationText() {
    return notifications.textContent
}

function clearNotificationText() {
    notifications.textContent = ""
}

function colorKeys(word, score) {
    for (let i = 0; i < score.length; ++i) {
        let button = document.getElementById(word[i])
        switch (score[i]) {
            case 0:
                if (button.className == "")
                    button.className = "gray"
                break
            case 1:
                if (button.className != "green")
                    button.className = "yellow"
                break
            case 2:
                button.className = "green"

        }
    }
}

function uncolorKeys() {
    for (const className of ["gray", "yellow", "green"]) {
        let colored_buttons = document.getElementsByClassName(className)
        for (let i = colored_buttons.length - 1; i >= 0; --i) {
            if (!colored_buttons[i].classList.contains("fixed")) {
                colored_buttons[i].classList.toggle(className)
            }
        }
    }
}

function createKeyboard(react_function) {
    let keyboard = document.getElementById("keyboard")
    for (let r = 0; r < keyboard_buttons.length; ++r) {
        let row = document.createElement("div")
        row.className = "keyboard-row"
        keyboard.appendChild(row)
        for (let c = 0; c < keyboard_buttons[r].length; ++c) {
            let btn = document.createElement("button")
            btn.onclick = () => react_function(keyboard_commands[r][c])
            btn.textContent = keyboard_buttons[r][c]
            btn.id = keyboard_commands[r][c]
            row.appendChild(btn)
        }
    }
}

function colorBoard(score) {
    let row = board.rows.item(board.rows.length - 1)
    for (var i = 0; i < score.length; ++i) {
        row.children[i].className = ["gray", "yellow", "green"][score[i]]
    }
}

function createNewRow(length) {
    if (!(length > 0)) {
        length = board.rows[0].children.length
    }
    let row = board.insertRow(board.rows.length)
    row.className = "board-row"
    row.innerHTML = "<td></td>".repeat(length)
    scrollToBottom()
}

function scrollToBottom() {
    game_area.scrollTop = game_area.scrollHeight
}

function reset(length) {
    board.innerHTML = ""
    createNewRow(length)
    uncolorKeys()
    clearNotificationText()
}

export {scrollToBottom, writeTextToBoard, colorBoard, colorKeys, uncolorKeys, createKeyboard, createNewRow, setNotificationText, clearNotificationText, getNotificationText, reset}
