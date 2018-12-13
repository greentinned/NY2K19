import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

import { drawDebug } from './debug'
import { state, setState, saveState, loadState } from './state'
import {
  initialRandomEventState,
  updateRandomEventState,
  RandomEventType
} from './randomEvent'
import { initialEditorState, updateEditorState, EditorStatus } from './editor'
import { initialHeadState, updateHeadState, drawHead } from './head'
import { initialLogoState, updateLogoState, drawLogo } from './logo'
import { initialBuffersState, updateBuffersState, drawBuffer } from './buffer'

/**
 * Global
 */

let canvas
let font
let sound
let mic
let fft
let peakDetect
let osBuffer
let osBuffer2
let pastFrame
let mosaicShader
let antinous
let nocheImage

/**
 * Lifecycle
 */

export function preload() {
  font = loadFont('assets/Akrobat-Bold.otf')
  antinous = loadModel('assets/antinous/model.obj', true)
  nocheImage = loadImage('assets/logo/noche.png')

  mosaicShader = loadShader(
    'assets/shaders/mosaic.vert',
    'assets/shaders/mosaic.frag'
  )
}

export function setup() {
  noStroke()
  // low band 40Hz-120Hz
  // lowMid band 140Hz-400Hz
  // mid band 400Hz-2.6kHz
  fft = new p5.FFT()
  peakDetect = new p5.PeakDetect(40, 120, 0.8)
  mic = new p5.AudioIn()
  mic.connect(fft)
  mic.start()

  canvas = createCanvas(windowWidth, windowHeight, WEBGL)
  osBuffer = createGraphics(windowWidth / 3, windowHeight, WEBGL)
  osBuffer2 = createGraphics(windowWidth / 3, windowHeight, WEBGL)

  const randomEventState = initialRandomEventState(100, 1000)
  const buffersState = initialBuffersState(3, windowWidth, windowHeight)

  setState({
    fps: 0,
    peak: false,
    peakCount: 1,
    ...updateBuffersState(buffersState, 0, 0),
    ...updateEditorState(initialEditorState, false, false),
    ...updateRandomEventState(randomEventState, false, 1),
    ...updateHeadState(initialHeadState, false, 1, false),
    ...updateLogoState(initialLogoState, false, 1, false)
  })

  print(state)
}

export function update() {
  fft.analyze()
  peakDetect.update(fft)

  const peak = peakDetect.isDetected
  const peakCount = peak ? state.peakCount + 1 : state.peakCount

  setState({
    fps: round(frameRate()),
    peak: peak,
    peakCount: peakCount,
    ...updateBuffersState(
      state.buffers,
      state.editor.status,
      state.editor.editingQuad,
      state.editor.editingPoint
    ),
    ...updateRandomEventState(state.randomEvent, peak, peakCount),
    ...updateHeadState(state.head, peak, peakCount, state.randomEvent.type),
    ...updateLogoState(state.logo, peak, peakCount, state.randomEvent.type)
  })
}

export function draw() {
  background(0)

  // Trails
  // https://stardustjs.github.io/examples/p5js-integration/

  const isEditing = state.editor.status !== EditorStatus.release

  // Buffer 1
  drawBuffer(osBuffer, state.buffers.quads[0].points, isEditing, () => {
    drawLine(osBuffer, state, RandomEventType.left, { r: 0, g: 0, b: 255 })
  })

  // Buffer 2
  drawBuffer(osBuffer2, state.buffers.quads[1].points, isEditing, () => {
    drawLogo(state.logo, osBuffer2, nocheImage)
    drawHead(state.head, osBuffer2, antinous)
  })

  // Buffer 3
  drawBuffer(osBuffer, state.buffers.quads[2].points, isEditing, () => {
    drawLine(osBuffer, state, RandomEventType.right, { r: 255, g: 0, b: 255 })
  })

  drawDebug(state, font)
}

export function keyPressed() {
  setState({
    ...updateEditorState(state.editor, key, false)
  })

  if (key === 's') {
    saveState(state)
  }

  if (key === 'l') {
    loadState(json => {
      setState({
        buffers: json.buffers
      })
    })
  }
}

export function mousePressed() {
  setState({
    ...updateEditorState(state.editor, false, true)
  })

  if (getAudioContext().state !== 'running') {
    getAudioContext().resume()
  }
}

export function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

/**
 * User
 */

function drawLine(buffer, state, randomEvent, icolor) {
  var waveform = fft.waveform()

  const scolor =
    state.randomEvent.type === randomEvent
      ? icolor //{ r: 0, g: 0, b: 0 }
      : { r: 255, g: 255, b: 255 }

  buffer.push()
  buffer.noFill()

  if (state.randomEvent.type === randomEvent) {
    buffer.rotateZ(frameCount * 0.01)
  }

  buffer.beginShape()
  buffer.stroke(osBuffer.color(scolor.r, scolor.g, scolor.b, 128))
  buffer.strokeWeight(2)
  for (var i = 0; i < waveform.length; i++) {
    var x = map(waveform[i], -1, 1, -buffer.width / 3, buffer.width / 3)
    var y = map(i, 0, waveform.length, -buffer.height / 2, buffer.height)
    buffer.vertex(x, y)
  }
  buffer.endShape()

  if (state.peak) {
    buffer.beginShape()
    buffer.stroke(osBuffer.color(scolor.r, scolor.g, scolor.b))
    buffer.strokeWeight(8)
    for (var i = 0; i < waveform.length; i++) {
      var x = map(waveform[i], -1, 1, -buffer.width / 3, buffer.width / 3)
      var y = map(i, 0, waveform.length, -buffer.height / 2, buffer.height)
      buffer.vertex(x, y)
    }
    buffer.endShape()
  }

  buffer.pop()
}
