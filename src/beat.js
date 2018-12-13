export const initialBeatState = {
  low: false,
  lowCount: 0,
  mid: false,
  midCount: 0,
  high: false,
  highCount: 0,
  kindaBpm: 0,
  kindaBpmFrames: []
}

const kindaBpmMaxBeats = 16

export const updateBeatState = (state, low, mid, high) => {
  let { lowCount, midCount, highCount, kindaBpm, kindaBpmFrames } = state

  if (low) lowCount += 1
  if (mid) midCount += 1
  if (high) highCount += 1

  if (low) {
    kindaBpmFrames.push(frameCount)
  }

  if (kindaBpmFrames.length > kindaBpmMaxBeats) {
    kindaBpmFrames.shift()
    // kindaBpm = kindaBpmFrames[1] - kindaBpmFrames[0]

    let frameNumbers = []
    for (let i = 0; i < kindaBpmFrames.length; i++) {
      if (i > 0) {
        frameNumbers.push(kindaBpmFrames[i] - kindaBpmFrames[i - 1])
      }
    }
    // Не даем сильно разогнаться
    kindaBpm = min(
      round(frameNumbers.reduce((a, b) => a + b) / frameNumbers.length),
      60
    )
  }

  // Затормаживаемся если нет бита
  kindaBpm = lerp(kindaBpm, 0, 0.003)

  return {
    beat: {
      low: low,
      mid: mid,
      high: high,
      lowCount: lowCount,
      midCount: midCount,
      highCount: highCount,
      kindaBpm,
      kindaBpmFrames
    }
  }
}
