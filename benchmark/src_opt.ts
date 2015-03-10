struct Vector {
    x: number;
    y: number;
    z: number;
}

function new_vector(_x: number, _y: number, _z: number) {
    var ret = new Vector();
    ret.x = _x;
    ret.y = _y;
    ret.z = _z;
    return ret;
}

function vec_times(k: number, v: Vector) {
    return new_vector(k * v.x, k * v.y, k * v.z);
}

function vec_minus(v1: Vector, v2: Vector) {
    return new_vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

function vec_plus(v1: Vector, v2: Vector) {
    return new_vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

function vec_dot(v1: Vector, v2: Vector) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function vec_mag(v: Vector) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function vec_norm(v: Vector) {
    var mag = vec_mag(v);
    var div = (mag === 0) ? Infinity : 1.0 / mag;
    return vec_times(div, v);
}

function vec_cross(v1: Vector, v2: Vector) {
    return new_vector(v1.y * v2.z - v1.z * v2.y,
                      v1.z * v2.x - v1.x * v2.z,
                      v1.x * v2.y - v1.y * v2.x);
}

////////////////////////////////////////////////////////////////////////////////////////////////////

struct Color {
    r: number;
    g: number;
    b: number;
}

function new_color(_x: number, _y: number, _z: number) {
    var ret = new Color();
    ret.r = _x;
    ret.g = _y;
    ret.b = _z;
    return ret;
}

function color_scale(k: number, v: Color) {
    return new_color(k * v.r, k * v.g, k * v.b);
}

function color_plus(v1: Color, v2: Color) {
    return new_color(v1.r + v2.r, v1.g + v2.g, v1.b + v2.b);
}

function color_times(v1: Color, v2: Color) {
    return new_color(v1.r * v2.r, v1.g * v2.g, v1.b * v2.b);
}

var color_white = new_color(1.0, 1.0, 1.0);
var color_grey = new_color(0.5, 0.5, 0.5);
var color_black = new_color(0.0, 0.0, 0.0);
var color_background = color_black;
var color_defaultColor = color_black;

function color_toDrawingColor(c: Color) {
    var legalize = d => d > 1 ? 1 : d;
    return {
        r: Math.floor(legalize(c.r) * 255),
        g: Math.floor(legalize(c.g) * 255),
        b: Math.floor(legalize(c.b) * 255)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

class Camera {

    forward: Vector;
    right: Vector;
    up: Vector;
    pos: Vector;

    constructor(pos: Vector, lookAt: Vector) {
        this.pos = pos;
        var down = new_vector(0.0, -1.0, 0.0);
        this.forward = vec_norm(vec_minus(lookAt, this.pos));
        this.right = vec_times(1.5, vec_norm(vec_cross(this.forward, down)));
        this.up = vec_times(1.5, vec_norm(vec_cross(this.forward, this.right)));
    }

}

interface Ray {
    start: Vector;
    dir: Vector;
}

interface Intersection {
    thing: Thing;
    ray: Ray;
    dist: number;
}

interface Surface {
    diffuse: (pos: Vector) => Color;
    specular: (pos: Vector) => Color;
    reflect: (pos: Vector) => number;
    roughness: number;
}

interface Thing {
    intersect: (ray: Ray) => Intersection;
    normal: (pos: Vector) => Vector;
    surface: Surface;
}

interface Light {
    pos: Vector;
    color: Color;
}

interface Scene {
    things: Thing[];
    lights: Light[];
    camera: Camera;
}

class Sphere implements Thing {

    radius2: number;

    constructor(public center: Vector, radius: number, public surface: Surface) {
        this.radius2 = radius * radius;
    }

    normal(pos: Vector): Vector {
        return vec_norm(vec_minus(pos, this.center));
    }

    intersect(ray: Ray) {
        var eo = vec_minus(this.center, ray.start);
        var v = vec_dot(eo, ray.dir);
        var dist = 0;
        if (v >= 0) {
            var disc = this.radius2 - (vec_dot(eo, eo) - v * v);
            if (disc >= 0) {
                dist = v - Math.sqrt(disc);
            }
        }
        if (dist === 0) {
            return null;
        } else {
            return { thing: this, ray: ray, dist: dist };
        }
    }

}

class Plane implements Thing {

    normal: (pos: Vector) => Vector;
    intersect: (ray: Ray) => Intersection;

    constructor(norm: Vector, offset: number, public surface: Surface) {
        this.normal = function(pos: Vector) { return norm; }
        this.intersect = function(ray: Ray): Intersection {
            var denom = vec_dot(norm, ray.dir);
            if (denom > 0) {
                return null;
            } else {
                var dist = (vec_dot(norm, ray.start) + offset) / (-denom);
                return { thing: this, ray: ray, dist: dist };
            }
        }
    }

}

module Surfaces {

    export var shiny: Surface = {
        diffuse: function(pos) { return color_white; },
        specular: function(pos) { return color_grey; },
        reflect: function(pos) { return 0.7; },
        roughness: 250
    }

    export var checkerboard: Surface = {
        diffuse: function(pos) {
            if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) {
                return color_white;
            } else {
                return color_black;
            }
        },
        specular: function(pos) { return color_white; },
        reflect: function(pos) {
            if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) {
                return 0.1;
            } else {
                return 0.7;
            }
        },
        roughness: 150
    }

}


class RayTracer {

    private maxDepth = 5;

    private intersections(ray: Ray, scene: Scene) {
        var closest = +Infinity;
        var closestInter: Intersection = undefined;
        for (var i in scene.things) {
            var inter = scene.things[i].intersect(ray);
            if (inter != null && inter.dist < closest) {
                closestInter = inter;
                closest = inter.dist;
            }
        }
        return closestInter;
    }

    private testRay(ray: Ray, scene: Scene) {
        var isect = this.intersections(ray, scene);
        if (isect != null) {
            return isect.dist;
        } else {
            return undefined;
        }
    }

    private traceRay(ray: Ray, scene: Scene, depth: number): Color {
        var isect = this.intersections(ray, scene);
        if (isect === undefined) {
            return color_background;
        } else {
            return this.shade(isect, scene, depth);
        }
    }

    private shade(isect: Intersection, scene: Scene, depth: number): Color{
        var d = isect.ray.dir;
        var pos = vec_plus(vec_times(isect.dist, d), isect.ray.start);
        var normal = isect.thing.normal(pos);
        var reflectDir = vec_minus(d, vec_times(2, vec_times(vec_dot(normal, d), normal)));
        var naturalColor = color_plus(color_background,
                                      this.getNaturalColor(isect.thing, pos, normal, reflectDir, scene));
        var reflectedColor = (depth >= this.maxDepth) ? color_grey : this.getReflectionColor(isect.thing, pos, normal, reflectDir, scene, depth);
        return color_plus(naturalColor, reflectedColor);
    }

    private getReflectionColor(thing: Thing, pos: Vector, normal: Vector, rd: Vector, scene: Scene, depth: number): Color {
        return color_scale(thing.surface.reflect(pos), this.traceRay({ start: pos, dir: rd }, scene, depth + 1));
    }

    private getNaturalColor(thing: Thing, pos: Vector, norm: Vector, rd: Vector, scene: Scene): Color {
        var addLight = (col: Color, light: Light) => {
            var ldis = vec_minus(
                light.pos, 
                pos);
            var livec = vec_norm(ldis);
            var neatIsect = this.testRay({ start: pos, dir: livec }, scene);
            var isInShadow = (neatIsect === undefined) ? false : (neatIsect <= vec_mag(ldis));
            if (isInShadow) {
                return col;
            } else {
                var illum = vec_dot(livec, norm);
                var lcolor = (illum > 0) ? color_scale(illum, light.color)
                                          : color_defaultColor;
                var specular = vec_dot(livec, vec_norm(rd));
                var scolor = (specular > 0) ? color_scale(Math.pow(specular, thing.surface.roughness), light.color)
                                          : color_defaultColor;
                return color_plus(col, color_plus(color_times(thing.surface.diffuse(pos), lcolor),
                                                  color_times(thing.surface.specular(pos), scolor)));
            }
        }
        return scene.lights.reduce(addLight, color_defaultColor);
    }

    render(scene:Scene, ctx, screenWidth, screenHeight) {
        var start = new Date().getTime();

        var getPoint = (x, y, camera: Camera): Vector => {
            var recenterX = x => (x - (screenWidth / 2.0)) / 2.0 / screenWidth;
            var recenterY = y => -(y - (screenHeight / 2.0)) / 2.0 / screenHeight;
            return vec_norm(vec_plus(camera.forward, 
                vec_plus(vec_times(recenterX(x), camera.right), 
                vec_times(recenterY(y), camera.up))));
        }
        for (var y = 0; y < screenHeight; y++) {
            for (var x = 0; x < screenWidth; x++) {
                var color = this.traceRay({ start: scene.camera.pos, dir: getPoint(x, y, scene.camera) },
                    scene, 0);
                var c = color_toDrawingColor(color);
                ctx.fillStyle = "rgb(" + String(c.r) + ", " + String(c.g) + ", " + String(c.b) + ")";
                ctx.fillRect(x, y, x + 1, y + 1);
            }
        }

        var end = new Date().getTime();
        var time = end - start;
        var ret = 'Execution time (ms): ' + time;

        var para = document.createElement("p");
        var node = document.createTextNode(ret);
        para.appendChild(node);
        document.body.appendChild(para);
    }

}


function defaultScene(): Scene {
    return {
        things: [new Plane(new_vector(0.0, 1.0, 0.0), 0.0, Surfaces.checkerboard),
                 new Sphere(new_vector(0.0, 1.0, -0.25), 1.0, Surfaces.shiny),
                 new Sphere(new_vector(-1.0, 0.5, 1.5), 0.5, Surfaces.shiny)],
        
        lights: [{ pos: new_vector(-2.0, 2.5, 0.0), color: new_color(0.49, 0.07, 0.07) },
                 { pos: new_vector(1.5, 2.5, 1.5), color: new_color(0.07, 0.07, 0.49) },
                 { pos: new_vector(1.5, 2.5, -1.5), color: new_color(0.07, 0.49, 0.071) },
                 { pos: new_vector(0.0, 3.5, 0.0), color: new_color(0.21, 0.21, 0.35) }],

        camera: new Camera(new_vector(3.0, 2.0, 4.0), new_vector(-1.0, 0.5, 0.0))
    };
}

function exec() {
    var canv = document.createElement("canvas");
    canv.width = 256;
    canv.height = 256;
    document.body.appendChild(canv);
    var ctx = canv.getContext("2d");
    var rayTracer = new RayTracer();
    return rayTracer.render(defaultScene(), ctx, 256, 256);
}

exec();
