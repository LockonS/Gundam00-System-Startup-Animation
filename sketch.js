var celestialFont, screen;
var standByStatus = true;

function preload() {
    celestialFont = loadFont("./fonts/Celestial-Being-Font-Patch.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log("windowWidth:" + windowWidth + ", windowHeight:" + windowHeight);
    screen = new Display();
    background(0);
    frameRate(30);
}

function draw() {
    background(0);
    screen.standBy();
}

function windowResized() {
    console.log("Window resized: windowWidth:" + windowWidth + ", windowHeight:" + windowHeight);
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    //    alert("mousePressed");
    return false;
}

function mouseReleased() {
    // alert("mouseReleased");
    return false;
}

function delay(milliseconds) {
    var start = millis();
    for (var i = 0; i < 1e7; i++) {
        if ((millis() - start) > milliseconds) {
            break;
        }
    }
}

function Display() {
    var centerX = windowWidth / 2;
    var centerY = windowHeight / 2;
    var ratio1 = 0.64;
    var ratio2 = 0.95;
    var ratio3 = 1.5 + ratio1 / 2;
    var ratio4 = 1 + ratio2 * 2;
    var ratio5 = 0.5 + ratio2;
    var maxWidth = Math.round(centerX / 2) * 2;
    var unit = Math.round(maxWidth / (5 + ratio1 * 2));
    var lineWidth = unit / 18;
    var widthShift = lineWidth / 2;
    var textAlpha = 0.2;
    var frameCircle = 35;
    var doubleFrameCircle = frameCircle * 2;

    this.standByDisplay = function (frameCount) {
        // center stroke box
        strokeCap(SQUARE);
        rectMode(CENTER);
        strokeWeight(2.4);
        noFill();
        stroke('rgba(255,255,255,0.10)');
        rect(centerX, centerY, maxWidth, unit);
        // vertical stroke box 1
        rect(centerX - unit * ratio3, centerY, unit * ratio1, unit * ratio4);
        // vertical stroke box 2
        rect(centerX + unit * ratio3, centerY, unit * ratio1, unit * ratio4);
        // white lines
        strokeWeight(0.2);
        fill('rgba(222,222,222,1)');
        stroke('rgba(222,222,222,1)');
        // horizontal lines
        rect(centerX - unit * ratio3, centerY - unit * ratio5 + widthShift, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY - unit * ratio5 + widthShift, unit * ratio1, lineWidth);
        rect(centerX - unit * ratio3, centerY + unit * ratio5 - widthShift, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY + unit * ratio5 - widthShift, unit * ratio1, lineWidth);
        // vertical lines
        rect(centerX - maxWidth / 2 + widthShift, centerY, lineWidth, unit);
        rect(centerX + maxWidth / 2 - widthShift, centerY, lineWidth, unit);
        this.blinkTextDisplay(frameCount);
    }
    this.blinkTextDisplay = function (frameCount) {
        console.log('blink text');
        // STANDBY MODE text
        textAlpha = 0.25 + 0.15 * sin((frameCount % doubleFrameCircle - frameCircle) * PI / frameCircle);
        // console.log(textAlpha);
        noStroke();
        fill('rgba(255,255,255,' + textAlpha + ')');
        textSize(unit / 4);
        textAlign(CENTER);
        textFont("CelestialBeingFont");
        text("STANDBY MODE", centerX, centerY - unit / 8);
    }

    this.standBy = function () {
        if (standByStatus) {
            this.standByDisplay(frameCount);
        } else {

        }
    }
}
