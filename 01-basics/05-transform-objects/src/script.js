import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)
 

/**
 * Position
 */
// mesh.position.set(0.7,-0.6,1)

/**
 * Objects
 */

const group =  new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000})
)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x00ff00})
)

 

cube2.position.x= -1.5

const cube3= new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x0000ff})
)

group.add(cube1,cube2,cube3)

cube3.position.x= 1.5

group.position.y = 1


/**
 * AxesHelper
 */
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)


/**
 * Scale
 */
// mesh.scale.set(2,0.5,0.5)

/**
 * Rotate
 */

// mesh.rotation.reorder('YXZ')
// mesh.rotation.x=Math.PI * 0.25
// mesh.rotation.y=Math.PI * 0.25



/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

 

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)