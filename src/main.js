import {
  preload,
  setup,
  update,
  draw,
  windowResized,
  keyPressed,
  mousePressed
} from './sketch'

/**
 * Lifecycle
 */

window.preload = preload
window.setup = setup

window.draw = () => {
  update()
  draw()
}

window.windowResized = windowResized
window.keyPressed = keyPressed
window.mousePressed = mousePressed
