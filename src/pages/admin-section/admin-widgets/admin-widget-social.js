import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  alterNetworkInWidgetData,
  alterNumericTileDataByRemoval,
  alterTileDataByCreation,
  alterTileDataByShift,
  alterTileInWidgetData,
  getResource,
  getSectionWidgetById,
  mapLogosToListbox,
  mapSocialToListbox,
  translateStyleIntoTileIconStyle,
  translateTileIconStyleIntoStyle,
  translateTileStyleIntoStyle,
  translateWidgetTitle,
} from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { ColorPicker, IconPicker, Input, Listbox, Styler } from '../../../components'

export const AdminWidgetSocial = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const tempDataDefault = { ...widget, widgetData: mapSocialToListbox(widgetData) }
  const [tempData, setTempData] = useState(tempDataDefault)
  const itemsDefault = mapSocialToListbox(tempData?.widgetData ?? widgetData)
  const [items, setItems] = useState(itemsDefault)
  const activeLogoDefault = items?.length ? items[0] : null
  const [activeLogo, setActiveLogo] = useState(activeLogoDefault)
  const [widgetStyles, setWidgetStyles] = useState(tempData ? tempData.style : widget.style)

  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]

  const [iconStyle, setIconStyle] = useState(
    translateTileIconStyleIntoStyle(activeLogo ? activeLogo.style ?? {} : activeLogoDefault?.style ?? {}),
  )

  useEffect(() => {
    setPos(position)
    setWidgetStyles(widget.style)
    setItems(mapSocialToListbox(tempData.widgetData))
    setIconStyle(translateTileIconStyleIntoStyle(activeLogo ? activeLogo.style ?? {} : activeLogoDefault?.style ?? {}))
  }, [widget])

  const handleOnPosChange = newValue => {
    setPos(newValue)
    onChange(id, { ...widget, position: newValue })
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
    onChange(id, { ...widget, style: newValue })
  }

  const handleOnChange = newTempData => {
    onChange(id, newTempData)
  }

  const handleOnLogoAdd = newTitle => {
    const newNetwork = {
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
    const newTempData = { ...tempData, widgetData: alterTileDataByCreation(tempData.widgetData, newNetwork) }
    updateStates(newNetwork, newTempData)
  }

  const handleOnRemove = title => {
    const newTempData = { ...tempData, widgetData: alterNumericTileDataByRemoval(tempData.widgetData, title) }
    updateStates(activeLogo, newTempData)
  }

  const handleOnShiftPosition = (title, inc) => {
    const newTempData = { ...tempData, widgetData: alterTileDataByShift(tempData.widgetData, inc, title) }
    updateStates(activeLogo, newTempData)
  }

  const handleOnLogoSelected = tileId => {
    const newActiveLogo = getSectionWidgetById(tempData.widgetData, tileId)?.[0]
    setActiveLogo(newActiveLogo)
    updateStates(newActiveLogo, tempData)
  }

  const handleOnUrlChange = newUrl => {
    const newNetworks = alterNetworkInWidgetData(tempData.widgetData, { url: newUrl, id: activeLogo.id })
    const newTempData = { ...tempData, widgetData: newNetworks }
    updateStates(activeLogo, newTempData)
  }

  const handleOnTitleChange = newTitle => {
    const newNetworks = alterNetworkInWidgetData(tempData.widgetData, {
      title: newTitle,
      itemTitle: newTitle,
      id: activeLogo.id,
    })
    const newTempData = { ...tempData, widgetData: newNetworks }
    updateStates(activeLogo, newTempData)
  }

  const handleOnIconStyleChange = newStyle => {
    const newNetworks = alterNetworkInWidgetData(tempData.widgetData, { ...activeLogo, style: newStyle })
    const newTempData = { ...tempData, widgetData: newNetworks }
    setIconStyle(newStyle)
    updateStates(activeLogo, newTempData)
  }

  const handleOnIconChange = newIcon => {
    const newNetworks = alterNetworkInWidgetData(tempData.widgetData, { icon: newIcon, id: activeLogo.id })
    const newTempData = { ...tempData, widgetData: newNetworks }
    updateStates(activeLogo, newTempData)
  }

  const handleOnColorChange = newColor => {
    const newNetworks = alterNetworkInWidgetData(tempData.widgetData, {
      style: { ...activeLogo.style, color: newColor, iconColor: newColor },
      id: activeLogo.id,
    })
    const newTempData = { ...tempData, widgetData: newNetworks }
    updateStates(activeLogo, newTempData)
  }

  const updateStates = (newActiveLogo, newTempData) => {
    setTempData(newTempData)
    setItems(mapSocialToListbox(newTempData.widgetData))
    handleOnChange(newTempData)
  }

  const renderIconOptions = () => {
    return (
      <div className="tile-options">
        <Input value={activeLogo.title} onChange={val => handleOnTitleChange(val)} label="Internal title" />

        <Input value={activeLogo.url} onChange={val => handleOnUrlChange(val)} label="Url" />

        <IconPicker
          value={activeLogo.icon}
          label="Icon"
          onChange={handleOnIconChange}
          onlyBrands
          color={activeLogo.style?.color}
        />
        <Styler
          className="admin-active-section-styler-full-tiles-icon"
          label="Custom styles for Icon"
          title="Icon styler"
          styles={iconStyle}
          onSave={newStyles => {
            handleOnIconStyleChange(translateStyleIntoTileIconStyle(newStyles))
          }}
          hasColor
          hasIconSize
        />

        <ColorPicker
          label={'Icon color'}
          value={activeLogo.style?.color}
          id="social-color-picker"
          onChange={handleOnColorChange}
        />
      </div>
    )
  }

  return (
    <div className="widget-social">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-social-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />
        <Styler
          className="admin-active-section-styler-social"
          label="Custom styles for Social widget"
          title="Social widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
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
        actions={{
          onSelected: handleOnLogoSelected,
          onRemove: items.length > 1 ? handleOnRemove : null,
          onAdd: handleOnLogoAdd,
          onAddText: 'Add another network below',
          onMoveUp: id => handleOnShiftPosition(id, -1),
          onMoveDown: id => handleOnShiftPosition(id, 1),
        }}
      />

      {renderIconOptions()}
    </div>
  )
}

AdminWidgetSocial.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
