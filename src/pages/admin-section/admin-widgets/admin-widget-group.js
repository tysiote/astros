import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  getSectionWidgetById,
  mapGroupWidgetsToListbox,
  mapSectionContentToListbox,
  translateWidgetTitle,
  updateTempWidgetById,
} from '../../utils'
import { Button, Listbox, Styler } from '../../../components'
import { AdminWidgetArticle } from './admin-widget-article'
import { AdminWidgetAnimation } from './admin-widget-animation'
import { AdminWidgetFullTiles } from './admin-widget-full-tiles'
import { AdminWidgetNumericTiles } from './admin-widget-numeric-tiles'
import { AdminWidgetLogos } from './admin-widget-logos'
import { AdminWidgetForm } from './admin-widget-form'
import { AdminWidgetAddress } from './admin-widget-address'
import { AdminWidgetSocial } from './admin-widget-social'

export const AdminWidgetGroup = ({ widget, data, onChange, activeWidgetId, onWidgetsRelease, forceRefresh }) => {
  const { type, id, items: groupItems } = widget
  const [tempData, setTempData] = useState(widget)
  const listboxItems = mapGroupWidgetsToListbox(groupItems)
  const [activeWidget, setActiveWidget] = useState(
    getSectionWidgetById(tempData.items, activeWidgetId)?.[0] ?? listboxItems?.[0],
  )
  const [items, setItems] = useState(listboxItems)
  const [groupStyles, setGroupStyles] = useState(groupItems[0].style)
  const [widgetsToBeRelease, setWidgetsToBeReleased] = useState([])

  useEffect(() => {
    const listboxItems = mapGroupWidgetsToListbox(tempData.items)
    setItems(mapGroupWidgetsToListbox(listboxItems))
    setActiveWidget(getSectionWidgetById(tempData.items, activeWidgetId)?.[0] ?? listboxItems?.[0])
    setGroupStyles(groupItems[0].style)
  }, [widget, activeWidgetId])

  const handleOnWidgetSelected = widgetId => {
    setActiveWidget(getSectionWidgetById(items, widgetId)?.[0])
  }

  const handleOnWidgetsReleased = () => {
    const enabledWidgets = items.filter(item => item.enabled).map(item => item.id)
    onWidgetsRelease(enabledWidgets)
  }

  const handleOnWidgetsEnabled = (id, value) => {
    const enabledWidgets = items.filter(item => item.enabled).map(item => item.id)
    if (value) {
      enabledWidgets.push(id)
    } else {
      enabledWidgets.splice(enabledWidgets.indexOf(id))
    }
    setItems(items.map(item => ({ ...item, enabled: enabledWidgets.indexOf(item.id) !== -1 })))
  }

  const handleOnWidgetStylesChange = newValue => {
    setGroupStyles(newValue)
  }

  const handleOnWidgetAdd = type => {}

  const handleOnSave = () => {}

  const handleOnWidgetChange = (widgetId, widgetData) => {
    const newGroupData = { ...tempData, items: updateTempWidgetById(tempData.items, widgetId, widgetData) }
    const newActiveWidget = getSectionWidgetById(newGroupData.items, activeWidget.id)?.[0]
    setTempData(newGroupData)
    setItems(mapSectionContentToListbox(newGroupData.items))
    setActiveWidget(newActiveWidget)
    onChange(id, newGroupData, newActiveWidget.id)
  }

  const renderWrappedWidget = () => {
    if (!activeWidget.type) {
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
      default:
        return null
    }
  }

  return (
    <div className="widget-group">
      <h2>{translateWidgetTitle(type)}</h2>

      <Listbox
        items={items}
        label="Group overview:"
        className="admin-section-group-widget-listbox"
        selectedItem={activeWidget?.id}
        actions={{
          onSelected: handleOnWidgetSelected,
          // onAdd: handleOnWidgetAdd,
          onAddText: 'Add another widget below',
          onEnable: handleOnWidgetsEnabled,
        }}
      />

      <div className="widget-group-controls">
        <Button
          onClick={handleOnWidgetsReleased}
          disabled={!items.filter(item => item.enabled).map(item => item.id)?.length}
        >
          Move widgets from group
        </Button>
      </div>

      {/*<Styler*/}
      {/*  className="admin-group-styler"*/}
      {/*  label="Custom styles for group"*/}
      {/*  title="Group styler"*/}
      {/*  styles={groupStyles}*/}
      {/*  onSave={handleOnWidgetStylesChange}*/}
      {/*  hasBgColor*/}
      {/*  hasPaddings*/}
      {/*  hasMargins*/}
      {/*  hasMaxWidth*/}
      {/*  hasMinHeight*/}
      {/*  hasFontStyle*/}
      {/*/>*/}

      <div className="admin-section-group-widget-wrapped-widget">{renderWrappedWidget()}</div>
    </div>
  )
}

AdminWidgetGroup.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  activeWidgetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onWidgetsRelease: PropTypes.func.isRequired,
  forceRefresh: PropTypes.func.isRequired,
}

AdminWidgetGroup.defaultProps = {
  activeWidgetId: null,
}
