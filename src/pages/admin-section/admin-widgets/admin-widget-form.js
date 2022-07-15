import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getResource, translateWidgetTitle } from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { Input, Styler, Translations } from '../../../components'

export const AdminWidgetForm = ({ widget, data, forceRefresh, onChange }) => {
  const { type, position, widgetData, id } = widget
  const [tempData, setTempData] = useState(widget)
  const [widgetStyles, setWidgetStyles] = useState(tempData ? tempData.style : widget.style)
  const [pos, setPos] = useState(position)
  const [title, setTitle] = useState(tempData.widgetData[0].description)
  const [content, setContent] = useState(tempData.widgetData[1].title)
  const [buttonText, setButtonText] = useState(tempData.style?.buttonText)
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
    updateStates({ ...tempData, position: newValue })
  }

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles({ ...widgetStyles, ...newValue })
    updateStates({ ...tempData, style: { ...tempData.style, ...newValue } })
  }

  const handleOnButtonStylesChange = newValue => {
    setWidgetStyles(newValue)
    updateStates({ ...tempData, style: { ...tempData.style, ...newValue } })
  }

  const handleOnFormTitleChange = newValue => {
    setTitle(newValue)
    updateStates({
      ...tempData,
      widgetData: [{ ...tempData.widgetData[0], description: newValue }, { ...tempData.widgetData[1] }],
    })
  }

  const handleOnFormContentChange = newValue => {
    setContent(newValue)
    updateStates({
      ...tempData,
      widgetData: [{ ...tempData.widgetData[0] }, { ...tempData.widgetData[1], title: newValue }],
    })
  }

  const handleOnFormButtonChange = newValue => {
    setButtonText(newValue)
    updateStates({ ...tempData, style: { ...tempData.style, buttonText: newValue } })
  }

  const updateStates = newTempData => {
    setTempData(newTempData)
    onChange(id, newTempData)
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

        <Input
          onChange={handleOnFormTitleChange}
          value={title}
          id={'admin-form-description-input'}
          label="Email placeholder"
        />
        <Translations
          item={{
            id: tempData.widgetData[0].id,
            itemValue: tempData.widgetData[0].description,
            description: true,
          }}
          translations={data.translations}
          languages={data.languages}
          forceRefresh={forceRefresh}
        />

        <Input
          onChange={handleOnFormContentChange}
          value={content}
          id={'admin-form-description-input'}
          label="Email form label"
        />
        <Translations
          item={{
            id: tempData.widgetData[1].id,
            itemValue: tempData.widgetData[1].title,
          }}
          translations={data.translations}
          languages={data.languages}
          forceRefresh={forceRefresh}
        />

        <Input
          onChange={handleOnFormButtonChange}
          value={buttonText}
          id={'admin-form-description-input'}
          label="Email form label"
        />
        <Styler
          className="admin-active-section-styler-form-button"
          label="Custom styles for button widget"
          title="Button form widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
          hasButtonBgColor
          hasButtonColor
        />
      </div>
    </div>
  )
}

AdminWidgetForm.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  forceRefresh: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}
