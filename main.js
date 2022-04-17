var text = ``;
var outputText = ``;
var correctedText = ``;
var homWord = [];
var homNumber = 0;
var whiteList = {};
var blackList = [];
var totalLineCount = 0;
var homophonesSkipped = 0;
var homWordIndex = [];
var suroundingText = 50;

/**
 * Check to see if there is a blacklist in local memory
 * and load it or if not then creat an empty list.
 */
if ((localStorage.getItem("blacklist") === null) || (localStorage.getItem("blacklist") === 'null')) {
    var blackList = []
} else {
    var blackList = localStorage.getItem("blacklist")
}

//Clear display
clear()

/**
 * Takes input text and splits it into an array of every word and punctuation.
 * Itterates though text checking for homophones and entries on balcklist.
 */
function splitText() {

    clear()
    text = ``;
    outputText = ``;
    correctedText = ``;
    homWord = [];
    homNumber = 0;
    whiteList = {};
    blackList = [];
    homophonesSkipped = 0;
    homWordIndex = [];

    text = document.getElementById(`textIn`).value;
    text = text.match(/\w+|\s+|[^\s\w]+/g);
    correctedText = JSON.parse(JSON.stringify(text));

    for (n = 0; n < text.length; n++) {
        correctedWord = text[n].replace("'","-");//Replaces apostraphes with hiphens as apstrphes creat probles when strong words in the dictionary.
        if (blackList.includes(correctedWord)) {
            homophonesSkipped += 1;
        } else if (homophones[correctedWord] != undefined) {
            homWord.push(correctedWord);
            homWordIndex.push(n);
        };
    }

    display()
}

/**
 * Replaces currently quired homophone with selected replacment.
 * @param {integer} N  - the inxed of the homophone that
 *                       will replace the current one
 */
function selectHom(N) {

    if (N == 0) {
        text[homWordIndex[homNumber]] = text[homWordIndex[homNumber]].replace('<strong>','').replace('</strong>','')
    } else {
        correctedText[homWordIndex[homNumber]] = tempArr[N-1]
        text[homWordIndex[homNumber]] = tempArr[N-1]
    }

    homNumber += 1;

    clear()
    display()
}

/**
 * Replaces currently quired homophone with provided string.
 * @param {string} homString    - string of the homophone replacement.
 */
function selectHomByStr(homString) {

    correctedText[homWordIndex[homNumber]] = homString
    text[homWordIndex[homNumber]] = homString

    homNumber += 1;

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
 * Adds the selected homophone to a whitelist for automatic replacment.
 * This is a dictoary which contains the selected homophone (key) and
 * its replacment (value).
 * @param {string}    hom   - homophone to add to dictionary
 */
function skipAll(hom) {
    whiteList[homWord[homNumber]] = homophones[homWord[homNumber]][hom]

    selectHom(hom + 1)

    return whiteList
}

/**
 * Adds the selected homophone to a blacklist which causes all future
 * incidences of that homophone to be ignored. The blacklist is also
 * stored in lcal memory so this can be persistent across sessions.
 */
function blacklistWord() {
    blackList.push(homWord[homNumber])

    selectHom(0)

    localStorage.setItem("blacklist", blackList);

    return blackList
}

/**
 * This sets the HTML display to display the current line that
 * is being worked on.
 */
function display() {

    if (homNumber >= homWordIndex.length) {
        document.getElementById("outputLine").innerHTML = 'End of text'
        document.getElementById("outputLine").style.fontSize = document.getElementById("displyFontSize").value + 'px'
    } else {

        //Calculates the amount of leading and prociding text to display on the screen.
        if (homWordIndex[homNumber]-suroundingText > 0) {
            trailingWords = homWordIndex[homNumber]-suroundingText
        } else {
            trailingWords = 0
        }

        if (homWordIndex[homNumber]+suroundingText < text.length) {
            leadingWords = homWordIndex[homNumber]+suroundingText
        } else {
            leadingWords = text.length
        }

        //Cuts the text down to only the text to display and makes the currently quired homophone bold.
        outputText = text
        outputText[homWordIndex[homNumber]] = `<strong>${outputText[homWordIndex[homNumber]]}</strong>`
        outputText = outputText.slice(trailingWords,leadingWords).join('')

        //Takes the current quiereied homop[hone and checks if it appers in the whitelist.
        if (homWord.length == 0) { //If there are no homophones detected in the user suppllied text disply 'No Homophones Found'.
            console.log('No Homophones')
            document.getElementById("outputLine").innerHTML = 'No Homophones Found'
            document.getElementById("outputLine").style.fontSize = document.getElementById("displyFontSize").value + 'px'
        } else if (homWord[homNumber] in whiteList) { //If the current homophone quieried is in the whitelist then replace it with its designated replacement.
            console.log('Homophone in Whitelist')
            selectHomByStr(whiteList[homWord[homNumber]]);
        } else { //Take the current homophone quieried and display all other homophoes it could be.
            console.log('Homophones Detected')
            document.getElementById("outputLine").innerHTML = outputText
            document.getElementById("outputLine").style.fontSize = document.getElementById("displyFontSize").value + 'px'

            //Creats an arry of all other homophones aside from the quieried one. This allows the display to alway place the quieried homophone at the top and any alternatives to be displayed below it.
            tempArr = removeItemOnce(homophones[homWord[homNumber]], homWord[homNumber])

            //Feches the definition of the quiered homophone.
            var definitionDispalyText = ''
            for (var d = 0; d < definitions[homWord[homNumber].toUpperCase()]['meanings'][0]['definitions'].length; d++) {
                definitionDispalyText = definitionDispalyText.concat(`${d+1 + ''}.
                    ${definitions[homWord[homNumber].toUpperCase()]['meanings'][0]['definitions'][d]['definition']}<br>`)
            }

            //Displayies the feched defintion.
            document.getElementById("selectHom0").innerHTML = `<span class="mainWordStyle">${homWord[homNumber].replace("-","'")}</span>
                <span class="phoneticStyle">${definitions[homWord[homNumber].toUpperCase()]['phonetic']}</span><br>
                <span class="partOfSpeechStyle">${definitions[homWord[homNumber].toUpperCase()]['meanings'][0]['partOfSpeech']}</span><br>
                <span class="definitionStyle">${definitionDispalyText}</span>`;
            document.getElementById("selectHom0").hidden = false
            document.getElementById("selectHom0Ignore").hidden = false

            //Repeat the definition fech and display proccess itterativly for all other homophoines aside from the quiered one.
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
    localStorage.setItem("blacklist", null);
    blackList = []
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

function chageSuroundingText(newLength) {
    suroundingText = newLength;
    clear();
    display();
}

/**
 * Assembuls the final file and download it as a .txt file.
 */
  function downloadDocument() {
    correctedText = correctedText.join('');
    downloadString(correctedText, "text", "Output.txt");
}
