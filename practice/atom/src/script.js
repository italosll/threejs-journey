import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const parameters = {}
parameters.count = 40
parameters.a = 9
parameters.b = 4
parameters.color = '#41b2f8'




// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')


/**
 * Particles
 */
let geometry = null
let material = null
let points = null
let ellipse1 = null
let ellipse2 = null
let ellipse3 = null


let sphereGeometry = new THREE.SphereGeometry( 2, 32, 16 ); 
let sphereGeometry1 = new THREE.SphereGeometry( 0.4, 32, 16 ); 

let sphereMaterial = new THREE.MeshBasicMaterial( { color:parameters.color } ); 
let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial ); 
let sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial ); 
 



function generateElipse(){

    // Destroy existing elipse
    if(points !== null){
        geometry.dispose()
        material.dispose()
        sphereGeometry.dispose()
        sphereGeometry1.dispose()

        sphere.material.dispose()
        scene.remove(ellipse1,ellipse2,ellipse3,sphere,sphere1)
    }

    const curve = new THREE.EllipseCurve(
        0,  0,             
        parameters.a, parameters.b,            
        0,  2 * Math.PI,   
        false,             
        0                  
    );
    
      points = curve.getPoints( parameters.count );

 
      geometry = new THREE.BufferGeometry().setFromPoints( points );
      material = new THREE.LineBasicMaterial( { color:parameters.color, linewidth:100  } );
      ellipse1 = new THREE.Line( geometry, material );
      ellipse2 = new THREE.Line( geometry, material );
      ellipse3 = new THREE.Line( geometry, material );

    
      ellipse1.rotation.x = Math.PI/2
      ellipse2.rotation.set( Math.PI / 2, 1, 0 )
      ellipse3.rotation.set( Math.PI / -2, 1, 0 )


 
      // obter os pontos da elipse
      let gp = ellipse1.geometry.attributes.position;
      let wPos = [];
      for(let i = 0;i < gp.count; i++){
          let p = new THREE.Vector3().fromBufferAttribute(gp, i); // set p from `position`
          ellipse1.localToWorld(p); // p has wordl coords
          wPos.push(p);
      }
      
            console.log(wPos)
 

    
      


      const axesHelper = new THREE.AxesHelper( 5 );
      scene.add(ellipse1,ellipse2,ellipse3,sphere,axesHelper)
    }
    
    generateElipse()


gui.add(parameters,"count").min(20).max(200).step(20).onFinishChange(generateElipse)
gui.add(parameters,"a").min(1).max(56).onFinishChange(generateElipse)
gui.add(parameters,"b").min(1).max(56).onFinishChange(generateElipse)
gui.addColor(parameters,"color").onFinishChange(generateElipse)



// const planeGeometry = new THREE.PlaneGeometry( 1, 1 );
// const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( planeGeometry, planeMaterial );
// scene.add( plane );
 

 

  

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

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
camera.position.y = 10
camera.position.x = 10


 
 
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update particles
    // for(let i=0; i< count;i++){
    //     const i3 = i * 3

    //     const x =    particlesGeometry.attributes.position.array[i3] 
    //     particlesGeometry.attributes.position.array[i3 +1] = Math.sin(elapsedTime +x)

    // }
    // particlesGeometry.attributes.position.needsUpdate = true

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()