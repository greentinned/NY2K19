import {
  preload,
  setup,
  update,
  draw,
  windowResized,
  keyPressed
} from './sketch'

/**
 * State
 */

let state = {}

/**
 * Lifecycle
 */

window.preload = preload

window.setup = () => {
  state = setup()
}

window.draw = () => {
  state = update(state)
  draw(state)
}

window.windowResized = () => {
  state = update(state)
  windowResized(state)
}

window.keyPressed = () => {
  state = update(state)
  keyPressed(state)
}
