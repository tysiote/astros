const correctSectionByPriority = section => {
  const result = []
  let lastOrderIndex = null
  section.forEach(item => {
    if (lastOrderIndex === item.order) {
      const lastItem = result[result.length - 1]
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
  sections = sections.reduce((a, v) => ({ ...a, [v.section_id]: [] }), {})

  const content = data.content.map(con => ({ ...con, style: con.style ? JSON.parse(con.style ?? '{}') : {} }))
  content.forEach(item => sections[item['section_id']].push(item))
  sections = Object.values(sections)
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
  sections.sort((a, b) => (a[0].section_order > b[0].section_order ? 1 : -1))

  return { ...data, sections }
}

// export const getBackendURL = () =>
//   location.origin.includes('localhost') ? 'http://martinusmaco.sk/astros/backend/' : '/backend/'

// export const getBackendURL = () =>
//   location.href === 'http://astros.sk/beta/'
//     ? 'http://astros.sk/beta/backend/'
//     : 'http://martinusmaco.sk/astros/backend/'

export const getBackendURL = () => {
  if (location.href.includes('dev') || location.href.includes('localhost')) {
    return location.href.includes('astros.')
      ? 'http://astros.sk/beta/dev/backend/'
      : 'http://martinusmaco.sk/astros/dev/backend/'
  }
  return location.href.includes('astros.') ? 'http://astros.sk/beta/backend/' : 'http://martinusmaco.sk/astros/backend/'
}

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
  if (data) {
    body.append('data', JSON.stringify(data))
  }
  return fetch(getBackendURL(), { method: 'POST', body, credentials: 'include' })
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
  { title: value, value, id: `new-section#${value}`, isNew: true },
]

export const findTabById = (sections, id) => sections.filter(sec => sec[0].id === id)
export const mapSectionContentToListbox = section => {
  const result = []

  section.forEach(item => {
    const { type } = item
    if (type !== 'section') {
      result.push({ ...item, title: translateWidgetTitle(type), enabled: false })
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
    case 'image':
      return 'Image'
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
  let changesApplied = false

  widgets.forEach(wid => {
    if (wid.id === widgetId) {
      result.push({ id: widgetId, ...widgetData })
      changesApplied = true
    } else {
      result.push(wid)
    }
  })

  if (!changesApplied) {
    result.push({ ...widgetData })
  }

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
  tiles?.map(tile => ({ ...tile, itemTitle: tile.itemTitle ?? `${tile.title} - ${tile.description}` })) ?? []

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
  result.splice(newIndex, 0, tile)
  result[newIndex - inc] = { ...result[newIndex - inc], order: newIndex - inc }

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

        content.push({ ...rest2, new: isWidgetNew(c) })
      })
    } else {
      widgetData.forEach(w => {
        widgets.push({ ...w, new: isWidgetNew(w) })
      })
      content.push({ ...rest, new: isWidgetNew(c) })
    }
  })

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
    const { id, section_id, isNew } = sec

    return { id, section_id, section_order: idx, new: isNew }
  })

export const createNewContent = (widgetType, sectionId, currentSize) => {
  const baseWidgetProps = {
    id: `new-widget#`,
    type: widgetType,
    order: currentSize,
    path: null,
    position: 'left',
    section_id: sectionId,
    style: {},
    value: '',
    icon: null,
    url: null,
  }

  return { ...baseWidgetProps }
}

export const createNewWidgetsPromise = (widgetType, contentId) => {
  switch (widgetType) {
    case 'address':
      return [makePostRequest('saveNewWidget', { content_id: contentId })]
    case 'animation':
      return [makePostRequest('saveNewWidget', { content_id: contentId })]
    case 'article':
      return [
        makePostRequest('saveNewWidget', { content_id: contentId, order: 0, style: { isHeading: true } }),
        makePostRequest('saveNewWidget', { content_id: contentId, order: 1 }),
      ]
    case 'form':
      return [
        makePostRequest('saveNewWidget', {
          content_id: contentId,
          order: 0,
          title: 'Email',
          description: ' Your email address',
        }),
        makePostRequest('saveNewWidget', {
          content_id: contentId,
          order: 1,
          title: 'Your message',
          style: { isTextarea: true },
        }),
      ]
    default:
      return [makePostRequest('saveNewWidget', { content_id: contentId })]
  }
}

export const reorderTempDataByItems = (tempData, items) => {
  const result = []
  tempData.forEach(tD => {
    if (tD.type === 'section') {
      result.push(tD)
    }
  })

  items.forEach((item, idx) => {
    tempData.forEach(tD => {
      if (item.id === tD.id) {
        result.push({ ...tD, order: idx + 1 })
      }
    })
  })

  return result
}

export const alterWidgetsByEnable = (widgets, id, value) =>
  widgets.map(w => (w.id === id ? { ...w, enabled: value } : { ...w }))

export const getEnabledWidgetsToMerge = widgets => widgets.filter(w => w.enabled)

