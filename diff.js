function handleAllRemoved(result, spaceChar) {
    var str = "";
    for (var i = 0; i < result.old.length; i++) {
        str += '<del>' + result.old[i] + spaceChar + "</del>";
    }
    return str;
}

function handleFrontRemoved(result, spaceChar) {
    var str = "";
    for (n = 0; n < result.old.length && result.old[n].text == null; n++) {
        str += '<del>' + result.old[n] + spaceChar + "</del>";
    }
    return str;
}

function handleAdded(result, spaceChar, i) {
    return '<ins>' + result.new[i] + spaceChar + "</ins>";
}

function handleRemoved(result, spaceChar, i) {
    var removed = "";
    for (n = result.new[i].pos + 1; n < result.old.length && result.old[n].text == null; n++ ) {
        removed += '<del>' + result.old[n] + spaceChar + "</del>";
    }
    return removed;
}

function diff(oldString, newString, mode) {
    mode = mode ? mode : "words";

    var regex = mode === "lines" ? /\n+|\r\n+/ : /\s+/;
    var regexSpaces = mode === "lines" ? /\n+|\r\n+/g : /\s+/g;

    var result = diffString(oldString == "" ? [] : oldString.split(regex), newString == "" ? [] : newString.split(regex) );
    var str = "";
    var spaceChar = mode === "lines" ? "<br/>" : " ";

    if (result.new.length == 0) {
        str += handleAllRemoved(result, spaceChar);
    } else {
        if (result.new[0].text == null) {
            str += handleFrontRemoved(result, spaceChar);
        }

        for (var i = 0; i < result.new.length; i++) {
            if (result.new[i].text == null) {
                str += handleAdded(result, spaceChar, i);
            } else {
                str += " " + result.new[i].text + spaceChar + handleRemoved(result, spaceChar, i);
            }
        }
    }

    return str;
}

function fillData(str, data, otherStr) {
    for (var i = 0; i < str.length; i++) {
        if (data[str[i]] == null) {
            data[str[i]] = {
                pos: null,
            };
            data[str[i]][otherStr] = null;
        }

        data[str[i]].pos = i;
    }
}

function markIdentical(newString, oldString, newData, oldData) {
    Object.keys(newData).forEach(function(i) {
        if (newData[i].pos !== null &&
            typeof(oldData[i]) != "undefined" &&
            oldData[i].pos !== null
        ) {
            newString[newData[i].pos] = {
                text: newString[newData[i].pos],
                pos: oldData[i].pos
            };
            oldString[oldData[i].pos] = {
                text: oldString[oldData[i].pos],
                pos: newData[i].pos
            };
        }
    });
}

function diffString(oldString, newString) {
    var oldData = {};
    var newData = {};

    fillData(newString, newData, 'oldString');
    fillData(oldString, oldData, 'newString');

    markIdentical(newString, oldString, newData, oldData);

    return {
        old: oldString,
        new: newString
    };
}
