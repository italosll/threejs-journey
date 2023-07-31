import * as THREE from 'three'
import {gsap} from 'gsap'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: '#ff00ff' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// Clock
const clock = new THREE.Clock()


gsap.to(mesh.position,{x:2, duration:1,delay:2})

const tick = () => {

    //CLock
    // const elapsedTime = clock.getElapsedTime()

    // Time
    // const currentTime = Date.now()
    // const deltaTime = currentTime - time
    // time = currentTime

    // console.log(deltaTime)

    // Update Objects
    // mesh.position.y  = Math.sin(elapsedTime)

    //Render
    
    window.requestAnimationFrame(tick)
    renderer.render(scene, camera)
}

tick()
