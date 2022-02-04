const correctSectionByPriority = section => {
  const result = []
  let lastOrderIndex = null
  section.forEach(item => {
    if (lastOrderIndex === item.order) {
      const lastItem = result[result.length - 1]
      console.log('group detected')
      console.log(lastItem.type, item, section[0])
      result[result.length - 1] =
        lastItem.type === 'group'
          ? {
              ...lastItem,
              items: [...lastItem.items, item],
            }
          : {
              id: lastItem.id,
              type: 'group',
              items: [{ ...section[0], id: `${section[0].id}-group` }, lastItem, item],
            }
    } else {
      result.push(item)
    }
    lastOrderIndex = item.order
  })
  return result
}

export const parseFetchedData = data => {
  let sections = data.content.filter(item => item.type === 'section')
  sections = sections.map(() => [])

  const content = data.content.map(con => ({ ...con, style: con.style ? JSON.parse(con.style ?? '{}') : {} }))
  content.forEach(item => sections[item['section_id']].push(item))
  // sections = sections.map(sec => ({ ...sec, style: sec.style ? JSON.parse(sec.style) : undefined }))
  data.widgets.forEach(widget => {
    widget.style = widget.style ? JSON.parse(widget.style) : undefined
    let found = false // optimization
    for (let i = 0; i < sections.length; i += 1) {
      for (let j = 0; j < sections[i].length; j += 1) {
        const sectionPart = sections[i][j]
        if (sectionPart.id === widget['widget_id']) {
          sectionPart.widgetData = sectionPart.widgetData?.length ? [...sectionPart.widgetData, widget] : [widget]
          found = true
          break
        }
      }

      if (found) {
        break
      }
    }
  })

  sections = sections.map(section => correctSectionByPriority(section))

  console.log(sections)
  return { ...data, sections }
}

// export const getBackendURL = () =>
//   location.origin.includes('localhost') ? 'http://martinusmaco.sk/astros/backend/' : '/backend/'

export const getBackendURL = () => 'http://martinusmaco.sk/astros/backend/'

export const getSectionContentOrder = content => {
  const items = {}

  content.forEach(item => {
    if (item.type === 'section') {
      return
    }
    if (items[item.order]) {
      items[item.order].push(item)
    } else {
      items[item.order] = [item]
    }
  })

  return Object.entries(items).map(([key, value]) => {
    if (value.length > 1) {
      return value
    }

    return value[0]
  })
}

export const determineSectionColumns = orderedContent => orderedContent.filter(item => Array.isArray(item))?.length

export const correctLineFeed = text => text.replaceAll(/\n/gi, '<br>')

export const getAdminMenuItems = (sections, menuClicked) => {
  const result = []
  const subItems = sections.map(section => {
    return { title: section[0].value, id: section[0].id, action: menuClicked, key: `${section[0].id}-key` }
  })
  result.push({ title: 'Basic', id: null, icon: 'home', action: menuClicked }) // basic settings
  result.push({ title: 'Advanced settings', id: 'advanced', icon: 'wrench', action: menuClicked }) // basic settings
  result.push({ title: 'Content', id: 'content', icon: 'folder', action: menuClicked, subItems, expanded: false }) // content
  result.push({ title: 'Publish', id: 'publish', icon: 'cloud-upload-alt', action: menuClicked }) // publish or export
  return result
}

export const getResource = (id, resources) => resources.filter(res => res.id === id)?.[0]?.value

export const capitalizeString = text => text[0].toUpperCase() + text.substr(1, text.length - 1).toLowerCase()

export const mapLanguagesToListbox = languages =>
  languages.map(language => ({ ...language, id: language.abbr, logo: language.path, enabled: !!language.active }))

export const alterLanguagesByActive = (languages, languageId, newValue) =>
  languages.map(l => (l.id === languageId ? { ...l, active: newValue, enabled: newValue } : l))

export const mapEmailsToListbox = emails =>
  emails.map((email, idx) => ({ ...email, title: email.value, id: `${email.value}-${idx}` }))

export const alterEmailsByRemoval = (emails, value) => emails.filter(em => em.value !== value)
export const alterEmailsByCreation = (emails, value) => [
  ...emails,
  { value, id: `${value}-${emails.length}`, title: value },
]

export const makePostRequest = (resource, data) => {
  const body = new FormData()
  body.append('resource', resource)
  body.append('data', JSON.stringify(data))
  return fetch(getBackendURL(), { method: 'POST', body })
    .then(response => response.json())
    .then(result => result)
}

export const mapSectionsToContent = sections =>
  sections.map(sec => {
    const data = [...sec]
    const first = data.shift()

    return { ...first, title: first.value, data }
  })

