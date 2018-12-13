export function drawDebug(state, font) {
  push()
  fill(255)
  textFont(font)
  let x = -width / 2 + 10
  let y = -height / 2 + 20
  text(
    `FPS: ${state.fps}\nEDITOR: ${state.editor.status}\nQUAD: ${
      state.editor.editingQuad
    }\nPOINT: ${state.editor.editingPoint}\nLOW: ${state.peak}\nLOW COUNT: ${
      state.peakCount
    }`,
    x,
    y
  )
  pop()
}
