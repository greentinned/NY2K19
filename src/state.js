/**
 * State
 */

export let state = {}

export const setState = newState => {
  state = {
    ...state,
    ...newState
  }
}

export const saveState = (state, download) => {
  let a = document.createElement('a')
  let file = new Blob([JSON.stringify(state)], { type: 'text/plain' })
  a.href = URL.createObjectURL(file)
  if (download) {
    a.download = 'state.json'
  } else {
    a.target = '_blank'
  }
  a.click()
}

export const loadState = cb => {
  const user = 'greentinned'
  const gistHash = '144f80e88e4ba0b3ca7572a67e65725d'
  const file = 'ny2k19State.json'
  const commitHash = window.location.hash.replace('#', '/')
  const url = `https://gist.githubusercontent.com/${user}/${gistHash}/raw${
    commitHash ? commitHash : ''
  }/${file}`

  fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      cb(JSON.parse(JSON.stringify(json)))
    })
}
