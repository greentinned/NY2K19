import { EditorStatus } from './editor'

export const initialBuffersState = (numberOfQuads, width, height) => {
  let quads = []

  const quadWidth = width / numberOfQuads

  for (let i = 0; i < numberOfQuads; i++) {
    const origin = {
      x: i * quadWidth,
      y: 0
    }
    const quad = {
      points: [
        { x: origin.x, y: origin.y },
        { x: origin.x + quadWidth, y: origin.y },
        { x: origin.x + quadWidth, y: height },
        { x: origin.x, y: height }
      ]
    }
    quads.push(quad)
  }

  return {
    quads: quads
  }
}

export const updateBuffersState = (
  state,
  editingStatus,
  editingQuad,
  editingPoint
) => {
  let { quads } = state
  if (editingStatus === EditorStatus.selectPoint) {
    let currentQuad = quads[editingQuad - 1]
    if (currentQuad) {
      let currentPoint = currentQuad.points[editingPoint - 1]
      if (currentPoint) {
        currentPoint.x = mouseX
        currentPoint.y = mouseY
        currentQuad.points[editingPoint - 1] = currentPoint
      }
    }
    quads[editingQuad - 1] = currentQuad
  }

  return {
    buffers: {
      quads: quads
    }
  }
}

export const drawBuffer = (buffer, quadPoints, isEditing, cb) => {
  push()
  translate(-width / 2, -height / 2)
  buffer.background(0)
  cb(buffer)
  fill(255, 0, 0)

  if (!isEditing) {
    texture(buffer)
  }

  quad(
    quadPoints[0].x,
    quadPoints[0].y,
    quadPoints[1].x,
    quadPoints[1].y,
    quadPoints[2].x,
    quadPoints[2].y,
    quadPoints[3].x,
    quadPoints[3].y
  )
  pop()
}
