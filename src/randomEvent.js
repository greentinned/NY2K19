export const RandomEventType = {
  none: 'none',
  left: 'left',
  right: 'right'
}

export const initialRandomEventState = (minTime, maxTime) => {
  return {
    type: RandomEventType.none,
    timer: 0,
    minTime: minTime,
    maxTime: maxTime
  }
}

const minWait = 100
const maxWait = 1000

const getRandomEventType = types => {
  const randIndex = round(random(0, Object.keys(types).length - 1))
  return types[Object.keys(types)[randIndex]]
}

export const updateRandomEventState = (state, peak, peakCount) => {
  let { type, timer, minTime, maxTime } = state

  if (peak && frameCount >= timer) {
    type = getRandomEventType(RandomEventType)
    timer = frameCount + random(minTime, maxTime) // next timer
  }

  return {
    randomEvent: {
      ...state,
      type: type,
      timer: timer
    }
  }
}
