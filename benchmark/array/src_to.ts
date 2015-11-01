struct Pt {
    x : number;
    y : number;
}

var start = new Date().getTime();

for (var i = 0; i < 30000; ++i) {
    var arr: Pt[] = new Pt[100];
    arr[0].x = 10;
}

var end = new Date().getTime();
var time = end - start;
var ret = 'Execution time (ms): ' + time;
var para = document.createElement("p");
var node = document.createTextNode(ret);
para.appendChild(node);
document.body.appendChild(para);