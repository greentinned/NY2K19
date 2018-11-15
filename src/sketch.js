import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

/**
 * Global
 */

let font
let sound
let mic
let fft
let peakDetect

/**
 * Lifecycle
 */

export function preload() {
  font = loadFont('assets/Akrobat-Bold.otf')
  fft = new p5.FFT()
  peakDetect = new p5.PeakDetect(20, 20000, 0.2)
  mic = new p5.AudioIn()
  mic.connect(fft)
  mic.start()
}

export function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  // sound.play()
  return {
    fps: 0,
    text: 'ХУЙ',
    peak: false,
    torusSizeMin: 19,
    torusSize: 19
  }
}

export function update(state) {
  fft.analyze()
  peakDetect.update(fft)

  return {
    ...state,
    fps: round(frameRate()),
    textColor: color(
      sin(frameCount * 0.03) * 255,
      sin(frameCount * 0.02) * 255,
      sin(frameCount * 0.01) * 255
    ),
    text: `${round(state.torusSize)}`,
    peak: peakDetect.isDetected,
    torusSize: peakDetect.isDetected
      ? 80
      : lerp(state.torusSize, state.torusSizeMin, 0.1)
  }
}

export function draw(state) {
  background(50)
  drawFPS(state)
  drawText(state)
  drawTorus(state)
}

export function windowResized(state) {
  resizeCanvas(windowWidth, windowHeight)
}

/**
 * User
 */

function drawTorus(state) {
  push()
  translate(width / 4, -height / 4, 0)
  rotateZ(frameCount * 0.01)
  rotateX(frameCount * 0.01)
  rotateY(frameCount * 0.01)
  normalMaterial()
  torus(state.torusSize, state.torusSize / 4)
  pop()
}

function drawText(state) {
  push()
  fill(state.textColor)
  textFont(font, 148)
  let tw = textWidth(state.text)
  let x = 0 - tw / 2
  let y = 0 + 148 / 2
  rotateY(frameCount * 0.01)
  text(state.text, x, y)
  pop()
}

function drawFPS(state) {
  push()
  fill(255)
  textFont(font)
  let x = -width / 2 + 10
  let y = -height / 2 + 20
  text(`FPS: ${state.fps}`, x, y)
  pop()
}
