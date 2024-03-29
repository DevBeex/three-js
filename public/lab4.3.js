import * as THREE from 'three';

var waveGrid = function(opt) {
    opt = opt || {};
    opt.width = opt.width || 30;
    opt.depth = opt.depth || 30;
    opt.height = opt.height || 2;
    opt.forPoint = opt.forPoint || function() {};
    opt.context = opt.context || opt;
    opt.xStep = opt.xStep || 0.075;
    opt.yStep = opt.yStep || 0.1;
    opt.zStep = opt.zStep || 0.075;
    opt.waveOffset = opt.waveOffset === undefined ? 0 : opt.waveOffset;
    var points = [],
        radPer, x = 0,
        i = 0,
        y, z;

    while (x < opt.width) {
        z = 0;
        while (z < opt.depth) {
            radPer = (z / opt.depth + (1 / opt.width * x) + opt.waveOffset) % 1;
            y = Math.cos(Math.PI * 4 * radPer) * opt.height;
            opt.forPoint.call(opt.context, x * opt.xStep, y * opt.yStep, z * opt.zStep, i);
            z += 1;
            i += 3;
        }
        x += 1;
    };
};

var makePoints = function() {
    var geometry = new THREE.BufferGeometry();
    var points = [],
        opt = {};
    opt.forPoint = function(x, y, z, i) {
        points.push(x, y, z);
    };
    waveGrid(opt);
    var vertices = new Float32Array(points);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: .125,
            color: new THREE.Color(0.0, 0.25, 0.25)
        }));
};

var updatePoints = function(points, per) {
    var position = points.geometry.getAttribute('position');
    waveGrid({
        waveOffset: per,
        xStep: 0.125,
        zStep: 0.125,
        forPoint: function(x, y, z, i) {
            position.array[i] = x - 2;
            position.array[i + 1] = y - 2;
            position.array[i + 2] = z - 2;
        }
    });
    position.needsUpdate = true;
}

var renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(120, 120, 120)');
document.getElementById('container').appendChild(renderer.domElement);
var scene = new THREE.Scene();
var fogColor = new THREE.Color(1.0, 0.25, 0.0);
scene.background = fogColor;
scene.fog = new THREE.FogExp2(fogColor, 0.3);
var points = makePoints();
scene.add(points);
var camera = new THREE.PerspectiveCamera(40, 320 / 240, .001, 1000);

points.position.set(0, 2.5, 0);
camera.position.set(2.5, 2.5, 2.5);

var frame = 0,
    maxFrame = 300,
    lt = new Date(),
    fps = 60,
    loop = function() {
        var now = new Date(),
            secs = (now - lt) / 1000,
            per = frame / maxFrame,
            bias = 1 - Math.abs(per - 0.5) / 0.5;

        requestAnimationFrame(loop);

        if (secs > 1 / fps) {
            updatePoints(points, per * 8 % 1);
            var d = 0.5 + 2.5 * (1 - bias);
            camera.position.set(d, 2.5, d);
            camera.lookAt(-10, -10, -10);
            camera.rotation.z = Math.PI * 2 * per;
            renderer.render(scene, camera);
            frame += fps * secs;
            frame %= maxFrame;
            lt = now;
        }
    };

loop();