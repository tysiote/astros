import { TICK_MS } from './constants'

export const createDots = ({ count, centerX, centerY }) => {
  const result = []

  for (let i = 0; i < count; i += 1) {
    result.push({
      x: centerX,
      y: centerY,
      speed: 0,
      target: { x: centerX, y: centerY },
      status: 'idle',
      cooldown: 0,
      acceleration: 0,
    })
  }

  return result
}

export const alterDots = ({ dots, width, height, clusters }) => {
  const result = []
  let newClusters = [...clusters]

  dots.forEach(dot => {
    const { cooldown, status, x, y, acceleration, target } = dot
    if (status === 'moving') {
      if (x === target.x && y === target.y) {
        result.push(dotArrived(dot))
      } else {
        result.push(moveDot({ ...dot, speed: getCurrentSpeed({ width, height, x, y, acceleration }) }))
      }
    } else if (status === 'idle') {
      if (cooldown > 0) {
        result.push(findNewIdleTarget({ width, height, dot }))
      } else {
        const { dot: newDot, clusters: alteredClusters } = findNewTarget({
          width,
          height,
          dot,
          clusters: newClusters,
          count: dots.length,
        })
        newClusters = alteredClusters
        result.push(newDot)
      }
    } else {
      result.push(dot)
    }
  })

  return { dots: result, clusters: newClusters }
}

const findNewIdleTarget = ({ width, height, dot }) => {
  const { x, y, cooldown } = dot
  const newX = Math.random() < 0.01 ? x + (Math.random() > 0.5 ? 1 : -1) : x
  const angle = Math.atan2(height / 2 - y, width / 2 - newX)
  const newY = Math.floor(Math.sin(angle) * height + height) / 2

  return { ...dot, x: newX, y: newY, cooldown: cooldown - TICK_MS > 0 ? cooldown - TICK_MS : 0 }
}

const findNewTarget = ({ width, height, dot, count, clusters = [] }) => {
  const { currentX, currentY } = dot
  const angle = Math.random() * Math.PI * 2
  let x = Math.floor(Math.cos(angle) * width + width) / 2
  let y = Math.floor(Math.sin(angle) * height + height) / 2
  const newClusters = [...clusters]

  if (newClusters.length && Math.random() > 0.9) {
    const index = Math.floor(Math.random() * newClusters.length)
    const { x: cx, y: cy, limit } = newClusters[index]
    if (limit > 0) {
      newClusters[index].limit += -1
      x = cx
      y = cy
    } else {
      const clusterCount = Math.floor(count / 100)
      const newCluster = createNewCluster({ width, height, limitMax: count / clusterCount })

      x = newCluster.x
      y = newCluster.y
      newClusters[index] = newCluster
    }
  }

  const acceleration = Math.random() + 0.5
  const status = 'moving'
  const speed = getCurrentSpeed({ width, height, x: currentX, y: currentY, acceleration })

  return { dot: { ...dot, acceleration, status, speed, target: { x, y } }, clusters: newClusters }
}

const getCurrentSpeed = ({ width, height, x, y, acceleration }) => {
  const dX = Math.abs(x - width / 2)
  const dY = Math.abs(y - height / 2)
  const r = width / 4
  if (Math.sqrt(dX * dX + dY * dY) < r) {
    return acceleration
  } else {
    return acceleration + 1
  }
}

const dotArrived = dot => {
  return {
    ...dot,
    speed: 0,
    acceleration: 0,
    status: 'idle',
    cooldown: Math.random() * 3000,
  }
}

const moveDot = dot => {
  const {
    x,
    y,
    target: { x: tx, y: ty },
    speed,
  } = dot
  const direction = Math.atan2(ty - y, tx - x)

  const newX = x + Math.cos(direction) * speed
  const newY = y + Math.sin(direction) * speed

  if (Math.abs(newX - tx) < speed && Math.abs(newY - ty) < speed) {
    return {
      ...dot,
      x: tx,
      y: ty,
    }
  }

  return { ...dot, x: newX, y: newY }
}

export const createClusters = ({ count, width, height }) => {
  const result = []
  const clusterCount = Math.floor(count / 100)

  for (let i = 0; i < clusterCount; i += 1) {
    result.push(createNewCluster({ width, height, limitMax: count / clusterCount }))
  }

  return result
}

const createNewCluster = ({ width, height, limitMax }) => {
  const {
    dot: {
      target: { x, y },
    },
  } = findNewTarget({ width, height, dot: {} })

  return { limit: Math.floor(Math.random() * limitMax) + 5, x, y }
}
