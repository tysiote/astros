import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  alterTileInWidgetData,
  getResource,
  getSectionWidgetById,
  mapFullTilesToListbox,
  translateTileTitleStyleIntoStyle,
  translateWidgetTitle,
  translateTileDescriptionStyleIntoStyle,
  translateStyleIntoTileTitleStyle,
  translateStyleIntoTileDescriptionStyle,
  alterTileInWidgetDataStyle,
  translateTileIconStyleIntoStyle,
  translateStyleIntoTileIconStyle,
  translateTileStyleIntoStyle,
  translateStyleIntoTileStyle,
  alterSectionsByPosition,
  alterSectionsByCreation,
  alterSectionsByRemoval,
  alterTileDataByCreation,
  alterTileDataByShift,
  alterTileDataByRemoval,
} from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { IconPicker, Input, Listbox, Styler } from '../../../components'

export const AdminWidgetFullTiles = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]
  const [tempData, setTempData] = useState(widget)
  const itemsDefault = mapFullTilesToListbox(tempData?.widgetData ?? widgetData)
  const [items, setItems] = useState(itemsDefault)
  const activeTileDefault = items?.length ? items[0] : null
  const [activeTile, setActiveTile] = useState(activeTileDefault)
  const [icon, setIcon] = useState(activeTile ? activeTile.icon : activeTileDefault.icon)
  const [tileStyles, setTileStyles] = useState(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {})
  const [widgetStyles, setWidgetStyles] = useState(widget.style)

  const [titleStyle, setTitleStyle] = useState(
    translateTileTitleStyleIntoStyle(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {}),
  )
  const [descriptionStyle, setDescriptionStyle] = useState(
    translateTileDescriptionStyleIntoStyle(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {}),
  )
  const [iconStyle, setIconStyle] = useState(
    translateTileIconStyleIntoStyle(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {}),
  )

  useEffect(() => {
    setPos(position)
    setWidgetStyles(widget.style)
    setTileStyles(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {})
    setItems(mapFullTilesToListbox(tempData.widgetData))
  }, [widget])

  const handleOnPosChange = newValue => {
    setPos(newValue)
    onChange(id, { ...widget, position: newValue })
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
  }

  const handleOnIconSelect = newValue => {
    setIcon(newValue)
    handleOnTileChange({ id: activeTile.id, icon: newValue })
  }

  const handleOnTileChange = newData => {
    const newWidgets = newData.style
      ? alterTileInWidgetDataStyle(tempData.widgetData, newData)
      : alterTileInWidgetData(tempData.widgetData, newData)
    const newTempData = { ...tempData, widgetData: newWidgets }
    const tile = getSectionWidgetById(newWidgets, newData.id)?.[0]

    updateStates(tile, newTempData)
  }

  const handleOnTileAdd = newTitle => {
    const newTile = {
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
    const newTempData = { ...tempData, widgetData: alterTileDataByCreation(tempData.widgetData, newTile) }
    updateStates(newTile, newTempData)
  }

  const handleOnRemove = title => {
    const newTempData = { ...tempData, widgetData: alterTileDataByRemoval(tempData.widgetData, title) }
    console.log(title, alterTileDataByRemoval(tempData.widgetData, title))
    updateStates(activeTile, newTempData)
  }

  const updateStates = (activeTile, newTempData) => {
    console.log('updating states', activeTile, newTempData)
    setTempData(newTempData)
    setTitleStyle(translateTileTitleStyleIntoStyle(activeTile.style ?? {}))
    setDescriptionStyle(translateTileDescriptionStyleIntoStyle(activeTile.style ?? {}))
    setIconStyle(translateTileIconStyleIntoStyle(activeTile.style ?? {}))
    setTileStyles(translateTileStyleIntoStyle(activeTile.style ?? {}, activeTile.path))
    setIcon(activeTile.icon)
    setActiveTile(activeTile)
    console.log('fullTiles', newTempData.widgetData)
    setItems(mapFullTilesToListbox(newTempData.widgetData))
    onChange(id, newTempData, activeTile.id)
  }

  const handleOnTileSelected = tileId => {
    const newActiveTile = getSectionWidgetById(tempData.widgetData, tileId)?.[0]
    setActiveTile(newActiveTile)
    updateStates(newActiveTile, tempData)
  }

  const handleOnShiftPosition = (title, inc) => {
    const newTempData = { ...tempData, widgetData: alterTileDataByShift(tempData.widgetData, inc, title) }
    updateStates(activeTile, newTempData)
  }

  const renderTileOptions = () => {
    console.log(activeTile)
    return (
      <div className="tile-options">
        <Styler
          className="admin-active-section-styler-full-tiles"
          label="Custom styles for the Tile"
          title="Tile styler"
          styles={tileStyles}
          onSave={newStyles => {
            handleOnTileChange({ id: activeTile.id, style: translateStyleIntoTileStyle(newStyles) })
          }}
          hasBgColor
          hasMargins
          hasPaddings
          hasMaxWidth
          hasMinHeight
          hasFooterColor
        />

        <Input
          value={activeTile.title ?? ''}
          onChange={val => handleOnTileChange({ id: activeTile.id, title: val })}
          label="Title"
        />
        <Styler
          className="admin-active-section-styler-full-tiles-title"
          label="Custom styles for Title"
          title="Title styler"
          styles={titleStyle}
          onSave={newStyles =>
            handleOnTileChange({ id: activeTile.id, style: translateStyleIntoTileTitleStyle(newStyles) })
          }
          hasColor
          hasFontStyles
        />

        <Input
          value={activeTile.description}
          onChange={val => handleOnTileChange({ id: activeTile.id, description: val })}
          label="Description"
        />
        <Styler
          className="admin-active-section-styler-full-tiles-description"
          label="Custom styles for Description"
          title="Description styler"
          styles={descriptionStyle}
          onSave={newStyles => {
            handleOnTileChange({ id: activeTile.id, style: translateStyleIntoTileDescriptionStyle(newStyles) })
          }}
          hasColor
          hasFontStyles
        />

        <IconPicker value={icon} onChange={handleOnIconSelect} label="Tile icon: " color={iconStyle?.color ?? null} />
        <Styler
          className="admin-active-section-styler-full-tiles-icon"
          label="Custom styles for Icon"
          title="Icon styler"
          styles={iconStyle}
          onSave={newStyles => {
            handleOnTileChange({ id: activeTile.id, style: translateStyleIntoTileIconStyle(newStyles) })
          }}
          hasColor
          hasIconSize
        />
      </div>
    )
  }

  return (
    <div className="widget-full-tiles">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-full-tiles-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />

        <Styler
          className="admin-active-section-styler-full-tiles"
          label="Custom styles for Full tiles widget"
          title="Full tiles widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
          hasPaddings
          hasMargins
          hasMaxWidth
          hasMinHeight
          hasFooterColor
        />
      </div>

      <Listbox
        items={items}
        label="Full tiles overview:"
        className="admin-section-full-tiles-widget-listbox"
        selectedItem={activeTile?.id}
        actions={{
          onSelected: handleOnTileSelected,
          onRemove: handleOnRemove,
          onAdd: handleOnTileAdd,
          onAddText: 'Add another tile below',
          onMoveUp: id => handleOnShiftPosition(id, -1),
          onMoveDown: id => handleOnShiftPosition(id, 1),
        }}
      />

      {renderTileOptions()}
    </div>
  )
}

AdminWidgetFullTiles.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
