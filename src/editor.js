export const EditorStatus = {
  release: 'release',
  selectBuffer: 'editing buffer',
  selectPoint: 'editing point'
}

export const initialEditorState = {
  status: EditorStatus.release,
  numberOfQuads: 3,
  editingQuad: 0,
  editingPoint: 0
}

export const updateEditorState = (state, key, mouse) => {
  let { status, numberOfQuads, editingQuad, editingPoint } = state
  if (key) {
    if (key > 0) {
      if (status === EditorStatus.release) {
        if (key <= numberOfQuads) {
          status = EditorStatus.selectBuffer
          editingQuad = parseInt(key)
        }
      } else if (status === EditorStatus.selectBuffer) {
        if (key <= 4) {
          status = EditorStatus.selectPoint
          editingPoint = parseInt(key)
        }
      }
    }
  } else if (mouse) {
    status = EditorStatus.release
    editingQuad = 0
    editingPoint = 0
  }

  return {
    editor: {
      status: status,
      numberOfQuads: numberOfQuads,
      editingQuad: editingQuad,
      editingPoint: editingPoint
    }
  }
}
