import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity

            child.castShadow = true
            child.receiveShadow = true
        }
    })
 
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 0.3
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(1)
    .step(0.001)
    .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/nuppgin_render2.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    // scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff',1)
directionalLight.position.set(2.5,10,1)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ')


// Shadows
directionalLight.castShadow = false
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(512,512)
directionalLight.shadow.bias = - 0.002
directionalLight.shadow.normalBias = 0.03
gui.add(directionalLight, 'castShadow')

//Helper
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightHelper)

// Target
directionalLight.target.position.set(0,4,0)
directionalLight.target.updateWorldMatrix()

gui.add(directionalLight.shadow, 'normalBias').min(- 0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(- 0.05).max(0.05).step(0.001)

 


/**
 * Models
 */
// Helmet
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

// Hamburger

gltfLoader.load(
    '/models/nuppgin4.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.5, 0.5, 0.5)
        gltf.scene.scale.set(0.4, 0.4, 0.4)
        gltf.scene.position.set(0,0,0)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Floor
 */
const floorColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAORoughnessMetallnessTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8,8),
    new THREE.MeshStandardMaterial({
        map:floorColorTexture,
        normalMap:floorNormalTexture,
        aoMap:floorAORoughnessMetallnessTexture,
        roughnessMap:floorAORoughnessMetallnessTexture,
        metalnessMap:floorAORoughnessMetallnessTexture,

    })
)
floor.rotation.x = Math.PI * - 0.5
// scene.add(floor)

/**
 * Wall
 */
const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
const wallAORoughnessMetallnessTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8,8),
    new THREE.MeshStandardMaterial({
        map:wallColorTexture,
        normalMap:wallNormalTexture,
        aoMap:wallAORoughnessMetallnessTexture,
        roughnessMap:wallAORoughnessMetallnessTexture,
        metalnessMap:wallAORoughnessMetallnessTexture,

    })
)
wall.position.y = 4
wall.position.z = -4

// scene.add(wall)

/**
 * Renderer
 */



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
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 2, 10)
gui.add(camera, 'fov').min(0).max(300).step(10) .onChange(   camera.updateProjectionMatrix())

// camera.fov = 150
// console.log(camera.fov)
// scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMappingToneMapping

renderer.toneMappingExposure = 1.5

gui.add(renderer, 'toneMapping',{
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmicToneMapping: THREE.ACESFilmicToneMappingToneMapping,
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

// Phisically acurate lighting
renderer.useLegacyLights = false
gui.add(renderer, 'useLegacyLights')

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()
let previousTime = 0

/**
 * Animate
 */
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    // Update controls
    controls.update()

    if(scene.children[1]){
        scene.children[1].children[1].rotation.y += deltaTime*1;

        console.log(scene.children[1])
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()