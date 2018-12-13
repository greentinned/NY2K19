import { RandomEventType } from './randomEvent'

export const initialHeadState = {
  xangle: 0,
  yangle: 145,
  xpos: 60,
  destXangle: 0,
  animating: false,
  cooldown: 50,
  timer: 0
}

export const updateHeadState = (state, peak, peakCount, randomEvent) => {
  let { xangle, yangle, xpos, timer, cooldown, animating, destXangle } = state
  print(round(xangle))

  // Кивок головой
  let speed = 0.2
  if (round(xangle) === 0) {
    destXangle = 15
  } else if (round(xangle) === 15) {
    speed = 0.05
    destXangle = 0
  }

  // Поворот головы
  let destYangle = randomEvent === RandomEventType.left ? 145 : 225

  // Смещение головы
  let destXpos = randomEvent === RandomEventType.left ? 60 : -60

  return {
    head: {
      xangle: lerp(state.xangle, destXangle, speed),
      yangle: lerp(state.yangle, destYangle, 0.05),
      xpos: lerp(state.xpos, destXpos, 0.05),
      destXangle: destXangle,
      animating: animating,
      cooldown: cooldown,
      timer: timer
    }
  }
}

export const drawHead = (state, buffer, model) => {
  const { xangle, yangle, xpos } = state
  buffer.push()
  buffer.translate(xpos, 0, 20)
  buffer.scale(1.8, 1.8)
  buffer.rotateY(radians(yangle) + radians(sin(frameCount * 0.05) * 4))
  buffer.rotateX(radians(180) + radians(xangle))
  buffer.normalMaterial()
  buffer.model(model)
  buffer.pop()
}
