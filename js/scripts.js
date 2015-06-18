/**
 * Created by dtp on 6/17/2015.
 */

$(function() {
    var allPlayers = []; //get request here for player ids
    allPlayers.push("Daniel", "Steve", "Matt", "Adriano");

    var availablePlayers = ["Daniel", "Steve", "Matt", "Adriano"];


    var red1 = $('#red1');
    var red2 = $('#red2');

    var black1 = $('#black1');
    var black2 = $('#black2');

    var optionBoxes = [red1, red2, black1, black2];

    function resetPlayers() {
        (function() {//resets player input boxes
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




    resetPlayers();
    $('.score').find('input').val(0);
    $(".players").change(function(e) {
        console.log(e.target.value);
        var selectedPlayer = e.target.value;
        for (var j=0; j <availablePlayers.length; j++) {
            if (selectedPlayer === availablePlayers[j]) {
                availablePlayers.splice([j], 1);
            }
        }
        for (var j=0; j < optionBoxes.length; j++) {
            debugger;
            if (optionBoxes[j][0] !== e.target) {
                //alert('t');
                optionBoxes[j].find('option[value=' + selectedPlayer + ']').remove();
            }
        }


    });

    $('#reset').click(function() {
        reset();

    })








});