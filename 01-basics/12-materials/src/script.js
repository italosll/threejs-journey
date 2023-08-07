import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new lil.GUI()



/**
 * ImageLoader
 */
const loader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()



const doorColorTexture = loader.load('textures/door/color.jpg')
const doorAlphaTexture = loader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = loader.load('textures/door/ambientOcclusion.jpg')

const doorHeightTexture = loader.load('textures/door/height.jpg')
const doorMetalnessTexture = loader.load('textures/door/metalness.jpg')
const doorNormalTexture = loader.load('textures/door/normal.jpg')
const doorRoughnessTexture = loader.load('textures/door/roughness.jpg')

const gradient1Texture = loader.load('textures/gradients/3.jpg')
const gradient2Texture = loader.load('textures/gradients/5.jpg')


const matCapTexture = loader.load('textures/matcaps/8.png')
const gradientTexture = loader.load('textures/gradients/3.jpg')

 

const environmenttMapTexture = cubeTextureLoader.load(
    [
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/ny.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg',
    ]
)

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// material.map = matCapTexture
// material.color= new THREE.Color('red')
// material.wireframe = true
// material.transparent=true
// material.opacity = 0.2
// const material = new THREE.MeshMatcapMaterial( )
// material.matcap = matCapTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmenttMapTexture
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5,0,5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material,'metalness').min(0).max(1).step(0.0001)
gui.add(material,'roughness').min(0).max(1).step(0.0001)
gui.add(material,'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material,'displacementScale').min(0).max(1).step(0.0001)
// gui.add(material,'aoMapIntensity').min(0).max(10).step(0.0001)


const ambientLight = new THREE.AmbientLight('white',0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight('white',0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(pointLight)


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,64,64),
    material,
)
sphere.position.x= -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,100,100),
    material
)


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5,0.2,64,30),
    material
    )
torus.position.x= 1.5
    
scene.add(sphere,plane,torus)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
 
 
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

 
    //  Update objects
    // sphere.rotation.y=0.1* elapsedTime
    // plane.rotation.y=0.1* elapsedTime
    // torus.rotation.y=0.1* elapsedTime

    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()