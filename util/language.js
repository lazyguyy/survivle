let selected_language = "english"
let wordlists = {}


const supported_languages = [
    "english,\uD83C\uDDEC\uD83C\uDDE7",
    "german,\uD83C\uDDE9\uD83C\uDDEA"]


function numerus(count, singular, plural) {
    if (count == 1)
        return numbers[count] + " " + singular
    return numbers[count] + " " + plural
}


const english_numbers = ["zero", "one", "two", "three", "four", "five"]
const english_ordinals = ["first", "second", "third", "fourth", "fifth"]
const english_congratulations = [
"One round? If only this was Wordle.",
"At least you didn't lose immediately.",
"Three rounds? Better luck next time!",
"You survived for four rounds. Kinda alright.",
"Five rounds? That's close to winning!",
"Sooo close to truly beating Survivle :(",
"Seven rounds? You did it! Very good!",
"Eight rounds? That is incredible!",
"Nine rounds? A true god amongst Survivlors.",]
const english_default_message = rounds => `${rounds} ROUNDS? Awe-inspiring performance!`

const english_hints = {
    "fixed_letter": (index, letter) => `The ${english_ordinals[index]} letter must be ${letter.toUpperCase()}.`,
    "blocked_letter": (index, letter) => `The ${english_ordinals[index]} letter cannot be ${letter.toUpperCase()}.`,
    "too_few": (letter, exact, count) => `The word contains the letter ${letter.toUpperCase()} ${exact ? "exactly" : "at least"} ${numerus(count, "time", "times")}.`,
    "none": (letter) => `The word does not contain the letter ${letter.toUpperCase()} at all.`,
    "too_many": (letter, count) => `The word contains the letter ${letter.toUpperCase()} only ${numerus(count, "time", "times")}.`,
}

function loadLanguageFiles(language) {
    if (language in wordlists)
        return
    request_file("en_valid_words.txt", )

}

function request_file(filename, callback) {
    relative_path = "/lang/" + filename
    url = window.location.toString();
    url = url.substring(0, url.lastIndexOf("/")) + relative_path;
    console.log(`Requesting ${url}`)

    let request = new XMLHttpRequest();
    request.addEventListener("load", callback);
    request.open("GET", url);
    request.send();
}

function setup() {
    if (localStorage.getItem("language") == null ||)
        localStorage.setItem("language", "english")

}
