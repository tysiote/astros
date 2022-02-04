import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Listbox, Styler, Switch } from '../../components'
import {
  alterTempDataBySectionAttribute,
  getSectionWidgetById,
  mapSectionContentToListbox,
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

export const AdminSection = ({ data, section, onChange, isSaving }) => {
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

  const handleOnSave = () => {
    setLoading(true)
    const structure = translateTempDataIntoStructure(tempData)
    console.log('structure', structure)
    onChange(structure)
  }

  const handleOnWidgetRowClick = widgetId => {
    console.log(widgetId, tempData)
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

  const handleOnWidgetAdd = type => {}

  const handleOnWidgetChange = (widgetId, widgetData, groupAWID) => {
    const newSectionData = updateTempWidgetById(tempData, widgetId, widgetData)
    const newActiveWidget = getSectionWidgetById(newSectionData, activeWidget.id)?.[0]
    console.log('changing', widgetId, widgetData, newActiveWidget)
    setTempData(newSectionData)
    setItems(mapSectionContentToListbox(newSectionData))
    setActiveWidget(newActiveWidget)
    setGroupAWID(groupAWID)
  }
  const renderSelectedWidget = () => {
    console.log('active', activeWidget)
    if (!activeWidget.type) {
      return null
    }

    switch (activeWidget?.type) {
      case 'article':
        return (
          <AdminWidgetArticle widget={activeWidget} onSave={handleOnSave} data={data} onChange={handleOnWidgetChange} />
        )
      case 'animation':
        return (
          <AdminWidgetAnimation
            widget={activeWidget}
            onSave={handleOnSave}
            data={data}
            onChange={handleOnWidgetChange}
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
          />
        )
      case 'full_tiles':
        return (
          <AdminWidgetFullTiles
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
          />
        )
      case 'numeric_tiles':
        return (
          <AdminWidgetNumericTiles
            widget={activeWidget}
            data={data}
            onSave={handleOnSave}
            onChange={handleOnWidgetChange}
          />
        )
      case 'logos':
        return (
          <AdminWidgetLogos widget={activeWidget} data={data} onSave={handleOnSave} onChange={handleOnWidgetChange} />
        )
      case 'form':
        return (
          <AdminWidgetForm widget={activeWidget} data={data} onSave={handleOnSave} onChange={handleOnWidgetChange} />
        )
      case 'address':
        return (
          <AdminWidgetAddress widget={activeWidget} data={data} onSave={handleOnSave} onChange={handleOnWidgetChange} />
        )
      case 'social':
        return (
          <AdminWidgetSocial widget={activeWidget} data={data} onSave={handleOnSave} onChange={handleOnWidgetChange} />
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
            // onAdd: handleOnWidgetAdd,
            onAddText: 'Add another widget below',
          }}
          selectedItem={activeWidget?.id}
        />

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
  section: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
}
