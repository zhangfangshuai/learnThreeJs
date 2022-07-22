/**
 * @aim 本文核心：
 * （1）介绍轨道控制器OrbitControls
 * （2）介绍物体的三种设置(运动)方式 position、scale、rotation
 * （3）利用帧刷新时间间隔更优雅的设置物体对象的运动
 * （4）更优雅的策略请使用时钟clock，见clock.js
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 设置场景和相机
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)

// 利用集合体和材质创建物体
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'yellow'})
const cube = new THREE.Mesh(geometry, material)

// 因为相机观察的是场景，因此把物体加入都场景中以便被看到
scene.add(cube)

// 创建渲染器，把物体渲染到dom上
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/**
 * @func 添加控制器，使得相机可以围绕目标进行轨道运动。--这样用户就可以控制旋转物体对象进行多角度观察
 */
const controls = new OrbitControls(camera, renderer.domElement)
// 给控制器增加阻尼，让控制器更有真实效果 - 设置完成，必须在动画循环里调用update方法
controls.enableDamping = true

// 添加辅助坐标轴
const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
scene.add(axesHelper)

/**
 * @func animate:循环渲染动画
 * @func 平移控制，或物体位置控制：object.position.set(x,y,z)
 * @func 缩放控制：object.scale.set(x,y,z)
 * @func 旋转控制：object.rotation.set(x,y,z)
 * @desc Math.PI = 180度，2 * Math.PI = 360度
 */
function animate() {
    requestAnimationFrame(animate)
    
    controls.update()
    cube.rotation.x += 0.05  // 旋转控制

    if (cube.position.x <= 5) {
        cube.position.x += 0.02  // 平移控制
        cube.scale.y += 0.01  // 缩放控制
    } else {
        cube.position.x = 0
        cube.scale.y = 1
    }
    renderer.render(scene, camera)
}

animate()

/**
 * @func 利用帧刷新时间间隔更优雅的设置物体对象的运动
 * @desc requestAnimationFrame 自带刷新时的时间参数
 * @param {Number} time 帧刷新时间
 */
function animateByFrame(time) {
    requestAnimationFrame(animateByFrame)

    const speed = 1
    let t = (time / 1000) % 5 // 时间。因为我们speed是1，行程是5，因此5s循环一次
    cube.position.x = t * speed
    if (cube.position.x > 5) {
        cube.position.x = 0
    }
    renderer.render(scene, camera)
}

// animateByFrame()
