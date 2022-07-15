import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Listbox, Styler, Switch, WidgetModal } from '../../components'
import {
  alterSectionsByPosition,
  alterSectionsByRemoval,
  alterTempDataByGroupCreation,
  alterTempDataBySectionAttribute,
  alterWidgetsByEnable,
  createNewContent,
  createNewWidgetsPromise,
  getEnabledWidgetsToMerge,
  getSectionWidgetById,
  makePostRequest,
  mapSectionContentToListbox,
  rearrangeWidgetsAfterGroupRelease,
  reorderTempDataByItems,
  translateTempDataIntoStructure,
  updateTempWidgetById,
} from '../utils'
import { AdminWidgetArticle } from './admin-widgets/admin-widget-article'
import './admin-widgets/admin-widgets.scss'
import { AdminWidgetAnimation } from './admin-widgets/admin-widget-animation'
import { AdminWidgetGroup } from './admin-widgets/admin-widget-group'
import { AdminWidgetFullTiles } from './admin-widgets/admin-widget-full-tiles'
import { AdminWidgetNumericTiles } from './admin-widgets/admin-widget-numeric-tiles'
import { AdminWidgetLogos } from './admin-widgets/admin-widget-logos'
import { AdminWidgetForm } from './admin-widgets/admin-widget-form'
import { AdminWidgetAddress } from './admin-widgets/admin-widget-address'
import { AdminWidgetSocial } from './admin-widgets/admin-widget-social'
import { AdminWidgetImage } from './admin-widgets/admin-widget-image'
import { Translations } from '../../components'

