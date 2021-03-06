/*
Circuit drawer made by Andreas Palsson and Igor Ramon
*/

var gl;
var points = [];
var usedSpaceX = [];
var usedSpaceY = [];
var numPoints = 0;
var maxPoints = 1000;
var mouseSize = 8;
var canvas;

var drawingLine = false;
var linePoints = [];

var TYPE = 0;
var numDevices = 0;
var maxDevices = 30;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
  
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.79, 0.79, 0.79, 1.0 );
    	
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
			
	var maxVertices = 1000;
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, maxVertices*8, gl.STATIC_DRAW );
	
	points = [];

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	// Set up event listener	
	canvas.addEventListener ("click", function(event) {
		if (numDevices > maxDevices) {
			alert('You cant draw anymore');
			return;
		}
		
		var point = vec2 (-1 + 2*(event.clientX-mouseSize)/canvas.width, -1 + 2*(canvas.height-event.clientY+mouseSize)/canvas.height);
		
		if(TYPE!=3) {
			for(var i=0; i < numDevices; i++) {
				if(usedSpaceX[i]-0.3 < point[0] && usedSpaceX[i]+0.3 > point[0]) {
					if(usedSpaceY[i]-0.3 < point[1] && usedSpaceY[i]+0.3 > point[1]){
						alert('This place already have an element');
						return;
					}
				}
			}
		}
		
		switch(TYPE) {
			case 0:
				drawOr(point[0], point[1]);
				break;
			case 1:
				drawAnd(point[0], point[1]);
				break;
			case 2:
				drawNot(point[0], point[1]);
				break;
			case 3:
				linePoints.push(point);
				if (linePoints.length >= 2) {
					drawLine(linePoints);
					linePoints = [];
				}
			default:
				break;
		}
				
	});
	
	var menu = document.getElementById ("menu");
	menu.addEventListener ("click", function () {
		if(linePoints.length == 1) {
			alert('FINISH DRAWING YOUR LINE');
			return;
		}
	   switch (menu.selectedIndex) {
	      case 0:
		    TYPE = 0;
			//alert('NOW DRAWING OR');
			break;
		  case 1:
		    TYPE = 1;
			//alert('NOW DRAWING AND');
			break;
		  case 2:
			TYPE = 2;
			//alert('NOW DRAWING NOT');
			break;
		  case 3:
		    TYPE = 3;
			//alert('NOW DRAWING LINES');
			break;
		}
	})
	
	render();
};

function drawLine(linePoints) {
	points.push(linePoints[0]);
	points.push(linePoints[1]);
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	render();
}
function drawNot(x, y) {

	var p = new vec2(x-0.125, y-0.125);
	points.push(p);
	
	p = new vec2(x-0.125, y+0.125);
	points.push(p);	
	points.push(p);
		
	p = new vec2(x+0.125, y);
	points.push(p);
	points.push(p);
	
	p = new vec2(x-0.125, y-0.125);
	points.push(p);
	
	p = new vec2(x+0.125, y);
	points.push(p);
	
	p = new vec2(x+0.142, y+0.018);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.167, y+0.018);
	points.push(p);	
	points.push(p);
	
	p = new vec2(x+0.175, y+0.0043);
	points.push(p);	
	points.push(p);
	
	p = new vec2(x+0.175, y-0.0043);
	points.push(p);	
	points.push(p);
	
	p = new vec2(x+0.167, y-0.018);
	points.push(p);	
	points.push(p);
	
	p = new vec2(x+0.142, y-0.018);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.125, y);
	points.push(p);	
	
	usedSpaceX.push(x);
	usedSpaceY.push(y);
	
	console.log("drawnot");
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	numDevices++;
	render();
}
function drawAnd(x, y) {
	
	var p = new vec2(x-0.125, y-0.125);
	points.push(p);
	
	p = new vec2(x-0.125, y+0.125);
	points.push(p);	
	points.push(p);
	
	p = new vec2(x, y+0.125);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.063, y+0.108);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.095, y+0.08);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.123, y+0.021);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.123, y-0.021);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.095, y-0.08);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.063, y-0.108);
	points.push(p);
	points.push(p);
	
	p = new vec2(x, y-0.125);
	points.push(p);	
	points.push(p);
	
	p = new vec2(x-0.125, y-0.125);
	points.push(p);	
	
	usedSpaceX.push(x);
	usedSpaceY.push(y);
	
	console.log("drawand");
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	numDevices++;
	render();
}

function drawOr(x, y) {
	
	var p = new vec2(x, y+0.125);
	points.push(p);
	
	p = new vec2(x+0.088, y+0.088);
	points.push(p);	
	points.push(p);
		
	p = new vec2(x+0.125, y);
	points.push(p);
	points.push(p);
	
	p = new vec2(x+0.088, y-0.088);
	points.push(p);
	points.push(p);	
	
	p = new vec2(x, y-0.125);
	points.push(p);
	points.push(p);
	
	p = new vec2(x-0.125, y-0.125);
	points.push(p);
	points.push(p);
	
	p = new vec2(x-0.05, y-0.0625);
	points.push(p);
	points.push(p);
	
	
	p = new vec2(x-0.03, y);
	points.push(p);
	points.push(p);
	
	p = new vec2(x-0.05, y+0.0625);
	points.push(p);
	points.push(p);
	
	p = new vec2(x-0.125, y+0.125);
	points.push(p);
	points.push(p);
	
	p = new vec2(x, y+0.125);
	points.push(p);
	
	usedSpaceX.push(x);
	usedSpaceY.push(y);	
		
	console.log("drawor");
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	numDevices++;
	render();
}
function render() {
	console.log("render");
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.drawArrays( gl.LINES, 0, points.length );

}