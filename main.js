var text = ``;
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

clear()

function splitText() {

    text = document.getElementById("textIn").value;

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
        if (homophones[words[n]] != undefined) {
            homWord.push(words[n]);
			homWordIndex.push(n);
        };
    };

    clear()
    display()
}

function boldWord(line, word) {

    var splitWords = [];

    splitWords = line.trim().split(" ");
	splitWords[word] = '<strong>'.concat(splitWords[word]).concat('</strong>');

    return splitWords.join(' ');
}

function selectHom(N) {

    var splitLine = [];

    splitLine = lines[lineNumber].trim().split(" ");

    var tempArr2 = removeItemOnce(homophones[homWord[homNumber]], homWord[homNumber])

    if (N == 0) {
        splitLine[homWordIndex[homNumber]] = homWord[homNumber]
    } else {
        splitLine[homWordIndex[homNumber]] = tempArr2[N-1]
    }

    lines[lineNumber] = splitLine.join(' ');
    homNumber += 1;

    if (homNumber == homWordIndex.length) {
        homNumber = 0;
        nextLine(1)
        return
    }

    clear()
    display()
}

function removeItemOnce(arr, value) {

    var index = arr.indexOf(value);

    if (index > -1) {
        arr.splice(index, 1);
    }

    return arr;
}

function addToList(hom, homChange = 0) {

    var tempArr3 = [hom];

    if (homChange == 0) {
        blackList.push(hom);
    } else {
        whiteList.push(tempArr3);
        whiteList[whiteList.length-1].push(homChange);
    }

}

function checkList(hom) {

    var bli = blackList.indexOf(hom);
    var wli = whiteList.indexOf(hom);

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

function display() {

    if (homWord.length == 0) {
        document.getElementById("outputLine").innerHTML = lines[lineNumber]
        document.getElementById("outputMessage").innerHTML = "There is no homophones in this line"
    } else {
        document.getElementById("outputLine").innerHTML = boldWord(lines[lineNumber], homWordIndex[homNumber])

        var tempArr = removeItemOnce(homophones[homWord[homNumber]], homWord[homNumber])

        document.getElementById("selectHom0").innerHTML = homWord[homNumber]
        document.getElementById("selectHom0").hidden = false

        for (var m = 0; m < tempArr.length; m++) {
            document.getElementById("selectHom" + (m+1).toString()).innerHTML = tempArr[m]
            document.getElementById("selectHom" + (m+1).toString()).hidden = false
        };
    };


}

function clear() {

    document.getElementById("selectHom0").innerHTML = ""
    document.getElementById("selectHom0").hidden = true

    for (var m = 1; m < 7; m++) {
        document.getElementById("outputLine").innerHTML = ""
        document.getElementById("selectHom" + m.toString()).innerHTML = ""
        document.getElementById("selectHom" + m.toString()).hidden = true
    };
}
