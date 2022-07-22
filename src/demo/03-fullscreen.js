/**
 * @func 进入全屏模式
 * @aim 本文核心
 * （1）全屏模式
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 核心元素一：Scene
const scene = new THREE.Scene()
// 核心元素二：Camera - 负责观察场景及场景中的物体对象
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 6)

// 核心元素三：Objects = Mesh(geometry, material)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)

// object add to scene
scene.add(cube)

// 核心元素四：Renderer - 将内容渲染到dom的canvas上
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 核心元素五：Controls - 使用户可操控Object3D
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 给控制器增加阻尼、惯性 - 需在动画循环里调用update方法

// 添加辅助坐标轴
const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
scene.add(axesHelper)

/**
 * @func 动画效果，循环渲染
 */
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.y += 0.03
    renderer.render(scene, camera) // render to viewport
}
animate()

/**
 * @func 跟随屏幕resize
 * （1）更新摄像头
 * （2）更新渲染器
 */
window.addEventListener('resize', () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix()

    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})

/**
 * @func 监听用户双击开启全屏展示，再次双击取消全屏
 * @desc document.fullscreenElement指的是当前全屏的节点，全屏状态下有且仅有一个，非全屏状态下，值为null
 */
window.addEventListener('dblclick', () => {
    let fullscreen = document.fullscreenElement
    if (!fullscreen) {
        // 指定画布对象为全屏对象
        renderer.domElement.requestFullscreen()
    } else {
        // 取消当前全屏元素，使用document
        document.exitFullscreen()
    }
})
