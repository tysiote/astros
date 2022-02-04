import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getResource, translateWidgetTitle } from '../../utils'
import { ColorPicker, Input, Styler, Switch } from '../../../components'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'

export const AdminWidgetAnimation = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const [tempData, setTempData] = useState(widget)
  const [pos, setPos] = useState(position)
  const [count, setCount] = useState(widgetData[0]?.style['count'] ?? 100)
  const [color, setColor] = useState(widgetData[0]?.style['color'] ?? getResource('theme_color', data.core))
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]
  const [widgetStyles, setWidgetStyles] = useState(widget.style)

  useEffect(() => {
    setPos(position)
    setCount(widgetData[0]?.style['count'] ?? 100)
    setColor(widgetData[0]?.style['color'] ?? getResource('theme_color', data.core))
    setWidgetStyles(widget.style)
  }, [widget])

  const updateState = newTempData => {
    setTempData(newTempData)
    onChange(id, newTempData)
  }

  const handleOnPosChange = newValue => {
    setPos(newValue)
    // onChange(widget.id, { ...widget, position: newValue })
    updateState({ ...widget, position: newValue })
  }

  const handleOnColorChange = newValue => {
    setColor(newValue)
    const newStyles = { ...tempData.widgetData[0].style, color: newValue }
    // onChange(widget.id, { ...widget, style: newStyles })
    updateState({ ...tempData, widgetData: [{ ...tempData.widgetData[0], style: newStyles }] })
  }

  const handleOnCountChange = newValue => {
    setCount(newValue)
    // onChange(widget.id, { ...widget, style: newStyles })
    const newStyles = { ...tempData.widgetData[0].style, count: newValue }
    updateState({ ...tempData, widgetData: [{ ...tempData.widgetData[0], style: newStyles }] })
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
    updateState({ ...tempData, style: newValue })
  }

  return (
    <div className="widget-animation">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-article-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />
      </div>

      <Styler
        className="admin-active-section-styler-animation"
        label="Custom styles for Animation widget"
        title="Article widget styler"
        styles={widgetStyles}
        onSave={handleOnWidgetStylesChange}
        hasPaddings
        hasMargins
        hasMaxWidth
        hasMinHeight
      />

      <ColorPicker
        value={color}
        id="admin-animation-widget-color-picker"
        onChange={handleOnColorChange}
        className="admin-animation-widget-color-picker"
        label="Animation color:"
      />

      <Input
        id={`admin-animation-widget-count-${id}`}
        label="Dots count:"
        onChange={handleOnCountChange}
        value={count}
        placeholder="Enter numeric value"
      />
    </div>
  )
}

AdminWidgetAnimation.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