export const alterTempDataByGroupCreation = (widgets, ids) => {
  const result = []
  let index = -1
  let idsMerged = 0

  widgets.forEach(w => {
    if (ids.indexOf(w.id) !== -1) {
      const idx = index >= 0 ? index : result.length
      if (idx === result.length) {
        index = idx
      } else {
        idsMerged += 1
      }
      result.push({ ...w, order: idx })
    } else {
      result.push({ ...w, order: result.length - idsMerged })
    }
  })

  return result
}

export const rearrangeWidgetsAfterGroupRelease = (tempData, ids) => {
  const result = []
  const tempResult = []
  let groupResult = []

  tempData.forEach(item => {
    if (item.items) {
      groupResult = []
      item.items.forEach(subItem => {
        if (ids.indexOf(subItem.id) !== -1) {
          tempResult.push(subItem)
        } else {
          groupResult.push(subItem)
        }
      })
      if (groupResult.length === 2) {
        tempResult.push(groupResult[1])
      } else {
        tempResult.push({ ...item, items: groupResult })
      }
    } else {
      tempResult.push(item)
    }
  })

  let index = 0

  tempResult.forEach((item, idx) => {
    if (item.items) {
      result.push({
        ...item,
        items: item.items.map(subItem => ({ ...subItem, order: subItem.type === 'section' ? 0 : index })),
      })
    } else {
      result.push({ ...item, order: index })
    }
    index += 1
  })

  return result
}

export const getNewTranslations = ({ widgetId, contentId, translations, description }) =>
  translations.filter(
    t =>
      (widgetId &&
        t.widget_id === widgetId &&
        ((description && t.description) || (!description && (t.value || t.title)))) ||
      (contentId && t.content_id === contentId),
  )

const doesTranslationExistByLanguage = ({ translations, lang, description }) =>
  translations.filter(
    t => t['language_abbr'] === lang && ((description && t.description) || (!description && (t.value || t.title))),
  )?.length

export const getAvailableTranslations = ({ languages, existingTranslations, description }) =>
  languages.filter(
    lang =>
      lang.active === 1 &&
      !doesTranslationExistByLanguage({ translations: existingTranslations, lang: lang.abbr, description }),
  )

export const getLanguageByAbbr = (languages, abbr) => languages.filter(l => l.abbr === abbr)?.[0]

export const getDefaultTranslationValues = ({ existingLanguages, availableLanguages, description }) => [
  ...existingLanguages.map(t => ({
    value: t.value ?? description ? t.description : t.title,
    lang: t['language_abbr'],
  })),
  ...availableLanguages.map(t => ({ value: null, lang: t.abbr })),
]

export const alterTranslationValuesByValue = (abbr, newValue, values) =>
  values.map(v => ({ ...v, value: v.lang === abbr ? newValue : v.value }))

export const convertValuesIntoTranslations = ({ type, values, id, description }) => {
  if (type !== null && type !== undefined && type !== 'article') {
    return values
      .filter(v => v.value !== null && v.value !== undefined)
      .map(v => ({ value: v.value, content_id: id, language: v.lang }))
  }
  return values
    .filter(v => v.value !== null && v.value !== undefined)
    .map(v => ({ [description ? 'description' : 'title']: v.value, widget_id: id, language: v.lang }))
}

export const getActiveLanguages = languages => languages.filter(lang => lang.active)

export const getTranslationById = ({ translations, lang, widgetId, contentId }) =>
  translations.filter(
    t => (t['widget_id'] === widgetId || t['content_id'] === contentId) && t['language_abbr'] === lang,
  )?.[0]

export const findHyperLinksInText = text => {
  const result = []
  let remainingText = text

  while (remainingText?.length) {
    let link = findHyperLink(remainingText)
    if (link) {
      const textPart = remainingText.substr(0, link.startIndex)
      result.push(textPart, link)
      remainingText = remainingText.substr(link.endIndex, remainingText.length)
    } else {
      result.push(remainingText)
      remainingText = ''
    }
  }

  return result
}

const findHyperLink = text => {
  let startFound = false
  let middleFound = false
  let endFound = false
  let url = ''
  let namespace = ''
  let startIndex = null

  for (let i = 0; i < text.length; i += 1) {
    if (endFound) {
      return { endIndex: i, startIndex, url, namespace }
    }
    if (text[i] === '<') {
      startFound = true
      middleFound = false
      endFound = false
      startIndex = parseInt(`${i}`, 10)
      url = ''
      namespace = ''
    } else if (text[i] === '|') {
      middleFound = startFound
    } else if (text[i] === '>') {
      endFound = startFound && middleFound
    } else if (startFound && !middleFound) {
      url += text[i]
    } else if (startFound && middleFound) {
      namespace += text[i]
    }
  }

  if (endFound) {
    return { endIndex: text.length, startIndex, url, namespace }
  }

  return false
}
