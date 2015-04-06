var Vec3 = (function () {
    var _Vec3 = new TypedObject.StructType({
        x: TypedObject.float64,
        y: TypedObject.float64,
        z: TypedObject.float64
    });
    function _ctor() {
    }
    function Vec3() {
        var obj = new _Vec3();
        _ctor.call(obj);
        return obj;
    }
    return Vec3;
})();
function vec3_new(_x, _y, _z) {
    var v = new Vec3();
    v.x = _x;
    v.y = _y;
    v.z = _z;
    return v;
}
function vec3_length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}
function vec3_divide_scalar(v, scalar) {
    if (scalar !== 0) {
        var invScalar = 1 / scalar;
        v.x *= invScalar;
        v.y *= invScalar;
        v.z *= invScalar;
    }
    else {
        v.x = v.y = v.z = 0;
    }
}
function vec3_normalize(v) {
    vec3_divide_scalar(v, vec3_length(v));
}
var Quat = (function () {
    var _Quat = new TypedObject.StructType({
        x: TypedObject.float64,
        y: TypedObject.float64,
        z: TypedObject.float64,
        w: TypedObject.float64
    });
    function _ctor() {
    }
    function Quat() {
        var obj = new _Quat();
        _ctor.call(obj);
        return obj;
    }
    return Quat;
})();
function quat_new() {
    var v = new Quat();
    v.x = v.y = v.z = v.w = 0;
    return v;
}
function quat_length(q) {
    return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
}
function quat_normalize(q) {
    var l = quat_length(q);
    if (l === 0) {
        q.x = q.y = q.z = 0;
        q.w = 1;
    }
    else {
        l = 1 / l;
        q.x = q.x * l;
        q.y = q.y * l;
        q.z = q.z * l;
        q.w = q.w * l;
    }
}
function quat_set_from_axis_angle(q, axis, angle) {
    var halfAngle = angle / 2;
    var s = Math.sin(halfAngle);
    q.x = axis.x * s;
    q.y = axis.y * s;
    q.z = axis.z * s;
    q.w = Math.cos(halfAngle);
}
////////////////////////////////////////////////////////////////////////
// benchmark
var start = new Date().getTime();
for (var i = 0; i < 5000000; ++i) {
    var axis0 = vec3_new(5, i / 100.0, 7.0 - i % 100);
    vec3_normalize(axis0);
    var angle0 = i % 360;
    var q0 = quat_new();
    quat_set_from_axis_angle(q0, axis0, angle0);
    quat_normalize(q0);
    var axis1 = vec3_new(-5, i / 300.0, -11.0 + 2 * i % 60);
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
