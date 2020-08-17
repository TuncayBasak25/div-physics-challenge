let divArray = document.getElementsByTagName('div');
let actualdiv = null;
let divParent = null;
let nextSibling = null;

console.log(divArray);


for (var i = 0; i < divArray.length; i++) {
  divArray[i].setAttribute('onmousedown', 'startPhysics(divArray[' + i + '])');
}


function startPhysics(div) {
  if (actualdiv) return false;

  //Start the phisics engine
  actualdiv = div.cloneNode(true);

  actualdiv.update = function() {
    this.style.left = String(mouseX - this.offsetX) + "px";
    this.style.top = String(mouseY - this.offsetY) + "px";
    this.style.transform = "rotate(" + this.angle + "deg)";

    console.log(this.angleSpeed);
    this.angle += this.angleSpeed;
    this.angleSpeed *= 0.9;

    this.style.transformOrigin = this.offsetX + "px " + this.offsetY + "px";

    this.centerX = (this.getBoundingClientRect().x + this.getBoundingClientRect().right)/2;
    this.centerY = (this.getBoundingClientRect().y + this.getBoundingClientRect().bottom)/2;

    if (mouseX !== this.centerX) this.angleSpeed += (this.centerX - mouseX)/400;

    if (mouseX !== mouseTrace[0].x && mouseY !== this.center) this.angleSpeed -= (mouseTrace[0].x - mouseX) * Math.abs(mouseY - this.centerY)/1000;
    if (mouseY !== mouseTrace[0].y && mouseX !== this.center) this.angleSpeed -= (mouseTrace[0].y - mouseY) * Math.abs(mouseX - this.centerX)/1000;
    mouseTrace[0].x = mouseX;
    mouseTrace[0].y = mouseY;
  }

  actualdiv.setAttribute('onmouseup', 'endPhysics()');

  actualdiv.offsetX = mouseX - div.getBoundingClientRect().x;
  actualdiv.offsetY = mouseY - div.getBoundingClientRect().y;

  actualdiv.angle = 0;
  actualdiv.angleSpeed = 0;

  actualdiv.centerX = actualdiv.getBoundingClientRect().x + parseInt(actualdiv.style.width)/2;
  actualdiv.centerY = actualdiv.getBoundingClientRect().y + parseInt(actualdiv.style.height)/2;

  actualdiv.style.position = "absolute";
  actualdiv.style.zIndex = 100;
  document.body.appendChild(actualdiv);

  actualdiv.source = div;
  div.style.opacity = 0;
}

function endPhysics() {
  actualdiv.source.style.opacity = 1;

  actualdiv.remove();

  actualdiv = null;
}




let mouseX = 0;
let mouseY = 0;

let mousePos = {x: 0, y: 0};

let mouseTrace = [];

document.body.setAttribute('onmousemove', 'mouseMove()');

function mouseMove() {
  mouseTrace.unshift( {...mousePos} );
  if (mouseTrace.length > 180) mouseTrace.pop();

  mouseX = mousePos.x = window.event.clientX;
  mouseY = mousePos.y = window.event.clientY;
}

window.requestAnimationFrame(function loop() {
  if (actualdiv) {
    actualdiv.update();
  }

window.requestAnimationFrame(loop)});
