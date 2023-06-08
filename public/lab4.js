import * as THREE from 'three';

var mousePos = {x: .5, y: .5};
document.addEventListener('mousemove', function(event) {
    mousePos = {x:event.clientX/window.innerWidth, y: event.clientY/window.innerHeight};
});
var phase = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var boxSize = 0.2;
var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
var materialGreen = new THREE.MeshBasicMaterial ({
    transparent: true, color: 0x00ff00, opacity: 0.5, side: THREE.DoubleSide
});

var pitchSegments = 60;
var elevationSegments = pitchSegments/2;
var particles = pitchSegments*elevationSegments;
var side = Math.pow(particles, 1/3);

var radius = 16;
var parentContainer = new THREE.Object3D();
scene.add(parentContainer);

function posInBox(place){
    return ((place/side) - 0.5) * radius * 1.5;
}

for (var p = 0; p<pitchSegments; p++){
    var pitch = Math.PI * 2 * p/pitchSegments;
    for (var e = 0; e < elevationSegments; e++){
        var elevation = Math.PI * ((e/elevationSegments)-0.5)
        var particle = new THREE.Mesh(geometry, materialGreen);
        parentContainer.add(particle);
        var dest = new THREE.Vector3();
        dest.z = (Math.sin(pitch) * Math.cos(elevation)) * radius;
        dest.x = (Math.cos(pitch) * Math.cos(elevation)) * radius;
        dest.y = Math.sin(elevation) * radius;
        particle.position.x = posInBox(parentContainer.children.length % side);
        particle.position.y = posInBox(Math.floor(parentContainer.children.length/side) % side);
        particle.position.z = posInBox(Math.floor(parentContainer.children.length/Math.pow(side,2)) % side);
        console.log(side, parentContainer.children.length, particle.position.x, particle.position.y, particle.position.z)
        particle.userData = {dests: [dest,particle.position.clone()], speed: new THREE.Vector3()};
    }
}

function render() {
    phase += 0.002;
    for (var i = 0, l = parentContainer.children.length; i < l; i++){
        var particle = parentContainer.children[i];
        var dest = particle.userData.dests[Math.floor(phase)%particle.userData.dests.length].clone();
        var diff = dest.sub(particle.position);
        particle.userData.speed.divideScalar(1.02);
        particle.userData.speed.add(diff.divideScalar(400));
        particle.position.add(particle.userData.speed);
        particle.lookAt(dest);
    }

    parentContainer.rotation.y = phase*3;
    parentContainer.rotation.x = (mousePos.y-0.5) * Math.PI;
    parentContainer.rotation.z = (mousePos.x-0.5) * Math.PI;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
