function Vector() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
}
Vector.prototype.length = function () {
    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
}
Vector.prototype.divideScalar = function( scalar ) {
    var invScalar = 1 / scalar;
    this.x *= invScalar;
    this.y *= invScalar;
    this.z *= invScalar;
    return this;
}
Vector.prototype.normalize = function () {
    return this.divideScalar( this.length() );
}


var start = new Date().getTime();

for(var i = 0; i < 1000000; ++i) {
    var v = new Vector();
    v.x = i;
    v.y = i/2.0;
    v.z = i/3.0;
    v.length();
}

var end = new Date().getTime();
var time = end - start;
var ret = 'Execution time (ms): ' + time;
var para = document.createElement("p");
var node = document.createTextNode(ret);
para.appendChild(node);
document.body.appendChild(para);
