import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getResource, translateWidgetTitle } from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { Styler } from '../../../components'

export const AdminWidgetForm = ({ widget, data }) => {
  const { type, position, widgetData, id } = widget
  const [tempData, setTempData] = useState(widget)
  const [widgetStyles, setWidgetStyles] = useState(tempData ? tempData.style : widget.style)
  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]

  useEffect(() => {
    setPos(position)
  }, [widget])

  const handleOnPosChange = newValue => {
    setPos(newValue)
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
  }

  return (
    <div className="widget-form">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-form-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />
        <Styler
          className="admin-active-section-styler-form"
          label="Custom styles for Form widget"
          title="Form widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
          hasPaddings
          hasMargins
          hasMaxWidth
          hasMinHeight
        />
      </div>
    </div>
  )
}

AdminWidgetForm.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}
