badWords = require('./badwords')

function filterText(text) {
    if(text == "" || text == " ") return text;
    let words = text.split(' ');
    let filteredWords = words.map(word => {
        if (badWords[word.toLowerCase()]) {
            return "***";
        } else {
            return word;
        }
    });
    return filteredWords.join(' ');
}

module.exports = filterText
