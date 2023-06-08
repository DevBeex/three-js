import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js'
import { GUI } from '/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 15

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const controls = new OrbitControls(camera, renderer.domElement)

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    // wireframe: true //Pone las lineas
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)


const geometry_esfera = new THREE.SphereGeometry(0.5, 32, 16);
const material_2 = new THREE.MeshBasicMaterial({
    color: 808080,
    wireframe: true
}); 
const sphere = new THREE.Mesh(geometry_esfera, material_2);
sphere.position.x = 2
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(6, 6);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    // wireframe: true
});
const geometryCilindro = new THREE.CylinderGeometry( 0.25, 0.25, 1, 32 ); 
const materialCilindro = new THREE.MeshPhongMaterial( {color: 808080,
// wireframe:true
} ); 
const cilindro = new THREE.Mesh( geometryCilindro, materialCilindro ); scene.add( cilindro );
cilindro.position.x = -2
scene.add(cilindro)

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;

scene.add(plane);

window.addEventListener
    ('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }, false)

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder('Circle')
cubeFolder.add(cube.scale, 'x', -5, 5)
cubeFolder.add(cube.scale, 'y', -5, 5)
cubeFolder.add(cube.scale, 'z', -5, 5)
cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

function animate () {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    controls.update()
    render()
    stats.update()
}

function render () {
    renderer.render(scene, camera)
}

animate()