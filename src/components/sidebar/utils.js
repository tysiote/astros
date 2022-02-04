export const isItemActive = (id, activeItem) => {
  if (!activeItem) {
    return !id
  }

  return id === activeItem
}

export const alterItemGroup = (id, items) => {
  const result = []

  items.forEach(item => {
    if (item.id === id && item.expanded !== undefined) {
      result.push({ ...item, expanded: !item.expanded })
    } else {
      result.push(item)
    }
  })

  return result
}
