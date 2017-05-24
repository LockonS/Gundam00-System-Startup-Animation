var celestialFont;
function preload() {
   celestialFont = loadFont("./fonts/Celestial-Being-Font-Patch.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log("displayWidth:" + displayWidth + ", displayHeight:" + displayHeight);
    background(0);
}

function draw() {
    background(0);
    standByDisplay(windowWidth/2,windowHeight/2);
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
    //    alert("mouseReleased");
    return false;
}

function standByDisplay(x,y) {
    var centerX = x;
    var centerY = y;
    var ratio1 = 0.64;
    var ratio2 = 0.95;
    var maxWidth = Math.round(centerX/2)*2;
    var unit = Math.round(maxWidth/(5+ratio1*2));
    var lineWidth=Math.round(unit/18);
//    console.log("unit:"+unit+" px");
    
    strokeCap(SQUARE);
    stroke(255);
    // center stroke box
    rectMode(CENTER);
    strokeWeight(2.4);
    noFill();
    stroke('rgba(255,255,255,0.10)');
    rect(centerX, centerY, maxWidth, unit);
    // vertical stroke box 1
    rect(centerX-unit*(1.5+ratio1/2), centerY, unit*ratio1, unit*(1+ratio2*2));
    // vertical stroke box 2
    rect(centerX+unit*(1.5+ratio1/2), centerY, unit*ratio1, unit*(1+ratio2*2));
    // white lines
    strokeWeight(0.2);
    fill('rgba(222,222,222,1)');
    stroke('rgba(222,222,222,1)');
    // horizontal lines
    rect(centerX-unit*(1.5+ratio1/2), centerY-unit*(ratio2+0.5)+lineWidth/2, unit*ratio1, lineWidth);
    rect(centerX+unit*(1.5+ratio1/2), centerY-unit*(ratio2+0.5)+lineWidth/2, unit*ratio1, lineWidth);
    rect(centerX-unit*(1.5+ratio1/2), centerY+unit*(ratio2+0.5)-lineWidth/2, unit*ratio1, lineWidth);
    rect(centerX+unit*(1.5+ratio1/2), centerY+unit*(ratio2+0.5)-lineWidth/2, unit*ratio1, lineWidth);
    // vertical lines
    rect(centerX-maxWidth/2+lineWidth/2,centerY,lineWidth,unit);
    rect(centerX+maxWidth/2-lineWidth/2,centerY,lineWidth,unit);
    // stand by text
    noStroke();
    fill('rgba(255,255,255,0.5)');
    textSize(unit/4);
    textAlign(CENTER);
    textFont("CelestialBeingFont");
    text("STANDBY MODE", centerX, centerY-unit/8);
}