export const alterSectionsByPosition = (sections, inc, title, withDescription) => {
  const result = []
  let newIndex = null
  let section = null

  sections.forEach((sec, idx) => {
    if (withDescription) {
      if (`${sec.title} - ${sec.description}` === title) {
        newIndex = idx + inc
        section = sec
      } else {
        result.push(sec)
      }
    } else {
      if (sec.title === title) {
        newIndex = idx + inc
        section = sec
      } else {
        result.push(sec)
      }
    }
  })
  result.splice(newIndex, 0, section)

  return result
}

export const alterSectionsByRemoval = (sections, title) => sections.filter(sec => sec.title !== title)
export const alterSectionsByCreation = (sections, value) => [
  ...sections,
  { title: value, value, id: `new-section-${value}` },
]

export const findTabById = (sections, id) => sections.filter(sec => sec[0].id === id)
export const mapSectionContentToListbox = section => {
  const result = []

  section.forEach(item => {
    const { type } = item
    if (type !== 'section') {
      result.push({ ...item, title: translateWidgetTitle(type) })
    }
  })

  return result
}

export const getSectionWidgetById = (sections, id) => sections.filter(sec => sec.id === id)

export const translateWidgetTitle = widgetType => {
  switch (widgetType) {
    case 'numeric_tiles':
      return 'Numeric tiles'
    case 'full_tiles':
      return 'Full tiles'
    case 'logos':
      return 'Logos'
    case 'form':
      return 'Contact form'
    case 'social':
      return 'Social networks'
    case 'address':
      return 'Address'
    case 'article':
      return 'Common text/article'
    case 'animation':
      return 'Globe animation'
    case 'group':
      return 'Widget group'
    default:
      return widgetType
  }
}

export const findHeadingInWidget = widgetData => widgetData.filter(w => w.style?.['isHeading'])
export const findDescriptionInWidget = widgetData => widgetData.filter(w => !w.style?.['isHeading'])

export const mapGroupWidgetsToListbox = widgets =>
  widgets.filter(w => w.type !== 'section').map(w => ({ ...w, title: translateWidgetTitle(w.type) }))

export const updateTempWidgetById = (widgets, widgetId, widgetData) => {
  const result = []

  widgets.forEach(wid => {
    if (wid.id === widgetId) {
      result.push({ id: widgetId, ...widgetData })
    } else {
      result.push(wid)
    }
  })

  return result
}

export const createEmptyWidget = data => ({
  id: null,
  widget_id: null,
  icon: null,
  title: null,
  description: null,
  order: null,
  path: null,
  position: null,
  style: null,
  url: null,
  ...data,
})

export const purgeArrayFromUndefined = data => data.filter(item => !!item)

export const mapFullTilesToListbox = tiles =>
  tiles.map(tile => ({ ...tile, itemTitle: tile.itemTitle ?? `${tile.title} - ${tile.description}` }))

export const alterTileInWidgetDataStyle = (widgetData, newStyles) =>
  widgetData.map(w =>
    w.id === newStyles.id
      ? { ...w, style: { ...w.style, ...newStyles.style }, path: newStyles.style.backgroundPath }
      : w,
  )

export const alterTileInWidgetData = (widgetData, newData) =>
  widgetData.map(w => {
    if (w.id === newData.id) {
      const res = { ...w, ...newData }

      return res
    }
    return w
  })

export const translateTileTitleStyleIntoStyle = titleStyle => ({
  ...titleStyle,
  color: titleStyle.titleColor,
  fontSize: titleStyle.titleSize,
  fontStyle: titleStyle.titleFontStyle,
  fontWeight: titleStyle.titleFontWeight,
  textDecoration: titleStyle.titleTextDecoration,
})

export const translateTileDescriptionStyleIntoStyle = descriptionStyle => ({
  ...descriptionStyle,
  color: descriptionStyle.descriptionColor,
  fontSize: descriptionStyle.descriptionSize,
  fontStyle: descriptionStyle.descriptionFontStyle,
  fontWeight: descriptionStyle.descriptionFontWeight,
  textDecoration: descriptionStyle.descriptionTextDecoration,
})

export const translateTileIconStyleIntoStyle = iconStyle => ({
  ...iconStyle,
  color: iconStyle.iconColor,
  iconSize: iconStyle.iconSize,
})

export const translateTileStyleIntoStyle = (tileStyle, path) => ({
  ...tileStyle,
  footerColor: tileStyle.footerColor,
  backgroundColor: tileStyle.backgroundColor,
  backgroundPath: path,
})

export const translateStyleIntoTileTitleStyle = style => ({
  titleColor: style.color,
  titleSize: style.fontSize,
  titleFontStyle: style.fontStyle,
  titleFontWeight: style.fontWeight,
  titleTextDecoration: style.textDecoration,
})

export const translateStyleIntoTileDescriptionStyle = style => ({
  descriptionColor: style.color,
  descriptionSize: style.fontSize,
  descriptionFontStyle: style.fontStyle,
  descriptionFontWeight: style.fontWeight,
  descriptionTextDecoration: style.textDecoration,
})

export const translateStyleIntoTileIconStyle = style => ({
  iconColor: style.color,
  iconSize: style.iconSize,
})

