import 'p5'
import { preload, setup, update, draw, windowResized } from './sketch'

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
  draw(update(state))
}

window.windowResized = () => {
  windowResized(update(state))
}
