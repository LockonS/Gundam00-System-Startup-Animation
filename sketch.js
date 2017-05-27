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
    var lineWidth = unit / 30;
    var halfLineWidth = lineWidth / 2;
    var textAlpha = 0.2;
    var frameCircle = 35;
    var doubleFrameCircle = frameCircle * 2;
    var startFrame = 0;
    var fullFrame = 50;
    this.upateCanvasSize = function () {
        // get updated window size
        centerX = windowWidth / 2;
        centerY = windowHeight / 2;
        maxWidth = Math.round(centerX / 2) * 2;
        unit = Math.round(maxWidth / (5 + ratio1 * 2));
        lineWidth = unit / 30;
        halfLineWidth = lineWidth / 2;
    }

    this.standByDisplay = function (ratio) {
        this.upateCanvasSize();
        if (ratio == undefined) {
            alphaRatio = 1;
        } else {
            alphaRatio = Math.pow(ratio, 3);
        }
        // center stroke box
        strokeCap(SQUARE);
        rectMode(CENTER);
        strokeWeight(1.6);
        noFill();
        stroke('rgba(222,222,222,' + 0.15 * alphaRatio + ')');
        rect(centerX, centerY, maxWidth, unit);
        // vertical stroke box 1
        rect(centerX - unit * ratio3, centerY, unit * ratio1, unit * ratio4);
        // vertical stroke box 2
        rect(centerX + unit * ratio3, centerY, unit * ratio1, unit * ratio4);
        // slim lines

        strokeWeight(1.6);
        rect(centerX, centerY - (unit * ratio5), unit * ratio3 * 2, 0);
        rect(centerX, centerY + (unit * ratio5), unit * ratio3 * 2, 0);

        // white lines
        strokeWeight(0.2);
        fill('rgba(222,222,222,' + alphaRatio + ')');
        stroke('rgba(222,222,222,' + alphaRatio + ')');
        // horizontal lines
        rect(centerX - unit * ratio3, centerY - unit * ratio5 + halfLineWidth, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY - unit * ratio5 + halfLineWidth, unit * ratio1, lineWidth);
        rect(centerX - unit * ratio3, centerY + unit * ratio5 - halfLineWidth, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY + unit * ratio5 - halfLineWidth, unit * ratio1, lineWidth);
        // vertical lines
        rect(centerX - maxWidth / 2 + halfLineWidth, centerY, lineWidth, unit);
        rect(centerX + maxWidth / 2 - halfLineWidth, centerY, lineWidth, unit);
    }
    this.standByTextDisplay = function (ratio) {
        this.upateCanvasSize();
        var textFontSize = maxWidth / (20 + ratio1 * 8);
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
        textSize(textFontSize);
        textAlign(CENTER);
        textFont("CelestialBeingFont");
        text("STANDBY MODE", centerX, centerY - unit / 8);
    }

    this.systemStart = function (transactionRatio) {
        this.upateCanvasSize();
        var heightShift1 = (halfLineWidth - unit * ratio5) * transactionRatio;
        var heightShift2 = (unit * ratio5) * transactionRatio;
        var widthShift1 = (maxWidth / 2 - lineWidth / 2) * transactionRatio;
        var horizontalLineLength = unit * ratio3 * 2;
        var grey = 222 * transactionRatio;
        var textSizeSmall = maxWidth / (40 + ratio1 * 16);
        var textHeightShift = unit * ratio5 + textSizeSmall;
        strokeCap(SQUARE);
        rectMode(CENTER);
        // horizontal lines
        strokeWeight(0.2);
        fill('rgba(222,222,222,' + transactionRatio + ')');
        stroke('rgba(222,222,222,' + transactionRatio + ')');
        rect(centerX - unit * ratio3, centerY + heightShift1, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY + heightShift1, unit * ratio1, lineWidth);
        rect(centerX - unit * ratio3, centerY - heightShift1, unit * ratio1, lineWidth);
        rect(centerX + unit * ratio3, centerY - heightShift1, unit * ratio1, lineWidth);

        // vertical lines
        rect(centerX - widthShift1, centerY, lineWidth, unit);
        rect(centerX + widthShift1, centerY, lineWidth, unit);
        rect(centerX - widthShift1 - lineWidth * 2, centerY, lineWidth * 3, lineWidth * 1.6);
        rect(centerX + widthShift1 + lineWidth * 2, centerY, lineWidth * 3, lineWidth * 1.6);
        rect(centerX - widthShift1 + lineWidth * 1.5, centerY - unit / 2 + lineWidth * 0.8, lineWidth * 2, lineWidth * 1.6);
        rect(centerX - widthShift1 + lineWidth * 1.5, centerY + unit / 2 - lineWidth * 0.8, lineWidth * 2, lineWidth * 1.6);
        rect(centerX + widthShift1 - lineWidth * 1.5, centerY - unit / 2 + lineWidth * 0.8, lineWidth * 2, lineWidth * 1.6);
        rect(centerX + widthShift1 - lineWidth * 1.5, centerY + unit / 2 - lineWidth * 0.8, lineWidth * 2, lineWidth * 1.6);

        // slim line
        noFill();
        strokeWeight(1.6);
        stroke('rgba(222,222,222,' + 0.15 * transactionRatio + ')');
        rect(centerX, centerY - heightShift2, horizontalLineLength, 0);
        rect(centerX, centerY + heightShift2, horizontalLineLength, 0);

        // finish transaction
        if (transactionRatio == 1) {
            starting = false;
            systemStart = true;
        }
    }

    this.controlText = function (transactionRatio, transactionFrame) {
        this.upateCanvasSize();
        var maskLength = unit * 0.32;
        var textSizeSmall = maxWidth / (40 + ratio1 * 16);
        var textHeightShift = unit * ratio5 + textSizeSmall;
        var textHeight = centerY + textHeightShift;
        var currentFrame = frameCount - this.startFrame;

        // text display
        // CRM ERS NORM OURD CNTL
        noStroke();
        fill('rgba(222, 222, 222, 1)');
        textSize(textSizeSmall);
        textAlign(CENTER);
        textFont("CelestialBeingFont");
        text("CRM", centerX - unit * ratio3, textHeight);
        text("ERS", centerX - unit * ratio3 / 2, textHeight);
        text("NORM", centerX, textHeight);
        text("OURD", centerX + unit * ratio3 / 2, textHeight);
        text("CNTL", centerX + unit * ratio3, textHeight);


        rectMode(CENTER);
        noStroke();
        fill('rgba(0, 0, 0, 1)');
        var step = Math.round(transactionFrame/5);
        var stepFrame = step + 2;
        if (currentFrame >= 0 && currentFrame < (step + 2)) {
            var coverRatio = currentFrame / stepFrame;
            this.textCover(centerX - unit * ratio3, textHeight, maskLength, textSizeSmall, coverRatio);
        }

        if (currentFrame >= step && currentFrame < (step * 2 + 2)) {
            var coverRatio = (currentFrame - step) / stepFrame;
            this.textCover(centerX - unit * ratio3 / 2, textHeight, maskLength, textSizeSmall, coverRatio);
        } else if (currentFrame < step) {
            this.textCover(centerX - unit * ratio3 / 2, textHeight, maskLength, textSizeSmall, 0);
        }

        if (currentFrame >= step * 2 && currentFrame < (step * 3 + 2)) {
            var coverRatio = (currentFrame - step * 2) / stepFrame;
            this.textCover(centerX, textHeight, maskLength, textSizeSmall, coverRatio);
        } else if (currentFrame < step * 2) {
            this.textCover(centerX, textHeight, maskLength, textSizeSmall, 0);
        }

        if (currentFrame >= step * 3 && currentFrame < (step * 4 + 2)) {
            var coverRatio = (currentFrame - step * 3) / stepFrame;
            this.textCover(centerX + unit * ratio3 / 2, textHeight, maskLength, textSizeSmall, coverRatio);
        } else if (currentFrame < step * 3) {
            this.textCover(centerX + unit * ratio3 / 2, textHeight, maskLength, textSizeSmall, 0);
        }

        if (currentFrame >= step * 4 && currentFrame <= transactionFrame) {
            var coverRatio = (currentFrame - step * 4) / stepFrame;
            this.textCover(centerX + unit * ratio3, textHeight, maskLength, textSizeSmall, coverRatio);
        } else if (currentFrame < step * 4) {
            this.textCover(centerX + unit * ratio3, textHeight, maskLength, textSizeSmall, 0);
        }


        // full cover
        // rect(centerX + maskLength * transactionRatio / 2, textHeight, maskLength * (1 - transactionRatio), textSizeSmall);
    }

    this.textCover = function (x, y, maskLength, height, coverRatio) {
        rect(x + maskLength * coverRatio / 2, y, maskLength * (1 - coverRatio), height);
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
                var ratio = (frameCount - this.startFrame) / 20;
                this.standByDisplay();
                this.standByTextDisplay(ratio);
            }
            // hide patterns on standby mode display
            if (this.standByTextStatus == false) {
                background(0);
                var transactionFrame = 50;
                var fadeDelayFrame = 20;
                if (this.startFrame == undefined) {
                    this.startFrame = frameCount;
                }
                var textDisplayRatio = (frameCount - this.startFrame) / transactionFrame;
                this.controlText(textDisplayRatio, transactionFrame);
                if ((frameCount - this.startFrame) <= fadeDelayFrame) {
                    this.standByDisplay(1);
                }
                if ((frameCount - this.startFrame) > fadeDelayFrame) {
                    var transactionRatio = (frameCount - this.startFrame - fadeDelayFrame) / (transactionFrame - fadeDelayFrame);
                    this.standByDisplay(1 - transactionRatio);
                    this.systemStart(transactionRatio, transactionFrame);
                }

            }
        } else {
            frameRate(30);
            this.controlText(1);
            this.systemStart(1);
            this.standByDisplay(0);
        }
    }
}