export const AdminSection = ({ data, section, onChange, isSaving, forceRefresh }) => {
  const { value: sectionNameDefault, id, position: positionDefault } = section[0]
  const [tempData, setTempData] = useState(section)
  const defaultItems = mapSectionContentToListbox(section)
  const [sectionName, setSectionName] = useState(sectionNameDefault)
  const [items, setItems] = useState(defaultItems)
  const [activeWidget, setActiveWidget] = useState(defaultItems?.length ? defaultItems[0] : null)
  const [position, setPosition] = useState(!!positionDefault)
  const [loading, setLoading] = useState(false)
  const [groupAWID, setGroupAWID] = useState(null)
  const [sectionStyles, setSectionStyles] = useState(section[0].style)
  const [canBeMerged, setCanBeMerged] = useState(false)
  const [widgetsToRemove, setWidgetsToRemove] = useState([])

  useEffect(() => {
    const defaultItems = mapSectionContentToListbox(section)
    setItems(defaultItems)
    setSectionName(section[0].value)
    setPosition(!!section[0].position)
    setSectionStyles(section[0].style)
    setActiveWidget(defaultItems?.length ? defaultItems[0] : null)
    setTempData(section)
  }, [data, section])

  const handleOnSectionNameChange = newName => {
    setSectionName(newName)
    setTempData(alterTempDataBySectionAttribute(tempData, { value: newName }))
  }

  const handleOnMergeClick = () => {
    const mergeableItems = getEnabledWidgetsToMerge(items)
    const newTempData = alterTempDataByGroupCreation(
      tempData,
      mergeableItems.map(item => item.id),
    )
    setTempData(newTempData)
    setItems(mapSectionContentToListbox(newTempData))
    handleOnSave(null, newTempData)

    setCanBeMerged(false)
    setTimeout(() => {
      forceRefresh()
    }, 200)
  }

  const handleOnWidgetMove = (value, up = true) => {
    const newItems = alterSectionsByPosition(items, up ? -1 : 1, value)
    setItems(newItems)
    handleWidgetListChanged(newItems)
  }

  const handleOnWidgetRemove = (value, id) => {
    const newItems = alterSectionsByRemoval(items, value)
    setWidgetsToRemove([...widgetsToRemove, id])
    setItems(newItems)
    handleWidgetListChanged(newItems)
  }

  const handleOnWidgetEnable = (id, value) => {
    const newItems = alterWidgetsByEnable(items, id, value)
    const mergeable = getEnabledWidgetsToMerge(newItems)?.length > 1
    if (canBeMerged !== mergeable) {
      setCanBeMerged(mergeable)
    }
    setItems(newItems)
    handleWidgetListChanged(newItems)
  }

  const handleWidgetListChanged = newItems => {
    setTempData(reorderTempDataByItems(tempData, newItems))
  }

  const onNewWidgetSelect = newWidgetType => {
    const newContent = createNewContent(newWidgetType, section[0].section_id, section.length)
    makePostRequest('saveNewContent', newContent).then(({ data }) => {
      const newContentId = data['content_id']
      newContent.id = newContentId
      newContent.new = false
      Promise.all(createNewWidgetsPromise(newWidgetType, newContentId)).then(promises => {
        newContent.widgetData = []
        promises.forEach(promiseResult => {
          newContent.widgetData.push({ id: promiseResult.data.widget_id })
        })
        forceRefresh()
        handleOnWidgetChange(newContent.id, newContent)
      })
    })
  }

  const handleOnSave = (e, saveData) => {
    setLoading(true)

    const saveProcess = () => {
      const structure = translateTempDataIntoStructure(saveData ?? tempData)
      onChange(structure)
    }

    if (widgetsToRemove?.length) {
      makePostRequest('removeWidget', { ids: widgetsToRemove }).then(() => {
        saveProcess()
      })
    } else {
      saveProcess()
    }
  }

  const handleOnWidgetRowClick = widgetId => {
    setActiveWidget(getSectionWidgetById(tempData, widgetId)?.[0])
  }

  const handleOnPositionChange = newVal => {
    setPosition(newVal)
    setTempData(alterTempDataBySectionAttribute(tempData, { position: newVal ? 'full' : null }))
  }

  const handleOnWidgetStylesChange = newValue => {
    setSectionStyles(newValue)
    setTempData(alterTempDataBySectionAttribute(tempData, { style: newValue }))
  }

  const handleOnGroupWidgetRelease = ids => {
    const newTempData = rearrangeWidgetsAfterGroupRelease(tempData, ids)
    setTempData(newTempData)
    handleOnSave(null, newTempData)
  }

  const handleOnWidgetChange = (widgetId, widgetData, groupAWID) => {
    const newSectionData = updateTempWidgetById(tempData, widgetId, widgetData)
    const newActiveWidget = getSectionWidgetById(newSectionData, activeWidget?.id)?.[0]
    setTempData(newSectionData)
    setItems(mapSectionContentToListbox(newSectionData))
    setActiveWidget(newActiveWidget)
    setGroupAWID(groupAWID)
  }
  const renderSelectedWidget = () => {
    if (!activeWidget?.type) {
      return null
    }

    switch (activeWidget?.type) {
      case 'article':
        return (
          <AdminWidgetArticle
            widget={activeWidget}
            onSave={handleOnSave}
            data={data}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'animation':
        return (
          <AdminWidgetAnimation
            widget={activeWidget}
            onSave={handleOnSave}
            data={data}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'group':
        return (
          <AdminWidgetGroup
            widget={activeWidget}
            onSave={handleOnSave}
            data={data}
            onChange={handleOnWidgetChange}
            activeWidgetId={groupAWID}
            onWidgetsRelease={handleOnGroupWidgetRelease}
            forceRefresh={forceRefresh}
          />
        )
      case 'full_tiles':
        return (
          <AdminWidgetFullTiles
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'numeric_tiles':
        return (
          <AdminWidgetNumericTiles
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'logos':
        return (
          <AdminWidgetLogos
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'form':
        return (
          <AdminWidgetForm
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'address':
        return (
          <AdminWidgetAddress
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'social':
        return (
          <AdminWidgetSocial
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      case 'image':
        return (
          <AdminWidgetImage
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
            forceRefresh={forceRefresh}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="admin-section-page">
      <div className="admin-section-page-content">
        <Input
          onChange={handleOnSectionNameChange}
          value={sectionName}
          label="Section name:"
          id={`section-name-input-${id}`}
        />
        <Translations
          item={{ id, type: 'section', itemValue: sectionName }}
          translations={data.translations}
          languages={data.languages}
          forceRefresh={forceRefresh}
        />

        <Switch onChange={val => handleOnPositionChange(val)} checked={position} label="Full height:" />

        <Styler
          className="admin-section-styler"
          label="Custom styles for section"
          title="Section styler"
          styles={sectionStyles}
          onSave={handleOnWidgetStylesChange}
          hasBgColor
          hasPaddings
          hasMargins
          hasMaxWidth
          hasMinHeight
          hasFontStyle
        />

        <Listbox
          items={items}
          label="Widget overview:"
          actions={{
            onSelected: handleOnWidgetRowClick,
            onMoveUp: handleOnWidgetMove,
            onMoveDown: value => handleOnWidgetMove(value, false),
            onRemove: handleOnWidgetRemove,
            onEnable: handleOnWidgetEnable,
          }}
          selectedItem={activeWidget?.id}
        />

        <div className="admin-section-widget-list-controls">
          <WidgetModal onSelect={onNewWidgetSelect} />
          <Button disabled={!canBeMerged} onClick={handleOnMergeClick} hint="Create widget group from selected widgets">
            Create group
          </Button>
        </div>

        <div className="admin-section-active-widget">{renderSelectedWidget()}</div>

        <div className="save-form">
          <Button onClick={handleOnSave} disabled={isSaving} disabledText="Saving" className="primary">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

AdminSection.propTypes = {
  data: PropTypes.object.isRequired,
  section: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onChange: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  forceRefresh: PropTypes.func.isRequired,
}
