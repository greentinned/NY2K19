import { RandomEventType } from './randomEvent'

export const LogoSide = {
  left: 0,
  right: 1
}

export const initialLogoState = {
  side: LogoSide.left
}

export const updateLogoState = (state, peak, peakCount, randomEvent) => {
  let { side } = state

  side = randomEvent === RandomEventType.left ? LogoSide.left : LogoSide.right

  return {
    logo: {
      side: side
    }
  }
}

export const drawLogo = (state, buffer, img) => {
  let { side } = state
  const bufferWidth = buffer.width
  const bufferHeight = buffer.height

  const imgRect = rectToFit(img.width, img.height, null, bufferHeight)
  let imgX
  if (side === LogoSide.left) {
    imgX = -bufferWidth / 2 + imgRect.width / 2
  } else {
    imgX = bufferWidth / 2 - imgRect.width / 2
  }
  buffer.texture(img)
  buffer.push()
  buffer.translate(imgX, 0, 0)
  buffer.plane(imgRect.width, imgRect.height)
  buffer.pop()
}

export const rectToFit = (srcWidth, srcHeight, destWidth, destHeight) => {
  const srcRatio = srcWidth / srcHeight
  let dWidth = srcWidth
  let dHeight = srcHeight
  if (destWidth) {
    dWidth = destWidth
    dHeight = destWidth / srcRatio
  } else if (destHeight) {
    dWidth = destHeight * srcRatio
    dHeight = destHeight
  }

  return {
    width: dWidth,
    height: dHeight
  }
}
