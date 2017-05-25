var celestialFont, screen;
var standByStatus = true;
var starting = false;
var systemStart = false;

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
    screen.display();
    //    screen.systemStart(1);
}

function windowResized() {
    console.log("Window resized: windowWidth:" + windowWidth + ", windowHeight:" + windowHeight);
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    // alert("mousePressed");
    standByStatus = !standByStatus;
    starting = !starting;
    systemStart = !systemStart;
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
    var startFrame = 0;
    var fullFrame = 50;

    this.standByDisplay = function (ratio) {
        if (ratio == undefined) {
            alphaRatio = 1;
        } else {
            alphaRatio = ratio;
        }
        // center stroke box
        strokeCap(SQUARE);
        rectMode(CENTER);
        strokeWeight(2.4);
        noFill();
        stroke('rgba(255,255,255,' + 0.1 * alphaRatio + ')');
        rect(centerX, centerY, maxWidth, unit);
        // vertical stroke box 1
        rect(centerX - unit * ratio3, centerY, unit * ratio1, unit * ratio4);
        // vertical stroke box 2
        rect(centerX + unit * ratio3, centerY, unit * ratio1, unit * ratio4);
        // white lines
        strokeWeight(0.2);
        fill('rgba(222,222,222,' + alphaRatio + ')');
        stroke('rgba(222,222,222,' + alphaRatio + ')');
        // horizontal lines
        rect(centerX - unit * ratio3, centerY - unit * ratio5 + widthShift, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY - unit * ratio5 + widthShift, unit * ratio1, lineWidth);
        rect(centerX - unit * ratio3, centerY + unit * ratio5 - widthShift, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY + unit * ratio5 - widthShift, unit * ratio1, lineWidth);
        // vertical lines
        rect(centerX - maxWidth / 2 + widthShift, centerY, lineWidth, unit);
        rect(centerX + maxWidth / 2 - widthShift, centerY, lineWidth, unit);
    }
    this.standByTextDisplay = function (ratio) {
        if (ratio == undefined) {
            this.textAlpha = 0.3 + 0.2 * sin((frameCount % doubleFrameCircle - frameCircle) * PI / frameCircle);
        } else {
            if (this.fadeStartAlpha == undefined) {
                this.fadeStartAlpha = this.textAlpha;
            }
            this.textAlpha = this.fadeStartAlpha * (1 - sin(ratio * PI / 2));
            if (this.textAlpha == 0) {
                // reset startFrame and fadeStartAlpha
                this.fadeStartAlpha = undefined;
                this.startFrame = undefined;
                this.standByTextStatus = false;
            }
        }
        // STANDBY MODE text
        noStroke();
        fill('rgba(255,255,255,' + this.textAlpha + ')');
        textSize(unit / 4);
        textAlign(CENTER);
        textFont("CelestialBeingFont");
        text("STANDBY MODE", centerX, centerY - unit / 8);
    }

    this.systemStart = function (transactionRatio) {
        var heightShift1 = (widthShift - unit * ratio5) * transactionRatio;
        var heightShift2 = (unit * ratio5) * transactionRatio;
        var widthShift1 = (maxWidth / 2) * transactionRatio;
        var horizontalLineLength = unit * ratio3 * 2;
        var grey = 222 * transactionRatio;
        strokeCap(SQUARE);
        rectMode(CENTER);
        // horizontal lines
        strokeWeight(0.2);
        fill(grey, grey, grey);
        stroke(grey, grey, grey);
        rect(centerX - unit * ratio3, centerY + heightShift1, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY + heightShift1, unit * ratio1, lineWidth);
        rect(centerX - unit * ratio3, centerY - heightShift1, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY - heightShift1, unit * ratio1, lineWidth);

        // vertical lines
        rect(centerX - widthShift1, centerY, lineWidth, unit);
        rect(centerX + widthShift1, centerY, lineWidth, unit);
        rect(centerX - widthShift1 - lineWidth * 2, centerY, lineWidth * 3, lineWidth);
        rect(centerX + widthShift1 + lineWidth * 2, centerY, lineWidth * 3, lineWidth);
        rect(centerX - widthShift1 + lineWidth * 1, centerY - unit / 2 + lineWidth / 2, lineWidth * 3, lineWidth);
        rect(centerX - widthShift1 + lineWidth * 1, centerY + unit / 2 - lineWidth / 2, lineWidth * 3, lineWidth);
        rect(centerX + widthShift1 - lineWidth * 1, centerY - unit / 2 + lineWidth / 2, lineWidth * 3, lineWidth);
        rect(centerX + widthShift1 - lineWidth * 1, centerY + unit / 2 - lineWidth / 2, lineWidth * 3, lineWidth);

        // slim line
        noFill();
        strokeWeight(2.4);
        stroke('rgba(222,222,222,' + 0.1 * transactionRatio + ')');
        rect(centerX, centerY - heightShift2, horizontalLineLength, 0.6);
        rect(centerX, centerY + heightShift2, horizontalLineLength, 0.6);

        // finish transaction
        if (transactionRatio == 1) {
            starting = false;
            systemStart = true;
        }
    }
    this.systemStartTransaction = function () {
        var transactionRatio = (frameCount % fullFrame) / fullFrame;
        this.systemStart(transactionRatio);
        this.standByDisplay(1 - transactionRatio);
    }

    // shall be moved to draw() function
    this.display = function () {
        if (standByStatus) {
            this.standByDisplay();
            this.standByTextDisplay();
        } else if (starting) {
            frameRate(60);
            // set transaction start frame
            if (this.startFrame == undefined) {
                this.startFrame = frameCount;
            }
            // hide STANDBY MODE text
            if (this.standByTextStatus == undefined) {
                var ratio = (frameCount - this.startFrame) / 50;
                this.standByDisplay();
                this.standByTextDisplay(ratio);
            }
            // hide patterns on standby mode display
            if (this.standByTextStatus == false) {
                if (this.startFrame == undefined) {
                    this.startFrame = frameCount;
                }
                var transactionRatio = (frameCount - this.startFrame) / 30;
                this.systemStart(transactionRatio);
                this.standByDisplay(1 - transactionRatio);
            }
        } else {
            frameRate(30);
            this.systemStart(1);
            this.standByDisplay(0);
        }
    }
}
