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
}

export function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)

  // low band 40Hz-120Hz
  // lowMid band 140Hz-400Hz
  // mid band 400Hz-2.6kHz
  fft = new p5.FFT()
  peakDetect = new p5.PeakDetect(20, 20000, 0.2)
  mic = new p5.AudioIn()
  mic.connect(fft)
  // mic.start()

  const windowRatio = windowWidth / windowHeight
  const bufferWidth = windowWidth / 6
  const bufferHeight = bufferWidth / windowRatio

  return {
    fps: 0,
    text: '',
    peak: false,
    torusSize: 80,
    bufferWidth: bufferWidth,
    bufferHeight: bufferHeight,
    texQuads: [
      {
        editingPoint: 0,
        texture: createGraphics(windowWidth, windowHeight, WEBGL),
        p0: { x: 0, y: 0 },
        p1: { x: bufferWidth, y: 0 },
        p2: { x: bufferWidth, y: bufferHeight },
        p3: { x: 0, y: bufferHeight }
      }
    ],
    editor: {
      editingQuad: 0
    }
  }
}

export function update(state) {
  fft.analyze()
  peakDetect.update(fft)

  return {
    ...state,
    fps: round(frameRate()),
    peak: peakDetect.isDetected
  }
}

export function draw(state) {
  background(0)
  drawFPS(state)

  // Quad 1
  drawTorus(state.texQuads[0].texture, state)
  drawTexQuad(state.texQuads[0])

  // Quad 2
  // drawTexQuad(state.texQuads[1])
}

export function windowResized(state) {
  resizeCanvas(windowWidth, windowHeight)
}

export function keyPressed(state) {
  if (keyCode == 'e') {
    editingQuad > -1 ? editingQuad = 0 : editingQuad = -1
  }

  // Edit mode is active
  if (editingQuad > -1) {
    if (keyCode == '1') {
      editingQuad = 0
    }
  }

  return {
    ...state,
    editor: {
      editingQuad: editingQuad
    }
  }
}

/**
 * User
 */

function drawTexQuad(params) {
  fill(255, 0, 0)
  !params.isEditing && texture(params.texture)

  quad(
    params.p0.x,
    params.p0.y,
    params.p1.x,
    params.p1.y,
    params.p2.x,
    params.p2.y,
    params.p3.x,
    params.p3.y
  )
}

function drawTorus(buffer, state) {
  buffer.push()
  buffer.background(0)
  buffer.translate(0, 0, 0)
  buffer.rotateZ(frameCount * 0.01)
  buffer.rotateX(frameCount * 0.01)
  buffer.rotateY(frameCount * 0.01)
  buffer.normalMaterial()
  buffer.torus(state.torusSize, state.torusSize / 4)
  buffer.pop()
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