export const translateStyleIntoTileStyle = style => ({
  ...style,
  footerColor: style.footerColor,
  backgroundColor: style.backgroundColor,
  backgroundPath: style.backgroundPath,
  backgroundAssetId: style.backgroundAssetId,
  height: style.minHeight ?? undefined,
  width: style.maxWidth ?? undefined,
  descriptionSize: style.descriptionFontStyle,
})

export const translateStyleIntoNumericTileStyle = style => ({
  ...style,
  footerColor: style.footerColor,
  height: style.minHeight ?? undefined,
  width: style.maxWidth ?? undefined,
  descriptionSize: style.descriptionFontStyle,
})

export const alterTileDataByCreation = (tiles, tile) => [...tiles, tile]

// export const alterTileDataByRemoval = (tiles, title) =>
//   tiles.filter(t => (t.description ? `${t.title} - ${t.description}` !== title : t.itemTitle !== title))

export const alterTileDataByRemoval = (tiles, title) => {
  return tiles.filter(t => {
    console.log('TILE', t.description, `${t.title} - ${t.description}`, title)
    return typeof t.description === 'string' ? `${t.title} - ${t.description}` !== title : t.itemTitle !== title
  })
}

// export const alterTileDataByShift = (tiles, inc, title) => alterSectionsByPosition(tiles, inc, title, true)

export const alterNumericTileDataByRemoval = (tiles, title) =>
  tiles.filter(t => (t.description ? `${t.title} - ${t.description}` !== title : t.itemTitle !== title))

// export const setDefaultNumericTilesTempData = widgetData => widgetData.map(w => {...w, itemTitle: })

export const mapNumericTilesToListbox = tiles =>
  tiles.map(tile => ({ ...tile, itemTitle: tile.itemTitle ?? `${tile.title} - ${tile.description}` }))

export const mapLogosToListbox = logos => logos.map(logo => ({ ...logo, itemTitle: logo.url }))

export const mapSocialToListbox = social => social.map(soc => ({ ...soc, itemTitle: soc.title }))

export const alterTileDataByShift = (items, inc, title) => {
  console.log({ items, title })
  const result = []
  let newIndex = null
  let tile = null

  items.forEach((item, idx) => {
    const itemTitle = item.itemTitle ?? `${item.title} - ${item.description}`
    if (itemTitle === title) {
      newIndex = idx + inc
      tile = { ...item, order: newIndex }
    } else {
      result.push(item)
    }
  })
  console.log({ result }, tile)
  result.splice(newIndex, 0, tile)
  console.log({ result })
  result[newIndex - inc] = { ...result[newIndex - inc], order: newIndex - inc }
  console.log({ result })

  return result
}

export const translateAddressStyleIntoStyle = addressStyle => ({
  ...addressStyle,
  color: addressStyle.descriptionColor,
  fontSize: addressStyle.descriptionSize,
})

export const translateStyleIntoAddressStyle = style => ({
  ...style,
  descriptionColor: style.color,
  descriptionSize: style.fontSize,
})

export const alterNetworkInWidgetData = (widgetData, newData) =>
  widgetData.map(w => (w.id === newData.id ? { ...w, ...newData } : w))

const isObjectEmpty = obj => Object.keys(obj ?? {}).length === 0 && obj?.constructor === Object
const removeEmptyStylesFromObject = obj => ({ ...obj, style: isObjectEmpty(obj.style) ? null : obj.style })
const removeEmptyStylesFromArray = objects => objects.map(o => removeEmptyStylesFromObject(o))

export const isWidgetNew = w => typeof w.id === 'string' && w.id.includes('new')

export const translateTempDataIntoStructure = tempData => {
  const data = [...tempData]
  let section = data.shift()
  let widgets = []
  let content = []
  console.log(tempData)

  data.forEach(c => {
    const { widgetData, ...rest } = c

    if (c.items) {
      const groupContent = [...c.items]
      groupContent.shift()
      groupContent.forEach(c2 => {
        const { widgetData: wD, ...rest2 } = c2
        wD.forEach(w => {
          widgets.push({ ...w, new: isWidgetNew(w) })
        })

        content.push({ ...rest2, new: false })
      })
    } else {
      widgetData.forEach(w => {
        widgets.push({ ...w, new: isWidgetNew(w) })
      })
      content.push({ ...rest, new: false })
    }
  })

  console.log(widgets)
  section = removeEmptyStylesFromObject(section)
  widgets = removeEmptyStylesFromArray(widgets)
  content = removeEmptyStylesFromArray(content)

  return { section, content, widgets }
}

export const alterTempDataBySectionAttribute = (tempData, attr) => {
  return tempData.map((tD, idx) => (idx === 0 ? { ...tD, ...attr } : tD))
}

export const translateNewSectionsToBackend = newSections =>
  newSections.map((sec, idx) => {
    const { id, section_id } = sec

    return { id, section_id, section_order: idx }
  })
