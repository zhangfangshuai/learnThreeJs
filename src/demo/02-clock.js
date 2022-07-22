/**
 * @func 时钟
 * @desc 利用时钟更优雅的执行动画
 */


import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()
// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)

// Objects = geometry + material
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)

// object add to scene
scene.add(cube)

// Renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
scene.add(axesHelper)

/**
 * @func 设置时钟，利用时钟更优雅的执行动画
 * @desc getDelta() 会获取到上次渲染时的时间到本次渲染时时间的间隔。
 */
const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)
    
    const speed = 1

    // let time = clock.getElapsedTime() // 获取自启动时钟后的秒数
    let dalteTime = clock.getDelta() // 获取两帧之间的时间

    cube.position.y += speed * dalteTime
    if (cube.position.y > 5) {
        cube.position.y = 0
    }
    // render to viewport
    renderer.render(scene, camera)
}

animate()
