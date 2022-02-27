var text = ``;
var outputText = ``;
var lines = [];
var words = [];
var homWord = [];
var full = [];
var excimation = [];
var question = [];
var lineNumber = -1;
var X = 1;
var homNumber = 0;
var whiteList = [];
var blackList = [];
var totalLineCount = 0;
var homophonesSkipped = 0;
var whiteList2 = {};
var startIndex = 0;
var wordIndex = [0,0];
var homWordOutputIndex = [];

/**
 * Check to see if there is a blacklist in local memory
 * and load it or if not then creat an empty list.
 */
if (localStorage.getItem("blacklist") != 'null') {
    var blackList2 = localStorage.getItem("blacklist")
} else {
    var blackList2 = []
}

clear()

/**
 * This takes the text input from the HTML interface and
 * splits it into lines baces on where an "." or "!" or
 * "?" at the end the nextLine() is called.
 */
function splitText() {

    text = document.getElementById(`textIn`).value;
    outputText = text;

    while (X == 1) {
        full = text.split(".", 1);
        excimation = text.split("!", 1);
        question = text.split("?", 1);
        if (full[0].length < excimation[0].length && full[0].length < question[0].length) {
            lines.push(full[0] + ".");
            text = text.slice(full[0].length + 1);
        } else if (excimation[0].length < full[0].length && excimation[0].length < question[0].length) {
            lines.push(excimation[0] + "!");
            text = text.slice(excimation[0].length + 1);
        } else if (question[0].length < full[0].length && question[0].length < excimation[0].length) {
            lines.push(question[0] + "?");
            text = text.slice(question[0].length + 1);
        } else {
            lines.push(text);
            X = 0;
        }
    }

    lineNumber = -1
    nextLine(1)
}

function findWord(word) {
    var quieryWord = word.replace('.', '').replace('?', '').replace('!', '');
    console.log(quieryWord)
    startIndex = wordIndex[0]
    wordIndex[0] = outputText.substring(startIndex).indexOf(quieryWord);
    console.log(wordIndex)
    console.log(quieryWord.length)
    console.log(startIndex)
    return [startIndex+wordIndex[0],wordIndex[0]+quieryWord.length];
}

/**
 * This takes the next or last line and finds all
 * the homophones in it.
 * @param {integer} move  - this tells the function to take
 *                          the next (1) or last (-1) line
 */
function nextLine(move) {

    words = [];
    homWord = [];
	homWordIndex = [];

    if (move === 1 && lineNumber < lines.length - 1) {
        lineNumber += 1
        words = lines[lineNumber].trim().split(" ");
    } else if (move === -1 && lineNumber > 0) {
        lineNumber -= 1
        words = lines[lineNumber].trim().split(" ");
    } else {
        return
    }

    for (var n = 0; n < words.length; n++) {

        var correctedWord = words[n].replace("'","-").replace('.', '')
        if (blackList2.includes(correctedWord)) {
            homophonesSkipped += 1;
        } else if (homophones[correctedWord] != undefined) {
            homWord.push(correctedWord);
			homWordIndex.push(n);
        };
    };

    clear()
    display()
}

/**
 * This takes the current line being worked on
 * and sets the word being looked at to be bold.
 * @param {string}   line   - the current line being changed
 * @param {integer}  word   - the wored that needs bold text
 * @returns {string}        - the retured chaged line
 */
function boldWord(line, word) {

    var splitWords = [];

    splitWords = line.trim().split(" ");
	splitWords[word] = '<strong>'.concat(splitWords[word]).concat('</strong>');

    return splitWords.join(' ');
}

// function listChange() {

//     var splitLine2 = [];

//     splitLine2 = lines[lineNumber].trim().split(" ");

//     if (checkList(homWord[homNumber]) == -2) {
//         homNumber += 1;
//         console.log("homNumber: " + homNumber);
//     } else if (checkList(homWord[homNumber]) > -1) {
//         console.log("whiteList: " + whiteList);
//         console.log("homWord[homNumber]: " + homWord[homNumber]);
//         console.log("homWord: " + homWord);
//         console.log("homNumber: " + homNumber);
//         console.log("checkList(homWord[homNumber]): " + checkList(homWord[homNumber]));
//         console.log("whiteList[checkList(homWord[homNumber])]: " + whiteList[checkList(homWord[homNumber])]);
//         splitLine2[homWordIndex[homNumber]] = whiteList[checkList(homWord[homNumber])][1]
//         lines[lineNumber] = splitLine2.join(' ');
//         homNumber += 1;
//     }

