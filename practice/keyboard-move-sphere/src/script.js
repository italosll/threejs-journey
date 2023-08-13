import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'

THREE.ColorManagement.enabled = false

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg")

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Point Light
const pointLight = new THREE.PointLight(0xff9000,0.5,10,2)
pointLight.position.set(0,1,-2)
pointLight.lookAt(0,0,0)
scene.add(pointLight)

// rectLight
function createRectLight(color,position){
    const width = 2
    const height = 3
    const intensity = 1
    
    const redRectLight = new THREE.RectAreaLight(color, intensity,width,height);
    redRectLight.position.set(position.x,position.y,position.z)
    redRectLight.lookAt(0,0,0)
    scene.add(redRectLight)

    const rectLightHelper = new RectAreaLightHelper(redRectLight)
    redRectLight.add(rectLightHelper)
 

const directionalLight = new THREE.DirectionalLight(color, 0.1)
directionalLight.position.set(position.x,position.y,position.z)
scene.add(directionalLight)
}
RectAreaLightUniformsLib.init();

createRectLight(0xff0000,{x:2,y:1,z:2})
createRectLight(0x00ff00,{x:0,y:1,z:2})
createRectLight(0x0000ff,{x:-2,y:1,z:2})


/**
 * Materials
 */
const planeMaterial = new THREE.MeshStandardMaterial({roughness:0.5,metalness:0.7})
const sphereMaterial = new THREE.MeshStandardMaterial({color:0xffffff,roughness:0,metalness:0})
 
gui.add(planeMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(planeMaterial, 'roughness').min(0).max(1).step(0.001)
gui.add( planeMaterial,'wireframe')
gui.add( sphereMaterial,'wireframe')
/**
 * Objects
*/
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    sphereMaterial
    )
    

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    planeMaterial
    )
    plane.rotation.x = - Math.PI * 0.5
    plane.position.y = - 0.5
    plane.receiveShadow = true
        
 
scene.add(sphere, plane)
 

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({color:0x000000, alphaMap: simpleShadow, transparent:true}),
)
sphereShadow.position.y = -0.49
sphereShadow.rotation.x=Math.PI/180 * -90
  
gui.add(sphereShadow.position, 'y').min(0).max(10).step(0.5 )
gui.add(sphereShadow.position, 'x').min(0).max(10).step(0.5 )
gui.add(sphereShadow.position, 'z').min(0).max(10).step(0.5 )


const sphereShadowScaleUnity  =(disnteceOfPlane)=> ( disnteceOfPlane * 0.8) + 0.6

const scaleUnit= sphereShadowScaleUnity(sphere.position.y)
sphereShadow.scale.set( scaleUnit,scaleUnit,scaleUnit)
scene.add(sphereShadow)
 
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}





window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()


    box.update()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Font
 */
const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/inter_regular.typeface.json',
    (font)=>{
        const textGeometry = new TextGeometry("Hello world!",{
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
})
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const text = new THREE.Mesh(textGeometry,sphereMaterial)
        text.rotation.y = Math.PI 
        
        text.position.y = 1
        scene.add(text)

    }
)


 

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
 
camera.position.z = -10
camera.position.y = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Animate
 */
 

const mousePosText = document.getElementById('mouse-pos');

function moveForward(){
    sphere.position.z = sphere.position.z+0.1;
    sphereShadow.position.z = sphere.position.z
    console.log("pra frente")
    mousePosText.textContent = ` W `;
}

function movebackward(){
    sphere.position.z = sphere.position.z-0.1
    sphereShadow.position.z = sphere.position.z
    console.log("pra trás")
    mousePosText.textContent = ` S `;

}

function moveLeft(){
    sphere.position.x = sphere.position.x+0.1
    sphereShadow.position.x = sphere.position.x
    console.log("pra esquerda")
    mousePosText.textContent = ` A `;

}

function moveRight(){
    sphere.position.x = sphere.position.x-0.1
    sphereShadow.position.x = sphere.position.x
    console.log("pra direita")
    mousePosText.textContent = ` D `;

}

function setCastedShadowOfSphereOnPLane(){
    const dynamicUnit = sphereShadowScaleUnity(sphere.position.y)
    sphereShadow.scale.set( dynamicUnit,dynamicUnit,dynamicUnit)
    // sphereShadow.material.opacity = (1 - sphere.position.y + 0.4) * 0.5 
}

function Jump(){
    sphere.position.y = sphere.position.y+0.5;
    setCastedShadowOfSphereOnPLane()
    console.log("Cima")
    mousePosText.textContent = ` Espaço `;
}

function fall(){
    sphere.position.y = 0;
    setCastedShadowOfSphereOnPLane()
    console.log("Baixo")
}



window.addEventListener("keyup",(event)=>{
    switch(event.key){
        case " ":  { fall(); break;}

    }
})

window.addEventListener("keydown",(event)=>{
    switch(event.key){
        case "w":  {moveForward(); break;}
        case "a":  {moveLeft(); break;}
        case "s":  {movebackward(); break;}
        case "d":  {moveRight(); break;}
        case " ":  {Jump();break;}

    }
})

function apagarTeclaPressionada(){
    mousePosText.textContent = ` `;
 
}  

window.addEventListener("keyup",(event)=>{
    switch(event.key){
        case "w":  {apagarTeclaPressionada(); break;}
        case "a":  {apagarTeclaPressionada(); break;}
        case "s":  {apagarTeclaPressionada(); break;}
        case "d":  {apagarTeclaPressionada(); break;}
        case " ":  {apagarTeclaPressionada();break;}

    }
})
const tick = () =>
{
    
    
    // Render
    renderer.render(scene, camera)
    // Update controls
    controls.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()