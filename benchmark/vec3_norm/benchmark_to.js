var Vector = (function () {
    var _Vector = new TypedObject.StructType({
        x: TypedObject.float64,
        y: TypedObject.float64,
        z: TypedObject.float64,
    });
    _Vector.prototype.length = function () {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    }
    _Vector.prototype.divideScalar = function( scalar ) {
        if ( scalar !== 0 ) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }
    _Vector.prototype.normalize = function () {
        return this.divideScalar( this.length() );
    }
    function Vector(x, y, z) {
        var obj = new _Vector();
        obj.x = x;
        obj.y = y;
        obj.z = z;
        return obj;
    }    
    return Vector;
})();


var start = new Date().getTime();

for(var i = 0; i < 1000000; ++i) {
    var v = new Vector(i,i/2.0,i/3.0);
    v.length();
}

var end = new Date().getTime();
var time = end - start;
var ret = 'Execution time (ms): ' + time;
var para = document.createElement("p");
var node = document.createTextNode(ret);
para.appendChild(node);
document.body.appendChild(para);


