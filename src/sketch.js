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
let EditorStatus = {
  release: 'release',
  selectBuffer: 'select buffer',
  selectPoint: 'select point'
}

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

  // Tex Quads
  const windowRatio = windowWidth / windowHeight
  const bufferWidth = windowWidth / 6
  const bufferHeight = bufferWidth / windowRatio

  let buffer0 = {
    buffer: createGraphics(windowWidth, windowHeight, WEBGL),
    p0: { x: 0, y: 0 },
    p1: { x: bufferWidth, y: 0 },
    p2: { x: bufferWidth, y: bufferHeight },
    p3: { x: 0, y: bufferHeight }
  }

  return {
    fps: 0,
    peak: false,
    buffers: [buffer0],
    editor: {
      status: EditorStatus.release,
      editingQuad: -1,
      editingPoint: -1
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

  // Buffer 1
  drawBuffer(state.buffers[0], state.editor, buffer => {
    drawTorus(buffer, state)
  })
}

export function windowResized(state) {
  resizeCanvas(windowWidth, windowHeight)
}

export function keyPressed(state) {
  if (keyCode === 49) {
    if (state.editor.status === EditorStatus.release) {
      state.editor.status = EditorStatus.selectBuffer
    } else if (state.editor.status === EditorStatus.selectBuffer) {
      state.editor.status = EditorStatus.selectPoint
    }
  }

  return {
    ...state
  }
}

export function mousePressed(state) {
  state.editor.status = EditorStatus.release
  return {
    ...state
  }
}

/**
 * User
 */

function drawBuffer(params, editor, cb) {
  cb(params.buffer)

  fill(255, 0, 0)

  if (editor.status === EditorStatus.release) {
    texture(params.buffer)
  }

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
  buffer.torus(80, 80 / 4)
  buffer.pop()
}

function drawFPS(state) {
  push()
  fill(255)
  textFont(font)
  let x = -width / 2 + 10
  let y = -height / 2 + 20
  text(`FPS: ${state.fps}\nEDITOR: ${state.editor.status}`, x, y)
  pop()
}