// }

function setCharAt(str,index,chr) {
    //console.log(`preciding str: ${str.substring(0,index[0])}`)
    //console.log(`replacment: ${chr}`)
    //console.log(`post str: ${str.substring(index[1])}`)
    return str.substring(0,index[0]) + chr + str.substring(index[1]);
}

/**
 * This takes the current line being worked on and chages
 * the word being looked at to the new homophone.
 * @param {integer}  N  - the inxed of the homophone that
 *                        will replace the current one
 */
function selectHom(N) {

    var splitLine = [];

    console.log(wordIndex)

    splitLine = lines[lineNumber].trim().split(" ");

    var tempArr2 = removeItemOnce(homophones[homWord[homNumber]], homWord[homNumber])

    if (N == 0) {
        quieryWordIndex = findWord(splitLine[homWordIndex[homNumber]])
        console.log(quieryWordIndex)
        splitLine[homWordIndex[homNumber]] = homWord[homNumber]
        outputText = setCharAt(outputText,quieryWordIndex,homWord[homNumber].replace("-","'"));
    } else {
        quieryWordIndex = findWord(splitLine[homWordIndex[homNumber]])
        console.log(quieryWordIndex)
        splitLine[homWordIndex[homNumber]] = tempArr2[N-1]
        outputText = setCharAt(outputText,quieryWordIndex,tempArr2[N-1].replace("-","'"));
    }

    lines[lineNumber] = splitLine.join(' ');
    homNumber += 1;

    if (homNumber == homWordIndex.length) {
        homNumber = 0;
        homWordOutputIndex = [];
        nextLine(1)
        //listChange()
        return
    }

    //listChange()
    clear()
    display()
}

/**
 * This takes the current line being worked on and chages
 * the word being looked at to the new homophone.
 */
function selectHomByStr(homString) {

    var splitLine = [];

    splitLine = lines[lineNumber].trim().split(" ");

    splitLine[homWordIndex[homNumber]] = homString

    lines[lineNumber] = splitLine.join(' ');
    homNumber += 1;

    if (homNumber == homWordIndex.length) {
        homNumber = 0;
        nextLine(1)
        //listChange()
        return
    }

    //listChange()
    clear()
    display()
}

/**
 * This takes an inputed array and finds then removes a element.
 * @param {array}    arr     - the array that needs a element removed
 * @param {integer}  value   - the element that needs to be removed
 * @returns {array}          - the newly chaged array
 */
function removeItemOnce(arr, value) {

    var index = arr.indexOf(value);

    if (index > -1) {
        arr.splice(index, 1);
    }

    return arr;
}

/**
 * This takes a word and adds
 * it to a blacklist or whiteList
 * @param {integer}  hom  - this is the index of the word to be added
 */
function addToList(hom) {

    var tempArr4 = removeItemOnce(homophones[homWord[homNumber]], homWord[homNumber]);

    if (hom == 0) {
        blackList.push(homWord[homNumber]);
    } else {
        var tempArr3 = [homWord[homNumber]];
        whiteList.push(tempArr3);
        whiteList[whiteList.length-1].push(tempArr4[hom-1]);
    }

    selectHom(hom);
}

/**
 * Adds the selected homophone to a whitelist for automatic replacment.
 * This is a dictoary which contains the selected homophone (key) and
 * its replacment (value).
 */
function skipAll(hom) {
    whiteList2[homWord[homNumber]] = homophones[homWord[homNumber]][hom]
    
    selectHom(hom + 1)

    return whiteList2
}

/**
 * Adds the selected homophone to a blacklist which causes all future
 * incidences of that homophone to be ignored. The blacklist is also
 * stored in lcal memory so this can be persistent across sessions.
 */
function blacklistWord() {
    blackList2.push(homWord[homNumber])

    selectHom(0)

    localStorage.setItem("blacklist", blackList2);

    return blackList2
}

/**
 * This looks for a word in the whiteList and blackList.
 * @param {string}     hom   - this is the word that is being looked for
 * @returns {integer}        - the array index for the whiteList
 *                           - -1 is if the word is in no array
 *                           - -2 is if the word is in the blackList
 */
function checkList(hom) {

    var bli = blackList.indexOf(hom);
    var wli = -1;

    for (var i = 0; i < whiteList.length; i++) {
        if (whiteList[i].indexOf(hom) != undefined && whiteList[i].indexOf(hom) == 0) {
            wli = i;
        }
    }

    if (-1 != bli) {
        homNumber += 1;
        return -2;
    } else if (-1 != wli) {
        homNumber += 1;
        return wli;
    } else {
        return -1;
    }
}

