struct Vec3 {
    x : number;
    y : number;
    z : number;
}

function vec3_new(_x : number, _y : number, _z : number) {
    var v = new Vec3();
    v.x = _x;
    v.y = _y;
    v.z = _z;
    return v;
}

function vec3_length(v : Vec3) : number {
    return Math.sqrt( v.x * v.x + v.y * v.y + v.z * v.z );
}

function vec3_divide_scalar(v : Vec3, scalar : number) {
    if ( scalar !== 0 ) {
        var invScalar = 1 / scalar;
        v.x *= invScalar;
        v.y *= invScalar;
        v.z *= invScalar;
    } else {
        v.x = v.y = v.z = 0;
    }
}

function vec3_normalize(v : Vec3) {
    vec3_divide_scalar(v, vec3_length(v));
}

struct Quat {
    x : number;
    y : number;
    z : number;
    w : number;
}

function quat_new() {
    var v = new Quat();
    v.x = v.y = v.z = v.w = 0;
    return v;
}

function quat_length(q : Quat) {
    return Math.sqrt( q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w );
}

function quat_normalize(q : Quat) {
    var l : number = quat_length(q);
    if ( l === 0 ) {
        q.x = q.y = q.z = 0;
        q.w = 1;
    } else {
        l = 1 / l;
        q.x = q.x * l;
        q.y = q.y * l;
        q.z = q.z * l;
        q.w = q.w * l;
    }
}

function quat_set_from_axis_angle(q : Quat, axis : Vec3, angle : number) {
    var halfAngle : number = angle / 2;
    var s : number = Math.sin( halfAngle );
    q.x = axis.x * s;
    q.y = axis.y * s;
    q.z = axis.z * s;
    q.w = Math.cos( halfAngle );
}

////////////////////////////////////////////////////////////////////////
// benchmark

var start = new Date().getTime();

// create two normalized quaternions
for(var i = 0; i < 5000000; ++i) {
    var axis0 : Vec3 = vec3_new(5, i / 100.0, 7.0 - i % 100);
    vec3_normalize(axis0);
    var angle0 = i % 360;

    var q0 = quat_new();
    quat_set_from_axis_angle(q0, axis0, angle0);
    quat_normalize(q0);

    var axis1 : Vec3 = vec3_new(-5, i / 300.0, -11.0 + 2 * i % 60);
    vec3_normalize(axis1);
    var angle1 = i % 360;

    var q1 = quat_new();
    quat_set_from_axis_angle(q1, axis1, angle1);
    quat_normalize(q1);
}

var end = new Date().getTime();
var time = end - start;
var ret = 'Execution time (ms): ' + time;
var para = document.createElement("p");
var node = document.createTextNode(ret);
para.appendChild(node);
document.body.appendChild(para);
