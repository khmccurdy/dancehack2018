var $canvas = d3.select("canvas");
var cwidth = $canvas.attr("width");
var cheight = $canvas.attr("height");
var c = $canvas.node().getContext("2d");

var screenRect = [0,0,cwidth,cheight];
var mousePos=[0,0];
const fullArc = [0,2*Math.PI];

var objPosition=[cwidth/2,cheight/2];
var objMaxSteps;
var objPosOld;
var objPosNew;

var objIsAnimating=false;
var objIntervalID=0;
var objMoveCounter=0;

var objImg=new Image();
objImg.src = 'balloon.png';
objImg.onload = drawObj;

var girlImg=new Image();
girlImg.src = 'girl.png';
girlImg.onload = drawObj;

var bgImg=new Image();
bgImg.src = 'background1.png';
bgImg.onload = drawObj;

function reshape(arr, rows, cols){
    var newArr = [];
    for (let r=0;r<rows;r++){
        let row=[];
        for (let c=0;c<cols;c++){
            let i=r*cols+c;
            if (i<arr.length) row.push(arr[i]);
        }
        newArr.push(row);
    }
    return newArr;
}

function loadImage(url,scale=0.3){
    var img = new Image();
    img.src= url;

    img.onload = function() {
        let wi = this.width;
        let hi = this.height;
        /*
        var imgCanvas = document.createElement('canvas');
        imgCanvas.width = wi;
        imgCanvas.height = hi;
        var ci = imgCanvas.getContext('2d');
        ci.drawImage(this,0,0);

        var imgData = ci.getImageData(0,0,wi,hi);
        var pixelArr = reshape(imgData.data, wi*hi, 4);
        var pixelGrid = reshape(pixelArr, hi, wi);
        
        for (var x=0; x<wi; x++){
            for (var y=0; y<hi; y++){
                let [r,g,b,a] = pixelGrid[y][x];
                
                // c.fillStyle=`rgba(${r},${g},${b},${a})`
                // c.fillRect(x,y,1,1);
            }
        }
        */
       c.drawImage(this,0,0,wi*scale,hi*scale);
    }
}

function drawObj(){
    // console.log('hi')
    // let radius=40;
    let [wi,hi]=[120,110];
    let [wg,hg]=[114,180];
    let [ox,oy]=objPosition;
    let [mx,my]=mousePos;
    // console.log(ox,oy);
    c.clearRect(...screenRect);
    // c.drawImage(bgImg,0,0,cwidth,cheight);

    c.fillStyle='black';
    c.drawImage(objImg,ox-wi/2,oy-hi/2,wi,hi);

    c.drawImage(girlImg, mx-wg/2,my-hg/2,wg,hg);
    // c.fillRect(ox-wi,oy-hi,wi*2,hi*2);
    c.globalCompositeOperation = 'multiply';
    c.drawImage(bgImg,0,0,cwidth,cheight);
    c.globalCompositeOperation = 'source-over';
}

function lerp(a,b,t){
    return a+t*(b-a);
}

function moveObj(){
    // console.log(objMoveCounter);
    if (objMoveCounter<0){
        clearInterval(objIntervalID);
        objIsAnimating=false;
        return;
    }

    let t = 1-objMoveCounter/objMaxSteps;
    t = Math.cos(t*Math.PI)*-.5+.5;

    let [oldx,oldy] = objPosOld;
    let [newx,newy] = objPosNew;

    let ox = lerp(oldx,newx,t);
    let oy = lerp(oldy,newy,t);

    objPosition = [ox,oy];
    drawObj();
    objMoveCounter--;
}

$canvas.on('mousemove', function(e){
    mousePos=d3.mouse(this);
    if (objIsAnimating) return;
    let radius=120;
    let xPad=60;
    let yPad=60;
    let redraw=false;
    // console.log(mousePos);
    let [mx,my]=mousePos;
    let [ox,oy]=objPosition;
    // console.log(mx-ox,my-oy);
    if (Math.abs(ox-mx)<radius && Math.abs(oy-my)<radius){
        let xrand = Math.random()*30;
        ox = (mx>cwidth/2)?xPad+xrand:cwidth-xPad-xrand;
        oy = Math.random()*(cheight-2*yPad)+yPad;

        objIsAnimating = true;
        objMaxSteps=15;
        objMoveCounter = objMaxSteps;
        objIntervalID = setInterval(moveObj,20);
        // console.log(objIntervalID);
        // if (objIntervalID>20) objImg.src='balloon2.png'

        objPosOld=objPosition;
        objPosNew=[ox,oy];
        // redraw=true;
    }
    drawObj();
    // objPosition=[ox,oy];
    // if(redraw) drawObj();
})

$canvas.on("click",function(e){
    let oldMouse = mousePos;
    mousePos=d3.mouse(this)//.map(d=>Math.floor(d/dotSize));

    if (d3.event.shiftKey){
        // let [x,y]=mousePos;
        // mousePos=oldMouse;
    }
    if (d3.event.ctrlKey){
    }
    if (d3.event.altKey){
    }
})

$canvas.call(d3.drag().on('drag',function(e){
    if (!d3.event.sourceEvent.shiftKey) return;

    let [x,y]=d3.mouse(this)

    if (d3.event.sourceEvent.ctrlKey){
        //Example of modifier key
    }
}));

drawObj();