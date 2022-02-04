import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  alterNumericTileDataByRemoval,
  alterTileDataByCreation,
  alterTileDataByShift,
  alterTileInWidgetData,
  alterTileInWidgetDataStyle,
  getBackendURL,
  getResource,
  getSectionWidgetById,
  mapLogosToListbox,
  translateStyleIntoNumericTileStyle,
  translateTileStyleIntoStyle,
  translateWidgetTitle,
} from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { Input, Listbox, Styler, Uploader } from '../../../components'

export const AdminWidgetLogos = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const tempDataDefault = { ...widget, widgetData: mapLogosToListbox(widgetData) }
  const [tempData, setTempData] = useState(tempDataDefault)
  const itemsDefault = mapLogosToListbox(tempData?.widgetData ?? widgetData)
  const [items, setItems] = useState(itemsDefault)
  const activeLogoDefault = items?.length ? items[0] : null
  const [activeLogo, setActiveLogo] = useState(activeLogoDefault)
  const [widgetStyles, setWidgetStyles] = useState(tempData ? tempData.style ?? {} : widget.style)
  const [logoStyles, setLogoStyles] = useState(activeLogo ? activeLogo.style ?? {} : activeLogoDefault.style ?? {})
  const [disabled, setDisabled] = useState(false)
  const [logoPath, setLogoPath] = useState(activeLogo ? activeLogo.path : activeLogoDefault.path)
  console.log(tempData.widgetData)

  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]

  useEffect(() => {
    setPos(position)
    setWidgetStyles(widget.style)
    setLogoStyles(activeLogo ? activeLogo.style ?? {} : activeLogoDefault?.style ?? {})
    setItems(mapLogosToListbox(tempData.widgetData))
  }, [widget])

  const handleOnPosChange = newValue => {
    setPos(newValue)
  }

  const handleOnLogoAdd = newTitle => {
    const newLogo = {
      id: `new-${id}-${tempData.widgetData.length}`,
      itemTitle: newTitle,
      title: newTitle,
      description: '',
      widgetId: id,
      widget_id: id,
      style: {},
      order: widgetData.length,
      icon: null,
      url: null,
      position: null,
      path: null,
    }
    const newTempData = { ...tempData, widgetData: alterTileDataByCreation(tempData.widgetData, newLogo) }
    updateStates(newLogo, newTempData)
  }

  const handleOnRemove = url => {
    const newTempData = { ...tempData, widgetData: alterNumericTileDataByRemoval(tempData.widgetData, url) }
    updateStates(activeLogo, newTempData)
  }

  const handleOnShiftPosition = (url, inc) => {
    const newTempData = { ...tempData, widgetData: alterTileDataByShift(tempData.widgetData, inc, url) }
    updateStates(activeLogo, newTempData)
  }

  const handleOnLogoSelected = tileId => {
    const newActiveLogo = getSectionWidgetById(tempData.widgetData, tileId)?.[0]
    setActiveLogo(newActiveLogo)
    updateStates(newActiveLogo, tempData)
  }

  const handleOnLogoChange = newData => {
    console.log(newData)
    const newWidgets = newData.style
      ? alterTileInWidgetDataStyle(tempData.widgetData, newData)
      : alterTileInWidgetData(tempData.widgetData, newData)
    const newTempData = { ...tempData, widgetData: newWidgets }
    const logo = getSectionWidgetById(newWidgets, newData.id)?.[0]

    updateStates(logo, newTempData)
  }

  const handleOnUploadStart = () => {
    setDisabled(true)
  }
  const handleOnUploadFinish = res => {
    setDisabled(false)
    handleOnLogoChange({ id: activeLogo.id, path: res.data['file_name'], assetId: res.data['last_id'] })
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
  }

  const updateStates = (activeLogo, newTempData) => {
    console.log('updateState', { activeLogo, newTempData })
    setTempData(newTempData)
    setLogoStyles(translateTileStyleIntoStyle(activeLogo.style ?? {}, activeLogo.path))
    setItems(mapLogosToListbox(newTempData.widgetData))
    setLogoPath(activeLogo.path)
    onChange(id, newTempData, activeLogo.id)
  }

  const renderTileOptions = () => {
    return (
      <div className="tile-options">
        <Styler
          className="admin-active-section-styler-logos"
          label="Custom styles for the Logo"
          title="Logo styler"
          styles={logoStyles}
          onSave={newStyles => {
            handleOnLogoChange({ id: activeLogo.id, style: translateStyleIntoNumericTileStyle(newStyles) })
          }}
          disabled={disabled}
          hasMargins
          hasPaddings
          hasMaxWidth
          hasMinHeight
        />

        <Input
          value={activeLogo.url}
          onChange={val => handleOnLogoChange({ id: activeLogo.id, url: val })}
          label="Url"
        />

        <Uploader
          path={getBackendURL()}
          label="Logo:"
          onUploadStart={handleOnUploadStart}
          onUploadFinish={handleOnUploadFinish}
        />
        <label className="uploader-logo">{logoPath ?? ''}</label>
      </div>
    )
  }

  return (
    <div className="widget-logos">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-logos-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />

        <Styler
          className="admin-active-section-styler-logos"
          label="Custom styles for Logos widget"
          title="Logos widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
          disabled={disabled}
          hasPaddings
          hasMargins
          hasMaxWidth
          hasMinHeight
        />
      </div>

      <Listbox
        items={items}
        label="Logos overview:"
        className="admin-section-logos-widget-listbox"
        selectedItem={activeLogo?.id}
        disabled={disabled}
        actions={{
          onSelected: handleOnLogoSelected,
          onRemove: handleOnRemove,
          onAdd: handleOnLogoAdd,
          onAddText: 'Add another logo below',
          onMoveUp: id => handleOnShiftPosition(id, -1),
          onMoveDown: id => handleOnShiftPosition(id, 1),
        }}
      />

      {renderTileOptions()}
    </div>
  )
}

AdminWidgetLogos.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
