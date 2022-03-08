import {DefaultDict} from "./defaultdict.js"


const numbers = ["zero", "one", "two", "three", "four", "five"]
const ordinals = ["", "first", "second", "third", "fourth", "fifth"]
let hints = makeEmptyHints()
let history = []

const black_block = "\u2B1B"
const yellow_block = "\uD83D\uDFE8"
const green_block = "\uD83D\uDFE9"

const blocks = [black_block, yellow_block, green_block]

const messages = [
"One round? Impressive, but in a bad way.",
"At least you didn't lose immediately.",
"Three rounds? Better luck next time!",
"You survived for four rounds. I have seen worse.",
"Five rounds? That's almost decent.",
"Sooo close to winning Survivle :(",
"Seven rounds? You did it! Very good!",
"Eight rounds? That is incredible!",
"Nine rounds? A true god amongst Survivlors.",]

const default_message = rounds => `${rounds} ROUNDS? Awe-inspiring performance!`

function numerus(count, singular, plural) {
    if (count == 1)
        return numbers[count] + " " + singular
    return numbers[count] + " " + plural
}

function congratulate(rounds) {
    if (rounds <= messages.length)
        return messages[rounds - 1]
    return default_message(rounds)
}

function usesInfo(word){
    let letter_counts = new DefaultDict(() => 0)
    let result = Object()
    for (let i = 0; i < word.length; ++i) {
        letter_counts[word[i]]++
        if (i in hints.fixed_positions && word[i] != hints.fixed_positions[i]) {
            result.message = `The ${ordinals[i + 1]} letter must be ${hints.fixed_positions[i].toUpperCase()}.`
            result.is_valid = false
            return result
        }
        if (hints.blocked_positions[i].has(word[i])) {
            result.message = `The ${ordinals[i + 1]} letter cannot be ${word[i].toUpperCase()}.`
            result.is_valid = false
            return result
        }
    }
    for (const letter of Object.keys(hints.letter_counts)) {
        if (hints.letter_counts[letter] > letter_counts[letter]) {
            result.message = `The word contains the letter ${letter.toUpperCase()} ${hints.gray_letters.has(letter) ? "exactly" : "at least"} ${numerus(hints.letter_counts[letter], "time", "times")}.`
            result.is_valid = false
            return result
        }
        if (hints.gray_letters.has(letter) && letter_counts[letter] > hints.letter_counts[letter]) {
            if (hints.letter_counts[letter] == 0) {
                result.message = `The word does not contain the letter ${letter.toUpperCase()}.`

            } else {
                result.message = `The word contains the letter ${letter.toUpperCase()} only ${numerus(hints.letter_counts[letter], "time", "times")}.`
            }
            result.is_valid = false
            return result
        }
    }
    result.is_valid = true
    return result
}

function appendToHistory(score) {
    for (const s of score) {
        history += blocks[s]
    }
    history += "\n"
}

function updateHints(word, score) {
    let counts = new DefaultDict(() => 0)
    let gray_letters = new Set()
    for (let i = 0; i < word.length; ++i) {
        switch (score[i]){
            case 0:
                gray_letters.add(word[i])
                hints.blocked_positions[i].add(word[i])
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
    for (const letter of Object.keys(counts)) {
        if (counts[letter] > hints.letter_counts[letter]) {
            hints.letter_counts[letter] = counts[letter]
        }
    }
    for (const letter of gray_letters) {
        hints.gray_letters.add(letter)
        hints.letter_counts[letter] = counts[letter]
    }
}

function computeScore(target, entered, as_color_blocks=false) {
    let n = target.length
    let counts = new DefaultDict(() => 0)
    for (let i = 0; i < n; ++i) {
        counts[target[i]]++
    }
    let score = new Array(n).fill(0)

    // if the letters at a position match, the corresponding row entry should be colored green
    for (let i = 0; i < n; ++i) {
        if (target[i] == entered[i]) {
            score[i] = 2
            counts[target[i]]--
        }
    }
    // the remaining row entries of letters that appear at a wrong position should be colored yellow
    for (let i = 0; i < n; ++i) {
        if (score[i] == 0 && counts[entered[i]] > 0) {
            counts[entered[i]] -= 1
            score[i] = 1
        }
    }
    return score
}

function makeEmptyHints() {
    let hints = Object()
    // index -> letter
    hints.fixed_positions = {}
    // index -> {letter1, letter2, ...}
    hints.blocked_positions = new DefaultDict(() => new Set())
    // letter -> count
    hints.letter_counts = new DefaultDict(() => 0)
    // {letter1, letter2, ...}
    hints.gray_letters = new Set()
    return hints
}

function reset() {
    hints = makeEmptyHints()
    history = []
}

function isSolved(score) {
    let result = Object()
    if (score.every(x => x == 2)) {
        result.message = congratulate(history.split("\n").length - 1)
        result.solved = true
    } else {
        result.solved = false
    }
    return result
}

export {history, appendToHistory, computeScore, isSolved, makeEmptyHints, reset, updateHints, usesInfo}