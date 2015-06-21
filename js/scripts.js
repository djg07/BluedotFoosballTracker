/**
 * Created by dtp on 6/17/2015.
 */

$(function() {

    var allPlayers = ["daniel", "steve", "matt", "adriano"]; //get request here for player ids
    var availablePlayers = ["daniel", "steve", "matt", "adriano"];


    var red1 = $('#red1');
    var red2 = $('#red2');
    var black1 = $('#black1');
    var black2 = $('#black2');

    var optionBoxes = [red1, red2, black1, black2];

    function resetPlayers() {
        (function() {//resets player input boxes
            var allPlayers = ["daniel", "steve", "matt", "adriano"];
            var availablePlayers = ["daniel", "steve", "matt", "adriano"];

            for (var p=0; p < optionBoxes.length; p++) {
                optionBoxes[p].find('option').remove();
            }

            for (var j=0; j < optionBoxes.length; j++)
            {
                optionBoxes[j].append($('<option></option>').val('').html(''));
                for (var k=0; k < allPlayers.length; k++) {
                    optionBoxes[j].append($('<option></option>').val(allPlayers[k]).html(allPlayers[k]));
                }
            }

        })()
    }

    function resetScore() {
        (function() { //reset score buttons
            $('.score').find('input').val(0);
        })();
    }


    function resetStats() { //TODO - Reset stats grid
        (function() {
        })();
    }

    function getRedPlayers() {
        var redPlayers = [];
        for (var j = 0; j < optionBoxes.length; j++) {
            optBoxStr = optionBoxes[j].selector

            if ((optBoxStr.indexOf('red') === 1) && (optionBoxes[j].val().length > 0)) {
                redPlayers.push(optionBoxes[j].val());
            }
        }
        return redPlayers;
    }

    function getBlackPlayers() {
        var blackPlayers = [];
        for (var j = 0; j < optionBoxes.length; j++) {
            optBoxStr = optionBoxes[j].selector

            if ((optBoxStr.indexOf('black') === 1) && (optionBoxes[j].val().length > 0)) {
                blackPlayers.push(optionBoxes[j].val());
            }
        }
        return blackPlayers;
    }




    resetPlayers();
    $('.score').find('input').val(0);
    $(".players").change(function(e) {
        console.log(e.target.value);
        //debugger;
        //taking person out of available players array
        var selectedPlayer = e.target.value;
        for (var j=0; j <availablePlayers.length; j++) {
            if (selectedPlayer === availablePlayers[j]) {
                availablePlayers.splice([j], 1);
                break;
            }
        }
        //taking person out of options box
        for (var j=0; j < optionBoxes.length; j++) {
            if (optionBoxes[j][0] !== e.target) {
                //alert('t');
                optionBoxes[j].find('option[value=' + selectedPlayer + ']').remove();
            }
        }

        //if current target == adriano, steve, matt, daniel
        //get person, add them back to others

        //section to add back players to list




    });

    $('#reset').click(function() {
        resetPlayers();
        resetScore();

    })

    $('#submit').click(function() {

        //$.ajax({
        //    type: "GET",
        //    dataType: 'json',
        //    url: 'http://firestone.gyges.feralhosting.com/foosball/stats',
        //    crossDomain: true
        //}).done(function(data) {
        //    console.log(data);
        //}).fail(function(xhr, text, error) {
        //    console.log(xhr.responseText);
        //    console.log(tex);
        //})

        var blackPlayers = getBlackPlayers();
        var redPlayers = getRedPlayers();
        var redTeamPresent = redPlayers.length > 0;
        var blackTeamPresent = blackPlayers.length > 0;
        var blackScore = $('#blackScore').val();
        var redScore = $('#redScore').val();
        var rootURL = "http://firestone.gyges.feralhosting.com/foosball/";
        //console.log(blackPlayers[0]);
        //var rootURL = "http://firestone.gyges.feralhosting.com/";
        var gameDetailsURL = 'foosball/game?side1=' + '"' + redPlayers[0] + '(red):' + redScore + '"&side2=' + '"' + blackPlayers[0] + '(black):' + blackScore + '"'

        var failMsg = "Submit Failed."
        if ((!redTeamPresent) || !(blackTeamPresent)) {
            alert(failMsg + '\nEach team must have atleast one player!');
        }
        var d = {
            //game: {
            //    side1: redPlayers[0] + '(red):' + redScore,
            //    side2: blackPlayers[0] + '(black):' + redScore
            //}

            side1: '"Daniel(red):5"',
            side2: '"adriano(black):2"'

        }

        $.ajax({
            url: "http://firestone.gyges.feralhosting.com/foosball/game?",
            type: "POST",
            data: d,
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }

        })







    })








});