var LAB = "Labour";
var CON = "Conservative";
var GRN = "Green";
var LIB = "Lib Dem";
var UKP = "UK Independence Party";
var OTR = "Other";
var PLD = "Plaid Cymru";
var DUP = "DUP";
var SDP = "Social Democratic Party";
var SNP = "SNP";
var ANY = "Anyone";
var IND = "Independent";
var SIN = "Sinn Fein";
var UUP = "Ulster Unionist Party";
var SPEAKER = "Speaker";

function styleLookup(Party) {
    console.log(Party);
    if (Party.includes(" or ")) {
        return "any";
    } else {
        if (Party === LAB) {
            return "lab"
        } else if (Party === CON) {
            return "con"
        } else if (Party === GRN) {
            return "green"
        } else if (Party === LIB) {
            return "lib"
        } else if (Party === UKP) {
            return "ukp"
        } else if (Party === OTR) {
            return "otr"
        } else if (Party === PLD) {
            return "pld"
        } else if (Party === DUP) {
            return "dup"
        } else if (Party === SDP) {
            return "sdp"
        } else if (Party === SNP) {
            return "snp"
        } else if (Party === ANY) {
            return "any"
        } else if (Party === IND) {
            return "ind"
        } else if (Party === SIN) {
            return "sin"
        } else if (Party === UUP) {
            return "uup"
        } else if (Party === SPEAKER) {
            return "speaker"
        }
    }
}
var setParty = "";
var decisions;
$(document).ready(function() {
    var listitems = "";
    $.each(constituencies, function(key, value) {
        listitems += '<option>' + value.Constituency + '</option>';
    });

    $("#constituency").append(listitems);
    //$('#constituency').on('change', selectChange)
    var updatePage = function() {
        //var selectChange = function() {
        //alert( this.value );
        var decision = getDecision($("#constituency option:selected").text());
        console.log(decision[0]);
        console.log(decision[1]);
        $("#votefor").html('you should vote <strong>' + decision[0] + '</strong>');
        $("#reason").text(decision[1]);
        $("body").removeClass(setParty);
        setParty = styleLookup(decision[0]);
        $("body").addClass(setParty);
    }
    $('#constituency').on('change', updatePage);

    // Geographic location detection
    var geoSuccess = function(position) {
        if (position.coords) {
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            var getURL = 'https://api.postcodes.io/postcodes?lon=' + longitude + "&lat=" + latitude;

            $.get(getURL, function(response) {
                if (response && response.result) {
                    // Just take first result for now
                    console.log(response.result[0].parliamentary_constituency);
                    $('#constituency').val(response.result[0].parliamentary_constituency);
                    updatePage();
                }
            });
        }
    }

    var geoErr = function(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("geo permission denied")
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("geo position unavailable")
                break;
            case error.TIMEOUT:
                console.log("geo timeout")
                break;
        }
    }

    var geoOptions = {
        timeout: 10 * 1000
    }

    function getLocation() {
        console.log("getLocation")
        if (navigator.geolocation) {
            console.log("permission granted")
            navigator.geolocation.getCurrentPosition(geoSuccess, geoErr, geoOptions);
        }
    }
    updatePage();
    getLocation();
});


function getDecision(Constituency) {
    var retval = [];
    var decision = "TBC";
    var reason = "Too Close To Call";
    //console.log("Constituency " + Constituency);
    //console.log(decisions);
    for (var i = 0; i < decisions.length; i++) {
        if (decisions[i].Constituency.toLowerCase().trim() === Constituency.toLowerCase().trim()) {
            decision = decisions[i].VoteFor;
            reason = decisions[i].Why;
            break;
        }
    }
    retval.push(decision);
    retval.push(reason);
    return retval;
}