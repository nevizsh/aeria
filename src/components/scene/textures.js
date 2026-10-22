import { CanvasTexture } from 'three'

function creerTextureDouce() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const degrade = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  degrade.addColorStop(0, 'rgba(255, 255, 255, 1)')
  degrade.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = degrade
  ctx.fillRect(0, 0, 64, 64)
  return new CanvasTexture(canvas)
}

function creerTextureLavis() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const vertical = ctx.createLinearGradient(0, 0, 0, 64)
  vertical.addColorStop(0, 'rgba(255, 255, 255, 1)')
  vertical.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = vertical
  ctx.fillRect(0, 0, 64, 64)
  const horizontal = ctx.createLinearGradient(0, 0, 64, 0)
  horizontal.addColorStop(0, 'rgba(255, 255, 255, 0)')
  horizontal.addColorStop(0.2, 'rgba(255, 255, 255, 1)')
  horizontal.addColorStop(0.8, 'rgba(255, 255, 255, 1)')
  horizontal.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = horizontal
  ctx.fillRect(0, 0, 64, 64)
  return new CanvasTexture(canvas)
}

export const TEXTURE_DOUCE = creerTextureDouce()
export const TEXTURE_LAVIS = creerTextureLavis()
