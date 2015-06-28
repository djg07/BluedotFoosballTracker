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
                    console.log(data);
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
            
            $('#mainStats').remove();
            playerStats = []
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
            var optBoxStr = optionBoxes[j].selector

            if ((optBoxStr.indexOf('red') === 1) && (optionBoxes[j].val().length > 0)) {
                redPlayers.push(optionBoxes[j].val());
            }
        }
        return redPlayers;
    }

    function getBlackPlayers() {
        var blackPlayers = [];
        for (var j = 0; j < optionBoxes.length; j++) {
            console.log(optionBoxes)
            var optBoxStr = optionBoxes[j].selector

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

        //TODO
        //section to add back players to list
    });

        
    $('#stats').click(function() {
        getTotalStats();
        
    })    
    
        
    $('#reset').click(function() {
        resetPlayers();
        resetScore();
        resetStats()

    })

    $('#submit').click(function() {

        var blackPlayers = getBlackPlayers();
        var redPlayers = getRedPlayers();
        var redTeamPresent = redPlayers.length > 0;
        var blackTeamPresent = blackPlayers.length > 0;
        var blackScore = $('#blackScore').val();
        var redScore = $('#redScore').val();
        var rootURL = "http://firestone.gyges.feralhosting.com/foosball/";
        //console.log(blackPlayers[0]);
        //var rootURL = "http://firestone.gyges.feralhosting.com/";
        
        var failMsg = "Submit Failed."
        if ((!redTeamPresent) || !(blackTeamPresent)) {
            alert(failMsg + '\nEach team must have atleast one player!');
            return;
        }
        
        if ((blackPlayers.length == 1) && (redPlayers.length == 1)) {
            alert('1vs1');
            return;
            OneVsOne();
        } 
        if ((blackPlayers.length == 2) && (redPlayers.length == 2)){
            alert('2vs2')
            TwoVsTwo()
        } else {
            alert(failMsg);
            return;
        }
        
        
        
        
        function OneVsOne() {
            var gameDetailsURL = 'side1=' + redPlayers[0] + '(red):' + redScore + '&side2='+ blackPlayers[0] + '(black):' + blackScore;

        

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
        }
        
        function TwoVsTwo() {
            // " == %22
            // & == %26
            var gameDetailsURL = 'side1=' + redPlayers[0] + '%28redO%29' +
                '%2B' + redPlayers[1] + '%28redD%29:' + redScore + "&" +
                
                'side2=' + blackPlayers[0] + '%28blackO%29' + '%2B' +
                blackPlayers[1] + '%28blackD%29:' + blackScore
            
            console.log(gameDetailsURL);
            
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
            
            
            
        }
        
    })

    //d3 visualization
    
    d3.drawViz = function() {
//        var colorList = ['#FF0000', '#00CC00', '#0000FF', '#A30052']
//        var colorList = ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4']
          var colorList = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3']


        var svgWidth = 800;
        var svgHeight = 400;
        //SDEA
        //console.log(playerStats)
       
        
        //////////
        
        
        
        
        
        //MAIN CONTAINER
        d3.select('#statsContainer')
            .append('svg')
            .attr('id', 'mainStats')
            .attr('height', 0)
            .attr('width', 0)
            //.style('background-color', 'lightgrey')
            .transition()
            .duration(200)
            .attr('height', svgHeight)
            .attr('width', svgWidth)    
        
        //BACKGROUND GRID ANIMATION
         d3.select('#mainStats')
            .selectAll("rect")
            .data([1, 2, 3, 4, 5, 6, 7, 8, 8,7,6,5,4,3,2,1,1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1])
            .enter().append('rect')
            .attr('id', 'trans')
            .attr('width', '100')
            .attr('height', '100')
            .attr('x', function(d, i){
    //            alert(d)
               return (d-1)*100 
             })
            .attr('y', function(d,i){
//                alert(Math.floor((i/3))*100)
                return Math.floor((i/8))*100

             })
             .attr("opacity",0)
            .style('stroke', 'white' )
            .attr('fill', 'black')
            .transition()
            .delay(function(d,i) {
                return i*50
            })

            .duration(1000)

            .attr("opacity",1)  
        
        d3.select('#mainStats')
            .selectAll('.bar')
            .data(playerStats)
            .enter()
            
            .append('rect')
            .attr('class', 'bar')
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
                return 2000
            })
            .duration(500)
            
            .ease('cubic-in-out')
            .attr('y', function(d,i) {
            return svgHeight - (d.stats.wins/d.stats.losses*100)   
        })
            
            //TEXT LABELS
            setTimeout(function() {
                d3.select('#mainStats')

                .selectAll('text')
                .data(playerStats)
                .enter()
                .append('text')


                .attr('fill', 'white')
                .attr('class', 'userLabel')
                .attr('font-size', 24)
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
            },2500)
    }
});