/**
 * @func 引入dat.gui - 一个轻量级的UI界面控制库
 * @aim 本文核心
 * （1）介绍dat.gui的基础用法
 * （2）threeJs 官网也使用了该库作为控制器
 * （3）介绍网址：https://www.npmjs.com/package/dat.gui
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'dat.gui'
import gsap from 'gsap'

// 核心元素一：Scene
const scene = new THREE.Scene()
// 核心元素二：Camera - 负责观察场景及场景中的物体对象
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)

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
    renderer.render(scene, camera) // render to viewport
}

animate()

/**
 * @func 创建dat.GUI可视化控制面板
 */
const gui = new dat.GUI()

// 移动X轴
gui
    .add(cube.position, 'x')
    .min(0)
    .max(5)
    .step(0.01)
    .name('移动x轴')
    .onFinishChange(() => {
        console.log('修改完成');
    });

// 移动Y轴
gui
    .add(cube.position, 'y')
    .min(0)
    .max(5)
    .step(0.01)
    .name('移动y轴')
    .onFinishChange(() => {
        console.log('修改完成');
    });

// 移动Z轴
gui
    .add(cube.position, 'z')
    .min(0)
    .max(5)
    .step(0.01)
    .name('移动z轴')
    .onFinishChange(() => {
        console.log('修改完成');
    });


// 设置元素是否可见
gui.add(cube, 'visible').name('是否显示')





// 点击按钮触发某个事件（1）设置事件配置对象；（2）使用gui直接调用该函数
const event = {
    fn: () => {
        gsap.to(cube.position, { x: 5, duration: 3, yoyo: true, repeat: -1 })
    }
}
gui.add(event, 'fn').name('x轴运动')


/**
 * @func 设置文件夹配置面板
 */
const folder = gui.addFolder('设置立方体')
folder.add(cube.material, 'wireframe').name('透视立方体')

// 设置颜色（1）设置修改元素，（2）获取修改元素，运用到目标物体对象上
const colorPicker = {
    color: '#00ff00'
}
folder
    .addColor(colorPicker, 'color')
    .onChange(color => {
        cube.material.color.set(color)
    })
    .name('设置颜色');

