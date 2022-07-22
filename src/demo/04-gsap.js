/**
 * @func 动画库
 * @desc 避免人工执行和计算复杂的物体运动轨迹
 * @aim: 本文核心
 * （1）介绍gsap.to的用法
 * （2）npm网址：https://www.npmjs.com/package/gsap
 * （3）官网介绍: https://greensock.com/docs/v3/GSAP/gsap.to()
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import gsap from 'gsap'

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

const controls = new OrbitControls(camera, renderer.domElement)
// 给控制器增加阻尼，让控制器更有真实效果 - 设置完成，必须在动画循环里调用update方法
controls.enableDamping = true

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
scene.add(axesHelper)

/**
 * @func 设置动画gsap.to(), 动画前往目标
 * @param target 要控制动画的对象
 * @param vars 配置动画的属性
 * @func 回调函数如下
 * onComplete：动画完成时调用
 * onCompleteParams: 动画完成回调的入参
 * onStart：动画开始时调用
 * onUpdate：每次动画更新时调用（在动画处于活动状态时每帧调用）
 * onRepeat：每次动画重复时调用一次
 * onReverseComplete：动画反转后再次到达其起点时调用
 * */
const gsapAnimate = gsap.to(
    cube.position, // 控制物体对象产生动画的属性
    {
        x: 5, // 运动目标地址
        duration: 5, 
        ease: 'power1.inOut',
        repeat: -1, // 重复次数，-1表示无限次循环
        yoyo: true, // 往返运动
        delay: 1, // 延迟运动秒数
        onStart: () => {
            console.log('动画开始');
        },
        onComplete: () => {
            console.log('动画完成');
        }
    }
)
gsap.to(cube.position, {y: 4, duration: 4, repeat: -1, yoyo: true})
gsap.to(cube.position, {z: 4, duration: 4, repeat: -1, yoyo: true})
gsap.to(cube.rotation, {x: 2 * Math.PI, duration: 5, repeat: -1})

/**
 * tween.pause(); 暂停
 * tween.resume(); 恢复
 * tween.reverse(); 反向播放
 * tween.restart(); 重新开始
 * tween.seek(0.5); 跳到0.5s
 * tween.progress(0.25); 跳到4分之1处
 * tween.timeScale(0.5); 速度减慢
 * tween.timeScale(2); 速度翻倍
 * tween.kill(); 删除动画
 */
window.addEventListener('click', () => {
    if(gsapAnimate.isActive()) {
        gsapAnimate.pause()
    } else {
        gsapAnimate.resume()
    }
})
window.addEventListener('dblclick', () => {
    gsapAnimate.kill()
})

function render() {
    controls.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}

render()
