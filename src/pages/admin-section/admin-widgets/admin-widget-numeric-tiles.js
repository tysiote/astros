import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  alterNumericTileDataByRemoval,
  alterTileDataByCreation,
  alterTileDataByRemoval,
  alterTileDataByShift,
  alterTileInWidgetData,
  alterTileInWidgetDataStyle,
  getResource,
  getSectionWidgetById,
  mapFullTilesToListbox,
  mapNumericTilesToListbox,
  translateStyleIntoNumericTileStyle,
  translateStyleIntoTileDescriptionStyle,
  translateStyleIntoTileStyle,
  translateStyleIntoTileTitleStyle,
  translateTileDescriptionStyleIntoStyle,
  translateTileIconStyleIntoStyle,
  translateTileStyleIntoStyle,
  translateTileTitleStyleIntoStyle,
  translateWidgetTitle,
} from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { Input, Listbox, Styler } from '../../../components'

export const AdminWidgetNumericTiles = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const tempDataDefault = { ...widget, widgetData: mapNumericTilesToListbox(widgetData) }
  const [tempData, setTempData] = useState(tempDataDefault)
  const itemsDefault = mapNumericTilesToListbox(tempData?.widgetData ?? widgetData)
  const [items, setItems] = useState(itemsDefault)
  const activeTileDefault = items?.length ? items[0] : null
  const [activeTile, setActiveTile] = useState(activeTileDefault)
  const [widgetStyles, setWidgetStyles] = useState(tempData ? tempData.style : widget.style)
  const [tileStyles, setTileStyles] = useState(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {})
  const [titleStyle, setTitleStyle] = useState(
    translateTileTitleStyleIntoStyle(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {}),
  )
  const [descriptionStyle, setDescriptionStyle] = useState(
    translateTileDescriptionStyleIntoStyle(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {}),
  )

  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]

  useEffect(() => {
    setPos(position)
    setWidgetStyles(widget.style)
    setTileStyles(activeTile ? activeTile.style ?? {} : activeTileDefault.style ?? {})
    setItems(mapNumericTilesToListbox(tempData.widgetData))
  }, [widget])

  const handleOnPosChange = newValue => {
    setPos(newValue)
    onChange(id, { ...widget, position: newValue })
  }

  const handleOnTileAdd = newTitle => {
    const newTile = {
      id: `new-${widget.id}-${tempData.widgetData.length}`,
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
    }
    const newTempData = { ...tempData, widgetData: alterTileDataByCreation(tempData.widgetData, newTile) }
    updateStates(newTile, newTempData)
  }

  const handleOnRemove = title => {
    const newTempData = { ...tempData, widgetData: alterNumericTileDataByRemoval(tempData.widgetData, title) }
    updateStates(activeTile, newTempData)
  }

  const handleOnShiftPosition = (title, inc) => {
    const newTempData = { ...tempData, widgetData: alterTileDataByShift(tempData.widgetData, inc, title) }
    updateStates(activeTile, newTempData)
  }

  const handleOnTileSelected = tileId => {
    const newActiveTile = getSectionWidgetById(tempData.widgetData, tileId)?.[0]
    setActiveTile(newActiveTile)
    updateStates(newActiveTile, tempData)
  }

  const handleOnTileChange = newData => {
    console.log(newData)
    const newWidgets = newData.style
      ? alterTileInWidgetDataStyle(tempData.widgetData, newData)
      : alterTileInWidgetData(tempData.widgetData, newData)
    const newTempData = { ...tempData, widgetData: newWidgets }
    const tile = getSectionWidgetById(newWidgets, newData.id)?.[0]

    updateStates(tile, newTempData)
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
  }

  const updateStates = (activeTile, newTempData) => {
    console.log({ activeTile, newTempData })
    setTempData(newTempData)
    setTitleStyle(translateTileTitleStyleIntoStyle(activeTile.style ?? {}))
    setDescriptionStyle(translateTileDescriptionStyleIntoStyle(activeTile.style ?? {}))
    setTileStyles(translateTileStyleIntoStyle(activeTile.style ?? {}, activeTile.path))
    setItems(mapNumericTilesToListbox(newTempData.widgetData))
    onChange(id, newTempData, activeTile.id)
  }

  const renderTileOptions = () => {
    return (
      <div className="tile-options">
        <Styler
          className="admin-active-section-styler-numeric-tiles"
          label="Custom styles for the Tile"
          title="Tile styler"
          styles={tileStyles}
          onSave={newStyles => {
            handleOnTileChange({ id: activeTile.id, style: translateStyleIntoNumericTileStyle(newStyles) })
          }}
          hasMargins
          hasPaddings
          hasMaxWidth
          hasMinHeight
          hasFooterColor
        />

        <Input
          value={activeTile.title}
          onChange={val => handleOnTileChange({ id: activeTile.id, title: val })}
          label="Title"
        />
        <Styler
          className="admin-active-section-styler-numeric-tiles-title"
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
          className="admin-active-section-styler-numeric-tiles-description"
          label="Custom styles for Description"
          title="Description styler"
          styles={descriptionStyle}
          onSave={newStyles => {
            handleOnTileChange({ id: activeTile.id, style: translateStyleIntoTileDescriptionStyle(newStyles) })
          }}
          hasColor
          hasFontStyles
        />
      </div>
    )
  }

  return (
    <div className="widget-numeric-tiles">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-numeric-tiles-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />

        <Styler
          className="admin-active-section-styler-numeric-tiles"
          label="Custom styles for Numeric tiles widget"
          title="Numeric tiles widget styler"
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
        label="Numeric tiles overview:"
        className="admin-section-numeric-tiles-widget-listbox"
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

AdminWidgetNumericTiles.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
