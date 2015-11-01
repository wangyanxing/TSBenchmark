var Pt = (function () {
    var _Pt = new TypedObject.StructType({
        x: TypedObject.float64,
        y: TypedObject.float64
    });
    function Pt() {
        return new _Pt();
    }
    Pt._TO = _Pt;
    return Pt;
})();

var type = Pt._TO.array(100);
var start = new Date().getTime();
for (var i = 0; i < 30000; ++i) {
    var arr = new type();
    arr[0].x = 10;
}
var end = new Date().getTime();
var time = end - start;
var ret = 'Execution time (ms): ' + time;
var para = document.createElement("p");
var node = document.createTextNode(ret);
para.appendChild(node);
document.body.appendChild(para);
