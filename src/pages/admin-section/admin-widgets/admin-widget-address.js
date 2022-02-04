import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  getResource,
  translateAddressStyleIntoStyle,
  translateStyleIntoAddressStyle,
  translateWidgetTitle,
} from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { Input, Styler } from '../../../components'

export const AdminWidgetAddress = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const [tempData, setTempData] = useState(widget)
  const [widgetStyles, setWidgetStyles] = useState(tempData ? tempData.style : widget.style)
  const [addressStyles, setAddressStyles] = useState(
    translateAddressStyleIntoStyle(tempData ? tempData.widgetData?.[0]?.style ?? {} : widgetData?.[0]?.style ?? {}),
  )

  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]

  console.log(tempData)

  useEffect(() => {
    setPos(position)
    setTempData(widget)
    setWidgetStyles(widget.style)
    setAddressStyles(translateAddressStyleIntoStyle(widgetData?.[0]?.style ?? {}))
  }, [widget])

  const updateStates = newTempData => {
    setTempData(newTempData)
    onChange(id, newTempData)
  }

  const handleOnPosChange = newValue => {
    setPos(newValue)
    updateStates({ ...tempData, position: newValue })
  }
  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
    updateStates({ ...tempData, style: newValue })
  }

  const handleOnAddressStylesChange = newValue => {
    const newStyles = translateStyleIntoAddressStyle(newValue)
    setAddressStyles(newStyles)
    updateStates({ ...tempData, widgetData: [{ ...tempData.widgetData[0], style: newStyles }] })
  }

  const handleOnAddressChange = newValue => {
    const newTempData = { ...tempData, widgetData: [{ ...tempData.widgetData[0], description: newValue }] }
    updateStates(newTempData)
  }

  return (
    <div className="widget-address">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-address-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />

        <Styler
          className="admin-active-section-styler-address"
          label="Custom styles for Address widget"
          title="Address widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
          hasPaddings
          hasMargins
          hasMaxWidth
          hasMinHeight
        />
        <Input
          onChange={handleOnAddressChange}
          value={tempData.widgetData[0].description}
          id={'admin-address-input'}
          label="Address content"
          textarea
        />

        <Styler
          className="admin-active-section-styler-address"
          label="Custom styles for Address content widget"
          title="Address content widget styler"
          styles={addressStyles}
          onSave={handleOnAddressStylesChange}
          hasFontStyles
          hasColor
        />
      </div>
    </div>
  )
}

AdminWidgetAddress.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
