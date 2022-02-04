export const alterSeekStepBarWithPositions = (steps, width, diameter, offsetX) => {
  const result = [{ ...steps[0], x: offsetX + diameter / 2 }]

  for (let i = 1; i < steps.length - 1; i += 1) {
    result.push({ ...steps[i], x: offsetX + width / (steps.length - 1) })
  }

  result.push({ ...steps[steps.length - 1], x: offsetX + width - diameter / 2 })

  return result
}

export const getActiveItemByValue = (items, value) => items.filter(item => item.value === value)?.[0]

export const getNearbyStep = (steps, x, width) => {
  const stepWidth = width / (steps.length - 1)
  const result = Math.floor(x / stepWidth)
  const diff = x - result * stepWidth
  if (diff > stepWidth / 2) {
    return result + 1
  }

  return result
}
