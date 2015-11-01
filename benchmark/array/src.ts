class Pt {
    x : number;
    y : number;
}

var start = new Date().getTime();

for (var i = 0; i < 300000; ++i) {
    var arr = new Array(100);
    for (var j = 0; j < 100; ++j) {
        arr[j] = new Pt();
    }
    arr[0].x = 10;
}

var end = new Date().getTime();
var time = end - start;
var ret = 'Execution time (ms): ' + time;
var para = document.createElement("p");
var node = document.createTextNode(ret);
para.appendChild(node);
document.body.appendChild(para);