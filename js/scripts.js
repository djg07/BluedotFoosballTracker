/**
 * Created by dtp on 6/17/2015.
 */

var d3;

$(function() {




    //var allPlayers = ["daniel", "steve", "matt", "adriano"]; //get request here for player ids
    //var availablePlayers = ["daniel", "steve", "matt", "adriano"];
    'use strict'
    var allPlayers;
    var availablePlayers;
    var red1 = $('#red1');
    var red2 = $('#red2');
    var black1 = $('#black1');
    var black2 = $('#black2');
    var optionBoxes = [red1, red2, black1, black2];
    resetAll();

    var playerStats = [];

    
    function getTotalStats() {
        
            $.ajax({
                url: "http://firestone.gyges.feralhosting.com/foosball/stats",
                type: "GET",
                success: function(data) {
                    //do something
//                    console.log(data);
                    var data = data.allStats;
                    for (var x = 0; x < data.length; x++) {
                        var player = {};
                        
                        player.name = data[x].player;
                        player.stats = data[x].stats[0].categoryStats
                        
                        playerStats.push(player);
                        
                        
                        
                        
                        
                    }
                    d3.drawViz();
                    
                    
                    
                },
                error: function() {
                    alert('error')
                }
                
            
            
        })
    }
         
    
    
    function resetPlayers() {
        (function() {//resets player input boxes
            $.ajax({
                url: "http://firestone.gyges.feralhosting.com/foosball/players",
                type: "GET",
                success: function(data) {
                    //do something
                    console.log(data.players);
                    allPlayers = data.players;
                    availablePlayers = data.players;
                }
            }).done(function() {
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
            });
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

    function resetAll() {
        resetPlayers();
        resetScore();
        resetStats;
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

        
    $('#stats').click(function() {
        getTotalStats();
        
    })    
    
        
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
        var gameDetailsURL = 'side1=' + redPlayers[0] + '(red):' + redScore + '&side2='+ blackPlayers[0] + '(black):' + blackScore;

        var failMsg = "Submit Failed."
        if ((!redTeamPresent) || !(blackTeamPresent)) {
            alert(failMsg + '\nEach team must have atleast one player!');
            return;
        }

        $.ajax({
            url: "http://firestone.gyges.feralhosting.com/foosball/game?",
            type: "POST",
            data: gameDetailsURL,
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


    
    //d3 visualization
    
    d3.drawViz = function() {
        var colorList = ['#FF0000', '#00CC00', '#0000FF', '#FFFF00']
        var svgWidth = 800;
        var svgHeight = 400;
        //SDEA
        //console.log(playerStats)
        d3.select('#statsContainer')
            .append('svg')
            .attr('height', 0)
            .attr('width', 0)
            .style('background-color', 'lightgrey')
            .transition()
            .duration(200)
            .attr('height', svgHeight)
            .attr('width', svgWidth)    
        
            d3.select('svg')
            .selectAll('rect')
            .data(playerStats)
            .enter()
            
            .append('rect')
            .attr('width', 150)
            .attr('height', function(d,i) {
            
            return d.stats.wins / d.stats.losses *100
            
        })
            
            .attr('x', (function(d,i) {
            return i*180 + 55 
        }))
            
            .attr('fill', function(d,i) {
            return colorList[i]
        })
            .attr('y', svgHeight)
            .transition()
            .delay(function(d,i) {
                return 500
            })
            .duration(500)
            
            .ease('cubic-in-out')
            .attr('y', function(d,i) {
            return svgHeight - (d.stats.wins/d.stats.losses*100)   
        })
            
            //TEXT LABELS
            d3.select('svg')
            
            .selectAll('text')
            .data(playerStats)
            .enter()
            .append('text')
            
            
            .attr('fill', 'white')
            .html(function(d,i){
                 
                return d.name.charAt(0).toUpperCase() + d.name.slice(1);
            })
            .attr('x', (function(d,i) {
                
                var textwidth = $(this).width()
            return (i*180 + 55) + 75 -textwidth/2
        }))            
            .attr('y', function(d,i) {
                var topPos = (svgHeight - (d.stats.wins/d.stats.losses*100))
                var temp = svgHeight - topPos;
                var temp = temp/2
                return topPos + temp
            })
            
            

    }






});