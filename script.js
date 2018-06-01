$(document).ready(function () {
    var sessionCountDown = 25;  // Session time in mins.
    var breakCountDown = 5;     // Break time in mins.
    var time = 0;               // Total time in seconds for timer and binary clock calculation.
    var mins = 0;               // Countdown timer's mins.
    var seconds = 0;            // Countdown timer's secs.
    var pause = false;          // Countdown timer's active / paused property.

    $(".sessionCountDownTimer, .breakCountDownTimer, .reset, .pause, .clock, .alertMessage").hide();
    $(".sessionTimer").html(sessionCountDown);
    $(".breakTimer").html(breakCountDown);
/* Session & Break Timer Adjustment Section */


    $(".subtractSession").click(function() {
        if(sessionCountDown > 1) {
            sessionCountDown -= 1;

            $(".sessionTimer").html(sessionCountDown);
        }
    });

    $(".addSession").click(function() {
        sessionCountDown += 1;

        $(".sessionTimer").html(sessionCountDown);
    });

    $(".subtractBreak").click(function() {
        if(breakCountDown > 1) {
            breakCountDown -= 1;

            $(".breakTimer").html(breakCountDown);
        }
    });

    $(".addBreak").click(function() {
        breakCountDown += 1;

        $(".breakTimer").html(breakCountDown);
    });

/* Start and Stop Button Section */
    var startSessionCountDown = ''; // Interval of Session timer.
    var startBreakCountDown = '';   // Interval of Break timer.

    $(".start").click(function() {

        // Hide timer/break adjustment buttons and values and display the countdown timer.
        $(".selectorArea, .start").fadeOut(200);
        $(".sessionCountDownTimer, .pause, .clock").delay(600).fadeIn(300).delay(500);
        
        // Time calculations.
        time = sessionCountDown * 60;
        mins = sessionCountDown;
        seconds = time % 60;

        if(mins < 10) {
            $(".sessionCounter").html("0" + mins + " : 0" + seconds);
        }
        else {
            $(".sessionCounter").html(mins + " : 0" + seconds);
        }
        
        binaryClock(time); // Set binary clock display based on selected amount of time.
        
        startSessionCountDown = setInterval(startSession, 1000); // Start session with interval of 1000 milliseconds.

        // Session interval function.
        function startSession() {
            if(!pause) {
                time -= 1;

                mins = Math.floor(time / 60);
                seconds = time % 60;

                if(seconds < 10 && mins < 10) {
                    $(".sessionCounter").html("0" + mins + " : 0" + seconds);
                }
                else if(seconds < 10 && mins >= 10) {
                    $(".sessionCounter").html(mins + " : 0" + seconds);
                }
                else if(seconds >= 10 && mins < 10) {
                    $(".sessionCounter").html("0" + mins + " : " + seconds);
                }
                else {
                    $(".sessionCounter").html(mins + " : " + seconds);
                }
            }

            binaryClock(time); // Update binary clock at current mins : seconds.

            // Stop session's interval when session timer reaches 0.
            if(time <= 0) {
                clearInterval(startSessionCountDown);
                $(".sessionCountDownTimer").hide();
                $(".breakCountDownTimer").fadeIn("slower");

                // Show alert when session is over.
                $(".alertMessage").html("TAKE A BREAK!")
                $(".alertMessage").show("shake");
                  
                // Calculate break time based on input.
                time = breakCountDown * 60;
                mins = breakCountDown;
                seconds = time % 60;

                if(mins < 10) {
                    $(".breakCounter").html("0" + mins + " : 0" + seconds);
                }
                else {
                    $(".breakCounter").html(mins + " : 0" + seconds);
                }

                binaryClock(time); // Update binary clock to selected break time.
            
                // Hide alert after delay and then start break.
                setTimeout(function(){
                    $(".alertMessage").hide("slide", { direction: "down" }, 1000);
                
                    startBreakCountDown = setInterval(startBreak, 1000);

                }, 2000);
            }
        }
        
        // Break interval function.
        function startBreak() {
            if(!pause){
                time -= 1;

                mins = Math.floor(time / 60);
                seconds = time % 60;

                if(seconds < 10 && mins < 10) {
                    $(".breakCounter").html("0" + mins + " : 0" + seconds);
                }
                else if(seconds < 10 && mins >= 10) {
                    $(".breakCounter").html(mins + " : 0" + seconds);
                }
                else if(seconds >= 10 && mins < 10) {
                    $(".breakCounter").html("0" + mins + " : " + seconds);
                }
                else {
                    $(".breakCounter").html(mins + " : " + seconds);
                }
            }
            
            binaryClock(time); // Update binary clock at current mins : seconds.

            // When break is over, notify user of completion and give options to restart timer from the beginning again.
            if(time <= 0) {
                clearInterval(startBreakCountDown);
                $(".pause").hide();
                $(".reset").fadeIn(500);
                $(".alertMessage").html("SESSION COMPLETED!")
                $(".alertMessage").show("shake");
            }
        }
    });

    // Reset all values and display back to initial display.
    $(".reset").click(function() {
        $(".sessionCountDownTimer, .breakCountDownTimer, .reset, .pause, .clock, .alertMessage").fadeOut(600);
        $(".selectorArea, .start").delay(700).fadeIn(500).delay(1200);
        clearInterval(startSessionCountDown);
        clearInterval(startBreakCountDown);

        placeValue('minsTens', 0);
        placeValue('minsOnes', 0);
        placeValue('secondsTens', 0);
        placeValue('secondsOnes', 0);
        
        $(".pause").html("Pause");
        pause = false;
        time = 0;
        sessionCountDown = 25;
        breakCountDown = 5;

        $(".sessionTimer").html(sessionCountDown);
        $(".breakTimer").html(breakCountDown);
    });
    

    // Pause clock on button click.
    $(".pause").click(function() {
        if(!pause) {
            pause = true;
            $(".pause").html("Resume");
            $(".reset").delay(500).show(500);
            $(".pause") .fadeIn(500);
        }
        else {
            pause = false;
            $(".pause").html("Pause");
            $(".reset").hide(500);
            $(".pause").hide().fadeIn(500);
            
        }
    });
    

/* Binary Clock Section */
    var secondsOnes = 0;    // Ones place of seconds display on binary clock ** : *0
    var secondsTens = 0;    // Tens place of seconds display on binary clock ** : 0*
    var minsOnes = 0;       // Ones place of minutes display on binary clock *0 : **
    var minsTens = 0;       // Tens place of minutes display on binary clock 0* : **

    // Set the place value of minutes and seconds, then call placeValue function to display each value on binary clock.
    function binaryClock(timeInSeconds) {
        minsTens = Math.floor((Math.floor(timeInSeconds / 60)) /10);
        minsOnes = Math.floor((Math.floor(timeInSeconds / 60)) %10);
        secondsTens = Math.floor((timeInSeconds % 60) /10);
        secondsOnes = (timeInSeconds % 60) % 10;

        placeValue('minsTens', minsTens);
        placeValue('minsOnes', minsOnes);
        placeValue('secondsTens', secondsTens);
        placeValue('secondsOnes', secondsOnes);
        
    }

    /* Place Value Binary Caller */
    function placeValue(place, val) {

        // Based on the value of "val" that was passed, call the appropriate function with the "place" value.
        switch(val) {
            case 1: one(place); 
            break;
            case 2: two(place); 
            break;
            case 3: three(place); 
            break;
            case 4: four(place); 
            break;
            case 5: five(place); 
            break;
            case 6: six(place); 
            break;
            case 7: seven(place); 
            break;
            case 8: eight(place); 
            break;
            case 9: nine(place); 
            break;
            case 0: zero(place); 
            break;
        }
    }

/*  Binary setting on List Items 
    Based on the "place" value, manipulate each ul li to reflect the binary number that should be displayed on the clock.
    Display of binary is based on 4 li with the bottom item (4th child) at the '1' place, second last (3rd child) at the '2' place,
    second ite (2nd child) at the '4' place, and first item (first child) at the '8' place. Limite is set to 4 items as that is 
    enough to display 0-10 in the decimal system. The first item on the tens place is always hidden as a clock display of the tens
    place for mins and seconds is only from 0-5 and this is set up in css with "hide" class.
    */

    function one(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").removeClass("active");
        $("ul." + place + " li:nth-child(3)").removeClass("active");
        $("ul." + place + " li:nth-child(4)").addClass("active");
    }
    function two(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").removeClass("active");
        $("ul." + place + " li:nth-child(3)").addClass("active");
        $("ul." + place + " li:nth-child(4)").removeClass("active");
    }
    function three(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").removeClass("active");
        $("ul." + place + " li:nth-child(3)").addClass("active");
        $("ul." + place + " li:nth-child(4)").addClass("active");
    }
    function four(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").addClass("active");
        $("ul." + place + " li:nth-child(3)").removeClass("active");
        $("ul." + place + " li:nth-child(4)").removeClass("active");
    }
    function five(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").addClass("active");
        $("ul." + place + " li:nth-child(3)").removeClass("active");
        $("ul." + place + " li:nth-child(4)").addClass("active");
    }
    function six(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").addClass("active");
        $("ul." + place + " li:nth-child(3)").addClass("active");
        $("ul." + place + " li:nth-child(4)").removeClass("active");
    }
    function seven(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").addClass("active");
        $("ul." + place + " li:nth-child(3)").addClass("active");
        $("ul." + place + " li:nth-child(4)").addClass("active");
    }
    function eight(place) {
        $("ul." + place + " li:nth-child(1)").addClass("active");
        $("ul." + place + " li:nth-child(2)").removeClass("active");
        $("ul." + place + " li:nth-child(3)").removeClass("active");
        $("ul." + place + " li:nth-child(4)").removeClass("active");
    }
    function nine(place) {
        $("ul." + place + " li:nth-child(1)").addClass("active");
        $("ul." + place + " li:nth-child(2)").removeClass("active");
        $("ul." + place + " li:nth-child(3)").removeClass("active");
        $("ul." + place + " li:nth-child(4)").addClass("active");
    }
    function zero(place) {
        $("ul." + place + " li:nth-child(1)").removeClass("active");
        $("ul." + place + " li:nth-child(2)").removeClass("active");
        $("ul." + place + " li:nth-child(3)").removeClass("active");
        $("ul." + place + " li:nth-child(4)").removeClass("active");
    }

});