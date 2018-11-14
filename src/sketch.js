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

export function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)

  return {
    fps: 0,
    text: 'ХУЙ'
  }
}

export function update(state) {
  state.fps = round(frameRate())
  state.textColor = color(
    sin(frameCount * 0.03) * 255,
    sin(frameCount * 0.02) * 255,
    sin(frameCount * 0.01) * 255
  )
  return state
}

export function draw(state) {
  background(50)
  drawFPS(state)
  drawText(state)
}

export function windowResized(state) {
  resizeCanvas(windowWidth, windowHeight)
}

/**
 * User
 */

function drawText(state) {
  push()
  fill(state.textColor)
  textFont(font, 148)
  let x = 0
  let y = 0
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
