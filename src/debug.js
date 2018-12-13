export function drawDebug(state, font) {
  push()
  fill(255)
  textFont(font)
  let x = -width / 2 + 10
  let y = -height / 2 + 20
  text(
    `FPS: ${state.fps}\nEDITOR: ${state.editor.status}\n \nLOW: ${
      state.beat.low
    }\nLOW COUNT: ${state.beat.lowCount}\n \nMID: ${
      state.beat.mid
    }\nMID COUNT: ${state.beat.midCount}\n \nHIGH: ${
      state.beat.high
    }\nHIGH COUNT: ${state.beat.highCount}\n \n KINDA BPM: ${round(
      state.beat.kindaBpm
    )}`,
    x,
    y
  )
  pop()
}
