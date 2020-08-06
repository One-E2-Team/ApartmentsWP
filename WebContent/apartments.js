$(document).ready(function () {
    initResultsMap(true, function (latitude, longitude) { 
        var data = getDealMapSummary(latitude, longitude);
        return '<table><tr><a href="' + data[2] + '"<b>Ponuda ' + data[0] + '<b></a></tr><label>' + data[1] + '</label><tr></tr></table>'
    })
});


function getDealMapSummary(latitude, longitude){
    return [1,2,3];
}