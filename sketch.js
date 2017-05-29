var celestialFont, screen;

function preload() {
    celestialFont = loadFont("./fonts/Celestial-Being-Font-Patch.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log("windowWidth:" + windowWidth + ", windowHeight:" + windowHeight);
    screen = new Display();
    screen.init();
    background(0);
    frameRate(30);
    smooth();
}

function draw() {
    screen.display();
}

function windowResized() {
    console.log("Window resized: windowWidth:" + windowWidth + ", windowHeight:" + windowHeight);
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (screen.standByFlag == true) {
        screen.setStartFlag();
    }

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
    var ratio6 = 0.75;
    var ratio7 = ratio1 + 1.5;
    // adjust ratio to adjust ratio of canvas part
    var maxWidth = Math.round(centerX * 2 / 5) * 2;
    var unit = Math.round(maxWidth / (5 + ratio1 * 2));
    var lineWidth = unit / 40;
    var halfLineWidth = lineWidth / 2;
    var textAlpha = 0.2;
    var frameCircle = 35;
    var doubleFrameCircle = frameCircle * 2;
    var startFrame = 0;
    // delay frame counts

    var startUpTextDisplayFrame = 70;
    var flightDisplayDelayFrame = 20;

    // phase frame counts
    var standByBlinkFrame = 20;
    var phase1DelayFrame = 20;
    var frameDisplayDelay = 40;
    var windowDisplayFrame = 45;
    var phase1FullFrame = 50;
    var phase2FullFrame = 70;
    var phase2ReverseFullFrame = 40;
    var phase3FullFrame = 40;

    this.init = function () {
        this.standByFlag = true;
        this.startingFlag = false;
        this.transactionPhaseFlag1 = false;
        this.systemStartFlag = false;
    }

    this.setStartFlag = function () {
        // start animation by set start flag
        this.standByFlag = !this.standByFlag;
        this.startingFlag = !this.startingFlag;
    }

    this.updateCanvasSize = function () {
        // get updated window size after window resize
        centerX = windowWidth / 2;
        centerY = windowHeight / 2;
        maxWidth = Math.round(centerX * 2 / 5) * 2;
        unit = Math.round(maxWidth / (5 + ratio1 * 2));
        lineWidth = unit / 40;
        halfLineWidth = lineWidth / 2;
    }

    this.standByDisplay = function (transactionRatio) {
        var heightShift1 = unit * ratio5 - halfLineWidth;
        var width1 = unit * ratio1;
        var widthShift1 = unit * ratio3;
        var widthShift2 = maxWidth / 2 - halfLineWidth;
        if (transactionRatio == undefined) {
            alphaRatio = 1;
        } else {
            alphaRatio = Math.pow(transactionRatio, 3);
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
        rect(centerX - widthShift1, centerY - heightShift1, width1, lineWidth);
        rect(centerX + widthShift1, centerY - heightShift1, width1, lineWidth);
        rect(centerX - widthShift1, centerY + heightShift1, width1, lineWidth);
        rect(centerX + widthShift1, centerY + heightShift1, width1, lineWidth);
        // vertical lines
        rect(centerX - widthShift2, centerY, lineWidth, unit);
        rect(centerX + widthShift2, centerY, lineWidth, unit);
    }
    this.standByTextDisplay = function (transactionRatio) {
        // blinking STANDBY MODE text
        var textFontSize = maxWidth / (20 + ratio1 * 8);
        if (transactionRatio == undefined) {
            this.textAlpha = 0.3 + 0.2 * sin((frameCount % doubleFrameCircle - frameCircle) * PI / frameCircle);
        } else {
            if (this.fadeStartAlpha == undefined) {
                this.fadeStartAlpha = this.textAlpha;
            }
            this.textAlpha = this.fadeStartAlpha * (1 - sin(transactionRatio * PI / 2));
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

    this.systemStartAnimation = function (transactionRatio) {
        var heightShift1 = (halfLineWidth - unit * ratio5) * transactionRatio;
        var heightShift2 = (unit * ratio5) * transactionRatio;
        var heightShift3 = unit / 2 - lineWidth * 0.8;
        var widthShift1 = (maxWidth / 2 - lineWidth / 2) * transactionRatio;
        var widthShift2 = unit * ratio3;
        var widthShift3 = widthShift1 + lineWidth * 2;
        var widthShift4 = widthShift1 - lineWidth * 1.5;
        var horizontalLineLength = unit * ratio3 * 2;
        var grey = 222 * transactionRatio;
        var textSizeSmall = maxWidth / (40 + ratio1 * 16);
        var textHeightShift = unit * ratio5 + textSizeSmall;
        var width1 = lineWidth * 5;
        var width2 = lineWidth * 4;
        var width3 = unit * ratio1;
        var height1 = lineWidth * 1.6;
        strokeCap(SQUARE);
        rectMode(CENTER);
        // horizontal lines
        strokeWeight(0.2);
        fill('rgba(222,222,222,' + transactionRatio + ')');
        stroke('rgba(222,222,222,' + transactionRatio + ')');
        rect(centerX - widthShift2, centerY + heightShift1, width3, lineWidth);
        rect(centerX + widthShift2, centerY + heightShift1, width3, lineWidth);
        rect(centerX - widthShift2, centerY - heightShift1, width3, lineWidth);
        rect(centerX + widthShift2, centerY - heightShift1, width3, lineWidth);
        // vertical lines
        rect(centerX - widthShift1, centerY, lineWidth, unit);
        rect(centerX + widthShift1, centerY, lineWidth, unit);
        rect(centerX - widthShift3, centerY, width1, height1);
        rect(centerX + widthShift3, centerY, width1, height1);
        rect(centerX - widthShift4, centerY - heightShift3, width2, height1);
        rect(centerX - widthShift4, centerY + heightShift3, width2, height1);
        rect(centerX + widthShift4, centerY - heightShift3, width2, height1);
        rect(centerX + widthShift4, centerY + heightShift3, width2, height1);
        // slim line
        noFill();
        strokeWeight(1.6);
        stroke('rgba(222,222,222,' + 0.15 * transactionRatio + ')');
        rect(centerX, centerY - heightShift2, horizontalLineLength, 0);
        rect(centerX, centerY + heightShift2, horizontalLineLength, 0);
        // finish transaction
        if (transactionRatio == 1) {
            // this.startingFlag = false;
            this.phase1Flag = true;
            if (this.phase1FinishFrame == undefined) {
                this.phase1FinishFrame = frameCount;
            }
        }
    }

    this.controlTextDisplay = function (fullFrameCount) {
        var maskLength = 0;
        var textSizeSmall = maxWidth / (40 + ratio1 * 16);
        var textHeightShift = unit * ratio5 + textSizeSmall;
        var textHeight = centerY + textHeightShift;
        var currentFrame = frameCount - this.startFrame;
        var coverHeight = 0;
        // control text display
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
        // get width of a 5 character string 
        maskLength = textWidth('XXXXX');
        coverHeight = maskLength / 3;
        // text cover
        var step = Math.round(fullFrameCount / 5);
        var stepFrame = step + 2;
        if (currentFrame >= 0 && currentFrame < (step + 2)) {
            var coverRatio = currentFrame / stepFrame;
            this.textCover(centerX - unit * ratio3, textHeight, maskLength, coverHeight, coverRatio);
        }

        if (currentFrame >= step && currentFrame < (step * 2 + 2)) {
            var coverRatio = (currentFrame - step) / stepFrame;
            this.textCover(centerX - unit * ratio3 / 2, textHeight, maskLength, coverHeight, coverRatio);
        } else if (currentFrame < step) {
            this.textCover(centerX - unit * ratio3 / 2, textHeight, maskLength, coverHeight, 0);
        }

        if (currentFrame >= step * 2 && currentFrame < (step * 3 + 2)) {
            var coverRatio = (currentFrame - step * 2) / stepFrame;
            this.textCover(centerX, textHeight, maskLength, coverHeight, coverRatio);
        } else if (currentFrame < step * 2) {
            this.textCover(centerX, textHeight, maskLength, coverHeight, 0);
        }

        if (currentFrame >= step * 3 && currentFrame < (step * 4 + 2)) {
            var coverRatio = (currentFrame - step * 3) / stepFrame;
            this.textCover(centerX + unit * ratio3 / 2, textHeight, maskLength, coverHeight, coverRatio);
        } else if (currentFrame < step * 3) {
            this.textCover(centerX + unit * ratio3 / 2, textHeight, maskLength, coverHeight, 0);
        }

        if (currentFrame >= step * 4 && currentFrame <= fullFrameCount) {
            var coverRatio = (currentFrame - step * 4) / stepFrame;
            this.textCover(centerX + unit * ratio3, textHeight, maskLength, coverHeight, coverRatio);
        } else if (currentFrame < step * 4) {
            this.textCover(centerX + unit * ratio3, textHeight, maskLength, coverHeight, 0);
        }
    }

    this.windowFrameDisplay = function (phaseFrameCount, fullFrameCount) {
        var transRatio = phaseFrameCount / fullFrameCount;
        if (transRatio >= 1) {
            transRatio = 1;
            if (this.windowFrameStatus == undefined) {
                this.windowFrameStatus = true;
            }
        }

        var lineUnit = 1.5 * unit;
        var lineFullUnit = 1.8 * unit;
        var lineVar = 1.3 * unit;

        var widthShift1 = unit * ratio7;
        var heightShift1 = unit * ratio5;

        var widthShift2 = unit * 1.5;

        var widthShift6 = widthShift1 + 1.2 * lineUnit;
        var heightShift8 = heightShift1 + lineUnit;

        var widthShift4 = widthShift1 + 1.2 * lineVar;
        var heightShift4 = heightShift1 + lineVar;

        var heightShift2 = unit * 0.5;
        var widthShift3 = maxWidth / 2 - halfLineWidth;

        var widthShift7 = widthShift2 + 0.6 * lineUnit;
        var heightShift3 = heightShift1 + 1.2 * lineUnit;

        var widthShift5 = widthShift3 + 1.4 * lineVar;
        var heightShift5 = heightShift2 + 0.7 * lineVar;

        var widthShift8 = widthShift3 + 1.4 * lineUnit;
        var heightShift7 = heightShift2 + 0.7 * lineUnit;

        var endRatio = 0.9;
        var outerFrameColor = 'rgba(222,222,222,' + transRatio + ')';
        var outerFrameStrokeWeight = unit / 15;

        if (phaseFrameCount * 2 > fullFrameCount) {
            stroke('rgba(100,100,100,' + 0.4 * transRatio + ')');
            strokeWeight(1.0);
            line(centerX - widthShift1, centerY - heightShift1, centerX - widthShift6, centerY - heightShift8);
            line(centerX + widthShift1, centerY - heightShift1, centerX + widthShift6, centerY - heightShift8);
            line(centerX - widthShift1, centerY + heightShift1, centerX - widthShift6, centerY + heightShift8);
            line(centerX + widthShift1, centerY + heightShift1, centerX + widthShift6, centerY + heightShift8);

            line(centerX - widthShift2, centerY - heightShift1, centerX - widthShift7, centerY - heightShift3);
            line(centerX + widthShift2, centerY - heightShift1, centerX + widthShift7, centerY - heightShift3);

            line(centerX - widthShift3, centerY - heightShift2, centerX - widthShift8, centerY - heightShift7);
            line(centerX + widthShift3, centerY - heightShift2, centerX + widthShift8, centerY - heightShift7);
            line(centerX - widthShift3, centerY + heightShift2, centerX - widthShift8, centerY + heightShift7);
            line(centerX + widthShift3, centerY + heightShift2, centerX + widthShift8, centerY + heightShift7);

            // connect lines
            line(centerX - widthShift4, centerY - heightShift4, centerX - widthShift5, centerY - heightShift5);
            line(centerX + widthShift4, centerY - heightShift4, centerX + widthShift5, centerY - heightShift5);
            line(centerX - widthShift4, centerY + heightShift4, centerX - widthShift5, centerY + heightShift5);
            line(centerX + widthShift4, centerY + heightShift4, centerX + widthShift5, centerY + heightShift5);
        }

        // outer frame
        noFill();
        stroke(outerFrameColor);
        strokeWeight(outerFrameStrokeWeight);
        strokeJoin(MITER);

        var lineRatio1 = 0.85 + transRatio * 0.05;
        var lineRatio2 = 0.95 + transRatio * 0.05;

        beginShape();
        vertex(centerX - widthShift1 - 1.2 * lineFullUnit * lineRatio1, centerY - heightShift1 - lineFullUnit * lineRatio1);
        vertex(centerX - widthShift1 - 1.2 * lineFullUnit * lineRatio2, centerY - heightShift1 - lineFullUnit * lineRatio2);
        vertex(centerX - widthShift3 - 1.4 * lineFullUnit * lineRatio2, centerY - heightShift2 - 0.7 * lineFullUnit * lineRatio2);
        vertex(centerX - widthShift3 - 1.4 * lineFullUnit * lineRatio1, centerY - heightShift2 - 0.7 * lineFullUnit * lineRatio1);
        endShape();

        beginShape();
        vertex(centerX + widthShift1 + 1.2 * lineFullUnit * lineRatio1, centerY - heightShift1 - lineFullUnit * lineRatio1);
        vertex(centerX + widthShift1 + 1.2 * lineFullUnit * lineRatio2, centerY - heightShift1 - lineFullUnit * lineRatio2);
        vertex(centerX + widthShift3 + 1.4 * lineFullUnit * lineRatio2, centerY - heightShift2 - 0.7 * lineFullUnit * lineRatio2);
        vertex(centerX + widthShift3 + 1.4 * lineFullUnit * lineRatio1, centerY - heightShift2 - 0.7 * lineFullUnit * lineRatio1);
        endShape();

        beginShape();
        vertex(centerX + widthShift1 + 1.2 * lineFullUnit * lineRatio1, centerY + heightShift1 + lineFullUnit * lineRatio1);
        vertex(centerX + widthShift1 + 1.2 * lineFullUnit * lineRatio2, centerY + heightShift1 + lineFullUnit * lineRatio2);
        vertex(centerX + widthShift3 + 1.4 * lineFullUnit * lineRatio2, centerY + heightShift2 + 0.7 * lineFullUnit * lineRatio2);
        vertex(centerX + widthShift3 + 1.4 * lineFullUnit * lineRatio1, centerY + heightShift2 + 0.7 * lineFullUnit * lineRatio1);
        endShape();

        beginShape();
        vertex(centerX - widthShift1 - 1.2 * lineFullUnit * lineRatio1, centerY + heightShift1 + lineFullUnit * lineRatio1);
        vertex(centerX - widthShift1 - 1.2 * lineFullUnit * lineRatio2, centerY + heightShift1 + lineFullUnit * lineRatio2);
        vertex(centerX - widthShift3 - 1.4 * lineFullUnit * lineRatio2, centerY + heightShift2 + 0.7 * lineFullUnit * lineRatio2 * lineRatio2);
        vertex(centerX - widthShift3 - 1.4 * lineFullUnit * lineRatio1, centerY + heightShift2 + 0.7 * lineFullUnit * lineRatio1);
        endShape();

        beginShape();
        vertex(centerX - widthShift2 - 0.6 * lineFullUnit * lineRatio1, centerY - heightShift1 - 1.2 * lineFullUnit * lineRatio1);
        vertex(centerX - widthShift2 - 0.6 * lineFullUnit * lineRatio2, centerY - heightShift1 - 1.2 * lineFullUnit * lineRatio2);
        vertex(centerX + widthShift2 + 0.6 * lineFullUnit * lineRatio2, centerY - heightShift1 - 1.2 * lineFullUnit * lineRatio2);
        vertex(centerX + widthShift2 + 0.6 * lineFullUnit * lineRatio1, centerY - heightShift1 - 1.2 * lineFullUnit * lineRatio1);
        endShape();

        noStroke();
        fill(outerFrameColor);
        rect(centerX, centerY - heightShift1 - 1.2 * lineFullUnit * lineRatio2 + lineFullUnit * lineRatio2 * 0.1 / 2, outerFrameStrokeWeight / 3, lineFullUnit * lineRatio2 * 0.1);
    }

    this.osTitleDisplay = function (phaseFrameCount, fullFrameCount, type) {
        if (phaseFrameCount == fullFrameCount + startUpTextDisplayFrame) {
            this.phase2Flag = true;
            if (this.phase2FinishFrame == undefined) {
                this.phase2FinishFrame = frameCount;
            }
        }
        // prevent shape change after transaction animation finish
        if (phaseFrameCount > fullFrameCount) {
            phaseFrameCount = fullFrameCount;
        }
        var step = fullFrameCount / 5;
        var ratio;
        var brightRatio;
        var heightRatio;
        var width1 = 4 * lineWidth;
        var height1 = 0.6 * lineWidth;
        var width2 = 1.5 * lineWidth;
        var height2 = 4 * lineWidth;
        var halfBlockWidth = 0.7 * unit;
        var halfBlockHeight = 0.3 * unit;
        var baseY = centerY - unit * ratio6;
        var innerBlockWidth = 1 * unit;
        // 0.3 is the vertical adjust for screen effect
        var heightShift1 = (height2 - height1) / 2 + 0.25;
        // 0.2 is the horizontal adjust for screen effect
        var widthShift1 = (width1 - width2) / 2 + 0.2; //x2 = x1 -width1/2 +width2/2
        // text for IIOS
        var titleTransRatio = 0;
        var baseTextFontSize = maxWidth / (20 + ratio1 * 8);
        var textFontSize1 = baseTextFontSize * 2.5;
        var textFontSize2 = baseTextFontSize * 1.7;
        var iiosTextCoverRatio = 0;
        var startUpTransRatio = 0;
        var smallTextCoverRatio = 0;
        var iiosString = "";
        var smallText = "";

        if (type != undefined && type == 'static') {
            brightRatio = 1;
            heightRatio = 1;
            titleTransRatio = 1;
            iiosTextCoverRatio = 1;
            startUpTransRatio = 1;
            smallTextCoverRatio = 1;
        } else {
            if (phaseFrameCount <= step) {
                brightRatio = phaseFrameCount / step;
            } else if (phaseFrameCount > step && phaseFrameCount <= step * 2) {
                brightRatio = 1;
                heightRatio = phaseFrameCount / step - 1;
                iiosTextCoverRatio = (phaseFrameCount / step - 1) / 3;
            } else if (phaseFrameCount > step * 2 && phaseFrameCount <= step * 3) {
                brightRatio = 1;
                heightRatio = 1;
                titleTransRatio = phaseFrameCount / step - 2;
                iiosTextCoverRatio = (phaseFrameCount / step - 1) / 3;
            } else if (phaseFrameCount > step * 3 && phaseFrameCount <= step * 4) {
                brightRatio = 1;
                heightRatio = 1;
                titleTransRatio = 1;
                smallTextCoverRatio = phaseFrameCount / step - 3;
                iiosTextCoverRatio = (phaseFrameCount / step - 1) / 3;
            } else if (phaseFrameCount > step * 4 && phaseFrameCount <= step * 5) {
                brightRatio = 1;
                heightRatio = 1;
                titleTransRatio = 1;
                iiosTextCoverRatio = 1;
                smallTextCoverRatio = 1;
                startUpTransRatio = phaseFrameCount / step - 4;
            } else {
                brightRatio = 1;
                heightRatio = 1;
                titleTransRatio = 1;
                iiosTextCoverRatio = 1;
                smallTextCoverRatio = 1;
                startUpTransRatio = 1;
            }
        }

        noStroke();
        fill('rgba(222,222,222,' + brightRatio + ')');
        rect(centerX, baseY, innerBlockWidth * brightRatio, lineWidth + (0.3 * unit - lineWidth) * heightRatio);

        rect(centerX - halfBlockWidth * brightRatio, baseY + halfBlockHeight, width1, height1);
        rect(centerX - (halfBlockWidth + widthShift1) * brightRatio, baseY + halfBlockHeight - heightShift1, width2, height2);

        rect(centerX + halfBlockWidth * brightRatio, baseY + halfBlockHeight, width1, height1);
        rect(centerX + (halfBlockWidth + widthShift1) * brightRatio, baseY + halfBlockHeight - heightShift1, width2, height2);

        rect(centerX - halfBlockWidth * brightRatio, baseY - halfBlockHeight, width1, height1);
        rect(centerX - (halfBlockWidth + widthShift1) * brightRatio, baseY - halfBlockHeight + heightShift1, width2, height2);

        rect(centerX + halfBlockWidth * brightRatio, baseY - halfBlockHeight, width1, height1);
        rect(centerX + (halfBlockWidth + widthShift1) * brightRatio, baseY - halfBlockHeight + heightShift1, width2, height2);

        if (titleTransRatio > 0) {
            var titleWidthShift1 = baseTextFontSize / 2;
            var titleHeightShift2 = textFontSize1 / 6;
            var titleHeightShift1 = baseTextFontSize / 10;
            fill('rgba(0,0,0,' + titleTransRatio + ')');
            textAlign(CENTER);
            textSize(textFontSize1);
            textFont("CelestialBeingFont");
            text("II", centerX - titleWidthShift1, baseY + titleHeightShift2);
            textSize(textFontSize2);
            text("O", centerX + titleWidthShift1, baseY + titleHeightShift1);
            text("S", centerX + titleWidthShift1 + textFontSize2 / 5, baseY + titleHeightShift1 + textFontSize2 / 4);
        }

        if (smallTextCoverRatio > 0) {
            var smallTextFontSize = 1;
            noStroke();
            textAlign(CENTER);
            textSize(smallTextFontSize);
            textFont("CelestialBeingFont");
            if (type != undefined && type == 'reverse') {
                fill('rgba(222,222,222,' + smallTextCoverRatio + ')');
                // only able to be identify word GUNDAM
                smallText = "GUNDAM";
                text(smallText, centerX, baseY + 0.25 * unit);
            } else {
                fill('rgba(222,222,222,1)');
                // only able to be identify word GUNDAM
                smallText = "GUNDAM";
                text(smallText, centerX, baseY + 0.25 * unit);
                this.textCover(centerX, baseY + 0.25 * unit, textWidth(smallText), unit * 0.2, smallTextCoverRatio);
            }
        }

        if (iiosTextCoverRatio > 0) {
            textAlign(CENTER);
            textSize(baseTextFontSize);
            textFont("CelestialBeingFont");
            iiosString = "INDIVIDUAL  INFORMATION  ATTESTATION  SYSTEM";
            if (type != undefined && type == 'reverse') {
                // while hide title display part in an reverse frame order
                fill('rgba(222, 222, 222, ' + startUpTransRatio + ')');
                text(iiosString, centerX, centerY - unit / 5);
            } else {
                // normally startup frame transaction
                fill('rgba(222,222,222,1)');
                text(iiosString, centerX, centerY - unit / 5);
                this.textCover(centerX, centerY - unit / 5, textWidth(iiosString), baseTextFontSize, iiosTextCoverRatio);
                fill('rgba(222, 222, 222, ' + startUpTransRatio + ')');
            }
            text("START UP", centerX, centerY - unit / 5 + baseTextFontSize);
        }
    }

    this.pitchLadderDisplay = function (transActionRatio) {
        var lineFullUnit = 1.8 * unit;
        var halfScaleWidth = unit * 2.4;
        var halfScaleHeight = unit * ratio5 + 1.09 * lineFullUnit;
        var step = unit;
        var scaleMarkWidth = unit * 0.3;
        var scaleMarkWeight = lineWidth * 0.6;
        var bevelLength = step * 0.05;
        var widthShift1 = halfScaleWidth + scaleMarkWidth;
        noFill();
        stroke('rgba(222, 222, 222, ' + transActionRatio + ')');
        strokeWeight(scaleMarkWeight);
        strokeJoin(MITER);
        beginShape();
        vertex(centerX - halfScaleWidth, centerY);
        vertex(centerX - halfScaleWidth - scaleMarkWidth, centerY);
        endShape();

        beginShape();
        vertex(centerX + halfScaleWidth, centerY);
        vertex(centerX + halfScaleWidth + scaleMarkWidth, centerY);
        endShape();

        for (var i = 1; i < 3; i++) {
            beginShape();
            vertex(centerX - halfScaleWidth, centerY - step * i);
            vertex(centerX - widthShift1, centerY - step * i);
            vertex(centerX - widthShift1, centerY - step * i + bevelLength);
            vertex(centerX - widthShift1 + scaleMarkWeight, centerY - step * i + bevelLength);
            vertex(centerX - widthShift1 + scaleMarkWeight, centerY - step * i);
            endShape();

            beginShape();
            vertex(centerX + halfScaleWidth, centerY - step * i);
            vertex(centerX + widthShift1, centerY - step * i);
            vertex(centerX + widthShift1, centerY - step * i + bevelLength);
            vertex(centerX + widthShift1 - scaleMarkWeight, centerY - step * i + bevelLength);
            vertex(centerX + widthShift1 - scaleMarkWeight, centerY - step * i);
            endShape();

            beginShape();
            vertex(centerX - halfScaleWidth, centerY + step * i);
            vertex(centerX - widthShift1, centerY + step * i);
            vertex(centerX - widthShift1, centerY + step * i - bevelLength);
            vertex(centerX - widthShift1 + scaleMarkWeight, centerY + step * i - bevelLength);
            vertex(centerX - widthShift1 + scaleMarkWeight, centerY + step * i);
            endShape();

            beginShape();
            vertex(centerX + halfScaleWidth, centerY + step * i);
            vertex(centerX + widthShift1, centerY + step * i);
            vertex(centerX + widthShift1, centerY + step * i - bevelLength);
            vertex(centerX + widthShift1 - scaleMarkWeight, centerY + step * i - bevelLength);
            vertex(centerX + widthShift1 - scaleMarkWeight, centerY + step * i);
            endShape();
        }
    }

    this.flightPathMarkerDisplay = function (transActionRatio) {
        var markerHeight = unit * 0.14;
        var markerWidth = unit * 0.36;
        var width1 = unit * 0.06;
        var verticalStrokeWeight = lineWidth * 1.2;
        var horizontalStrokeWeight = lineWidth * 1.2;
        var widthShift1 = markerWidth / 2 - verticalStrokeWeight / 2;
        var heightShift1 = markerHeight / 2 - horizontalStrokeWeight / 2;
        noFill();
        stroke('rgba(222, 222, 222, ' + transActionRatio + ')');
        strokeWeight(verticalStrokeWeight);
        strokeJoin(MITER);
        // left half marker
        beginShape();
        vertex(centerX - widthShift1 + width1, centerY - heightShift1);
        vertex(centerX - widthShift1, centerY - heightShift1);
        vertex(centerX - widthShift1, centerY + heightShift1);
        vertex(centerX - widthShift1 + width1, centerY + heightShift1);
        endShape();
        // right half marker
        beginShape();
        vertex(centerX + widthShift1 - width1, centerY - heightShift1);
        vertex(centerX + widthShift1, centerY - heightShift1);
        vertex(centerX + widthShift1, centerY + heightShift1);
        vertex(centerX + widthShift1 - width1, centerY + heightShift1);
        endShape();
    }

    this.headingDisplay = function (transActionRatio) {
        var lineFullUnit = 1.8 * unit;
        var height = centerY - unit * ratio5 - 1.09 * lineFullUnit;
        var lineHeight = lineWidth * 5;
        var halfScaleWidth = unit * 2.4;
        var step = halfScaleWidth / 12;
        var textFontSize = unit / 8;
        var textHeight = height + textFontSize * 1.2;
        noStroke();
        rectMode(CENTER);
        fill('rgba(222, 222, 222, ' + transActionRatio + ')');
        rect(centerX, height, lineWidth * 2, lineHeight);
        for (var i = 0; i < 13; i++) {
            rect(centerX - i * step, height, lineWidth * 2, lineHeight);
            rect(centerX + i * step, height, lineWidth * 2, lineHeight);
        }
        textSize(textFontSize);
        textAlign(CENTER);
        textFont("CelestialBeingFont");
        text('35', centerX - 10 * step, textHeight);
        text('36', centerX - 5 * step, textHeight);
        text('01', centerX, textHeight);
        text('02', centerX + 5 * step, textHeight);
        text('03', centerX + 10 * step, textHeight);
    }

    this.flightDisplay = function (currentFrameCount, fullFrameCount) {
        var transActionRatio = currentFrameCount / fullFrameCount;
        if (transActionRatio >= 1) {
            transActionRatio = 1;
            if (this.phase4Flag == undefined) {
                this.phase4Flag = true;
                this.startingFlag = false;
            }
        }

        this.pitchLadderDisplay(transActionRatio);
        this.flightPathMarkerDisplay(transActionRatio);
        this.headingDisplay(transActionRatio);
    }

    this.textCover = function (x, y, maskLength, height, coverRatio) {
        rectMode(CENTER);
        fill('rgba(0, 0, 0, 1)');
        rect(x + maskLength * coverRatio / 2, y, maskLength * (1 - coverRatio), height);
    }

    // add this function into draw() funciton
    this.display = function () {
        background(0);
        this.updateCanvasSize();
        if (this.standByFlag) {
            frameRate(30);
            this.standByDisplay();
            this.standByTextDisplay();
        } else if (this.startingFlag) {
            frameRate(60);
            // set transaction start frame
            if (this.startFrame == undefined) {
                this.startFrame = frameCount;
            }
            // hide STANDBY MODE text
            if (this.standByTextStatus == undefined) {
                var transactionRatio = (frameCount - this.startFrame) / standByBlinkFrame;
                this.standByDisplay();
                this.standByTextDisplay(transactionRatio);
            }
            // start transaction
            if (this.standByTextStatus == false) {
                background(0);
                // set delay time between fade in text and screen transaction 

                if (this.startFrame == undefined) {
                    this.startFrame = frameCount;
                }
                // display control texts
                this.controlTextDisplay(phase1FullFrame);
                // start transaction animation
                if ((frameCount - this.startFrame) <= phase1DelayFrame) {
                    this.standByDisplay(1);
                } else if ((frameCount - this.startFrame) > phase1DelayFrame) {
                    var transactionRatio = (frameCount - this.startFrame - phase1DelayFrame) / (phase1FullFrame - phase1DelayFrame);
                    // prevent shape change after transaction animation finish
                    if (transactionRatio >= 1) {
                        transactionRatio = 1;
                    }
                    this.standByDisplay(1 - transactionRatio);
                    this.systemStartAnimation(transactionRatio, phase1FullFrame);
                }
                // fade in of display window frames 
                if ((frameCount - this.startFrame) >= frameDisplayDelay) {
                    this.windowFrameDisplay(frameCount - frameDisplayDelay - this.startFrame, windowDisplayFrame);
                }
                // display iios title after transaction animation phase 1 finished
                if (this.phase1Flag && this.phase2Flag != true) {
                    var phase2FrameCount = frameCount - this.phase1FinishFrame;
                    this.osTitleDisplay(phase2FrameCount, phase2FullFrame);
                }
                if (this.phase2Flag && frameCount >= this.phase2FinishFrame) {
                    var phase3FrameCount = frameCount - this.phase2FinishFrame;
                    if (phase3FrameCount >= phase2ReverseFullFrame) {
                        phase3FrameCount = phase2ReverseFullFrame;
                        if (this.phase3Flag == undefined) {
                            this.phase3Flag = true;
                            this.phase3FinishFrame = frameCount;
                        }
                    }
                    this.osTitleDisplay((phase2ReverseFullFrame - phase3FrameCount), phase2ReverseFullFrame, 'reverse');
                }
                if (this.phase3Flag && (frameCount - this.phase3FinishFrame) >= flightDisplayDelayFrame) {
                    var phase4FrameCount = frameCount - this.phase3FinishFrame - flightDisplayDelayFrame;
                    this.flightDisplay(phase4FrameCount, phase3FullFrame);
                }
            }
        } else {
            frameRate(30);
            this.controlTextDisplay(1);
            this.systemStartAnimation(1);
            this.flightDisplay(1, 1);
            this.windowFrameDisplay(1, 1);
        }
    }
}
