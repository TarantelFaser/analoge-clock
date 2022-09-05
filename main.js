
//canvas variables
let ctx;
let canvas;

//clock size variables
let midX;
let midY;
let clockRadius;
let hourPointerLength;
let minutePointerLength;
let secondPointerLength;
let minimalistic;
let enableNumbers;
let enableDateTime;

//month / weekday arrays
const months = ["january", "february", "march", "april", "may", "august", "september", "october", "november", "december"];
const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

//time zone adjustments in hours
const timeZoneAdjustments = 2;

//calculate milliseconds in minute, hour, day, year;
const minute = 1000*60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

//if window resizes clock might be stretched so re-load canvas size
window.onresize = function(){
    //location.reload();
    loadClock();
}

//draw clock and animat it
function loadClock() {
    configureCanvasContext();
    drawStaticClockElements();
    setInterval(loop, 2);
}

//update the clock
function loop() {

    ctx.clearRect(0,0, canvas.width, canvas.height); //clear canvas for new drawing
    if (!minimalistic) drawStaticClockElements(); //draw everything that does not move

    //get time
    let d = new Date();
    let yearDate = d.getFullYear();
    let dayDate = d.getDate();
    let monthDate = d.getMonth() + 1;
    let hourDate = d.getHours();
    let minuteDate = d.getMinutes();
    let secondDate = d.getSeconds();

    let t = d.getTime();
    let years = t / year;
    let days = (years - Math.trunc(years)) * 365;
    let hours = (days - Math.trunc(days)) * 24 + timeZoneAdjustments;
    let minutes = (hours - Math.trunc(hours)) * 60;
    let seconds = (minutes - Math.trunc(minutes)) * 60;

    //print time + date text
    if (enableDateTime) {
        ctx.textAlign = "center";
        let sSec = secondDate < 10 ? "0".concat(secondDate) : secondDate;
        let sMin = minuteDate < 10 ? "0".concat(minuteDate) : minuteDate;
        let sHou = hourDate < 10 ? "0".concat(hourDate) : hourDate;
        ctx.fillText(sHou + ":" + sMin + ":" + sSec, midX, midY*0.40);
        ctx.fillText(weekdays[d.getDay()], midX, midY*0.45);
        ctx.fillText(months[d.getMonth()], midX, midY*0.5);
        ctx.fillText(dayDate + "." + monthDate + "." + yearDate, midX, midY*0.55);
    }

    drawLine(hours, minutes, seconds);
}

//paint clock pointers
function drawLine(hours, minutes, seconds) {
    //seconds indicator
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(midX, midY);
    ctx.lineTo(getX(-seconds*Math.PI/30 + Math.PI/2, secondPointerLength), getY(seconds*Math.PI/30 + Math.PI/2, secondPointerLength));
    ctx.stroke();

    //minute indicator
    ctx.beginPath();
    ctx.lineWidth = 4;
    let endX = getX(-minutes*Math.PI/30 + Math.PI/2, minutePointerLength);
    let endY = getY(minutes*Math.PI/30 + Math.PI/2, minutePointerLength);
    ctx.moveTo(midX, midY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    //circle at end of minute indicator
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.arc(endX, endY, 1, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    //hour indicator
    ctx.beginPath();
    ctx.lineWidth = 10;
    endX = getX(-hours*Math.PI/6 + Math.PI/2, hourPointerLength);
    endY = getY(hours*Math.PI/6 + Math.PI/2, hourPointerLength);
    ctx.moveTo(midX, midY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    //circle at end of hour indicator
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.arc(endX, endY, 4, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    //circle in middle
    ctx.beginPath();
    ctx.arc(midX, midY, 4, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 1;
}

function configureCanvasContext() {
    canvas = document.getElementById('canvas');
    if (!canvas.getContext) return;

    //set canvas pixel numbers
    const canvasDiv = document.getElementById('canvas-div');
    canvas.setAttribute('width', canvasDiv.clientWidth);
    canvas.setAttribute('height', canvasDiv.clientHeight);

    // get the context
    ctx = canvas.getContext('2d');

    // set fill and stroke styles
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.font = '22px monospace';

    //load checkboxes
    enableDateTime = document.getElementById("checkDateTime").checked;
    enableNumbers = document.getElementById("checkNum").checked;
    minimalistic = document.getElementById("checkMinDesign").checked;


    //mid
    midX = canvas.width / 2;
    midY = canvas.height / 2;

    //make sure clock fits screen
    if (midX < midY) {
        clockRadius = 0.9 * midX;
    } else {
        clockRadius = 0.9 * midY;
    }
    hourPointerLength = 0.6 * clockRadius;
    minutePointerLength = 0.8 * clockRadius;
    secondPointerLength = 0.9 * clockRadius;
}

function drawStaticClockElements() {
    //draw circle
    ctx.beginPath();
    ctx.arc(midX, midY, clockRadius, 0, 2*Math.PI);
    ctx.stroke();

    //drawing numbers and lines
    if (enableNumbers)
    for (let i = 1; i <= 12; i++) {
        ctx.fillText(
            i, //getX(-i*...) for clockwise drawing
            getX(-i*Math.PI/6 + Math.PI/2, clockRadius + 30)-15, //+ 30 for spacing from the clock
            getY(i*Math.PI/6 + Math.PI/2, clockRadius + 30)+15 // +-15 for better alignment of numbers (centering)
        );
    }

    //line length for minute indicators
    let fiveMinLineLength = 60;
    let minLineLength = 30;

    for (let i = 1; i <= 60; i++) {
        if (i % 5 === 0) {
            ctx.beginPath();
            ctx.moveTo(getX(i*Math.PI/30, clockRadius-fiveMinLineLength), getY(i*Math.PI/30, clockRadius-fiveMinLineLength))
            ctx.lineTo(getX(i*Math.PI/30, clockRadius), getY(i*Math.PI/30, clockRadius))
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(getX(i*Math.PI/30, clockRadius-minLineLength), getY(i*Math.PI/30, clockRadius-minLineLength))
            ctx.lineTo(getX(i*Math.PI/30, clockRadius), getY(i*Math.PI/30, clockRadius))
            ctx.stroke();
        }
    }
}


/*
    UI functions
 */

function toggleMinimalistic() {
    minimalistic = !minimalistic;
}

function changeNumbers() {
    enableNumbers = !enableNumbers;
}

function changeDateTime() {
    enableDateTime = !enableDateTime;
}

/*
    supporting functions
 */

//get X coordinates relative to input angle and radius
function getX(angle, radius=clockRadius) {
    return (midX + Math.cos(angle) * radius);
}

//get Y coordinates relative to input angle and radius
function getY(angle, radius=clockRadius) {
    return (midY - Math.sin(angle) * radius);
}