/**
 * @func 手动绘制一个Geometry
 * @aim 本文核心
 * （1）介绍和认识geometry的Attributes属性：法相量normal，顶点位置：position，uv坐标
 * （2）利用JS循环手动绘制一个看起来较为炫酷的场景案例
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)

// 利用最基础的BufferGeometry，结合顶点定义，手动绘制集几何体
const geometry = new THREE.BufferGeometry()
/**
 * @func 定义点数组，绘制一个矩形片
 * @desc 
 * （1）threeJs绘制一个面需要由一个三角形构成，如一个矩形面就是由两个三角形拼接而来
 * （2）每一个三角形有三个顶点，每一个顶点由x、y、z三个坐标轴决定，因此一个三角形需要3 * 3 = 9个数值构成
 */
const vertices = new Float32Array([
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1
])
// 用点数组绘制几何体
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)) // 每3个作为一个坐标
console.log(geometry)

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
 * @func 动画效果，循环渲染
 */
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera) // render to viewport
}

animate()