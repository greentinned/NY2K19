/**
 * Global
 */

let font

/**
 * Lifecycle
 */

export function preload() {
  font = loadFont('assets/Akrobat-Bold.otf')
}

export function setup(state) {
  createCanvas(windowWidth, windowHeight, WEBGL)
  state = {
    fps: 0
  }
}

export function update(state) {
  state.fps = round(frameRate())
}

export function draw(state) {
  background(50)
  drawFPS(state)
}

export function windowResized(state) {
  resizeCanvas(windowWidth, windowHeight)
}

/**
 * User
 */

function drawFPS(state) {
  fill(255)
  textFont(font)
  let x = -width / 2 + 10
  let y = -height / 2 + 20
  text(`FPS: ${state.fps}`, x, y)
}