/**
 * This sets the HTML display to display the current line that
 * is being worked on.
 */
function display() {

    document.getElementById("lineCount").innerHTML = `Currenly on line ${lineNumber}/${totalLineCount}`

    if (homWord.length == 0) {
        document.getElementById("outputLine").innerHTML = lines[lineNumber]
        document.getElementById("outputLine").innerHTML = `<span style="font-style:italic;">There are no homophones in this line</span>`
        document.getElementById("outputLine").style.fontSize = document.getElementById("displyFontSize").value + 'px'
    } else if (homWord[homNumber] in whiteList2) {
        selectHomByStr(whiteList2[homWord[homNumber]]);
    } else {
        document.getElementById("outputLine").innerHTML = boldWord(lines[lineNumber], homWordIndex[homNumber])
        document.getElementById("outputLine").style.fontSize = document.getElementById("displyFontSize").value + 'px'

        var tempArr = removeItemOnce(homophones[homWord[homNumber]], homWord[homNumber])

        var definitionDispalyText = ''
        for (var d = 0; d < definitions[homWord[homNumber].toUpperCase()]['meanings'][0]['definitions'].length; d++) {
            definitionDispalyText = definitionDispalyText.concat(`${d+1 + ''}.
                ${definitions[homWord[homNumber].toUpperCase()]['meanings'][0]['definitions'][d]['definition']}<br>`)
        }

        document.getElementById("selectHom0").innerHTML = `<span class="mainWordStyle">${homWord[homNumber].replace("-","'")}</span>
            <span class="phoneticStyle">${definitions[homWord[homNumber].toUpperCase()]['phonetic']}</span><br>
            <span class="partOfSpeechStyle">${definitions[homWord[homNumber].toUpperCase()]['meanings'][0]['partOfSpeech']}</span><br>
            <span class="definitionStyle">${definitionDispalyText}</span>`;
        document.getElementById("selectHom0").hidden = false
        document.getElementById("selectHom0Ignore").hidden = false

        for (var m = 0; m < tempArr.length; m++) {
            var definitionDispalyText = ''
            for (var d = 0; d < definitions[tempArr[m].toUpperCase()]['meanings'][0]['definitions'].length; d++) {
                definitionDispalyText = definitionDispalyText.concat(`${d+1 + ''}.
                    ${definitions[tempArr[m].toUpperCase()]['meanings'][0]['definitions'][d]['definition']}<br>`)
            }
            document.getElementById("selectHom" + (m+1).toString()).innerHTML = `<span class="mainWordStyle">${tempArr[m].replace("-","'")}</span>
            <span class="phoneticStyle">${definitions[tempArr[m].toUpperCase()]['phonetic']}</span><br>
            <span class="partOfSpeechStyle">${definitions[tempArr[m].toUpperCase()]['meanings'][0]['partOfSpeech']}</span><br>
            <span class="definitionStyle">${definitionDispalyText}</span>`;
            document.getElementById("selectHom" + (m+1).toString()).hidden = false
            document.getElementById("selectHom" + (m+1).toString() + "DoAll").hidden = false
        };
    };
}

/**
 * This sets the HTML display to display nothing and clears all
 * remaing text.
 */
function clear() {

    document.getElementById("selectHom0").innerHTML = ""
    document.getElementById("selectHom0").hidden = true
    document.getElementById("selectHom0Ignore").hidden = true

    for (var m = 1; m < 7; m++) {
        document.getElementById("outputLine").innerHTML = ""
        document.getElementById("selectHom" + m.toString()).innerHTML = ""
        document.getElementById("selectHom" + m.toString()).hidden = true
        document.getElementById("selectHom" + m.toString() + "DoAll").hidden = true
    };
}

/**
 * This clears the blacklist from local memory
 */
function clearBlacklist() {
    localStorage.setItem("blacklist", 'null');
    blackList2 = []
}

/**
 * Allows downloading of a string. Function created by danallison
 * (https://gist.github.com/danallison/3ec9d5314788b337b682)
 */
function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType });
  
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }

/**
 * Assembuls the final file and download it as a .txt file.
 */
  function downloadDocument() {
    outputText = lines.join(". ");
    outputText = outputText.replaceAll('..  ','. ');
    downloadString(outputText, "text", "Output.txt");
}