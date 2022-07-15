import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getBackendURL, getResource, translateWidgetTitle } from '../../utils'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'
import { Styler, Uploader } from '../../../components'

export const AdminWidgetImage = ({ widget, data, onChange }) => {
  const { type, position, widgetData, id } = widget
  const [tempData, setTempData] = useState(widget)
  const [widgetStyles, setWidgetStyles] = useState(widget.style)
  const [disabled, setDisabled] = useState(false)
  const [logoPath, setLogoPath] = useState(widgetData?.[0]?.path)
  const [pos, setPos] = useState(position)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]

  useEffect(() => {
    setPos(position)
    setLogoPath(widgetData?.[0]?.path)
    setWidgetStyles(widget.style)
  }, [widget])

  const handleOnWidgetStylesChange = newValue => {
    setWidgetStyles(newValue)
    updateState({ ...tempData, style: newValue })
  }

  const handleOnPosChange = newValue => {
    setPos(newValue)
    updateState({ ...widget, position: newValue })
  }

  const handleOnUploadStart = () => {
    setDisabled(true)
  }
  const handleOnUploadFinish = res => {
    setDisabled(false)
    handleOnPathChange({ path: res.data['file_name'], assetId: res.data['last_id'] })
  }

  const handleOnPathChange = ({ path, assetId }) => {
    const newTempData = { ...tempData, widgetData: [{ ...tempData.widgetData[0], path, assetId }] }
    setLogoPath(path)
    updateState(newTempData)
  }

  const updateState = newTempData => {
    setTempData(newTempData)
    onChange(id, newTempData)
  }

  return (
    <div className="widget-logos">
      <h2>{translateWidgetTitle(type)}</h2>
      <div>
        <SeekStepBar
          label="Alignment: "
          onChange={handleOnPosChange}
          steps={posSteps}
          className="admin-widget-image-seek-step-bar"
          value={pos}
          color={getResource('theme_color', data.core)}
        />

        <Styler
          className="admin-active-section-styler-image"
          label="Custom styles for Image widget"
          title="Image widget styler"
          styles={widgetStyles}
          onSave={handleOnWidgetStylesChange}
          disabled={disabled}
          hasPaddings
          hasMargins
          hasMaxWidth
          hasMinHeight
        />

        <Uploader
          path={getBackendURL()}
          label="Image:"
          onUploadStart={handleOnUploadStart}
          onUploadFinish={handleOnUploadFinish}
          id="admin-widget-image-uploader"
        />
        <label className="uploader-logo">{logoPath ?? ''}</label>
      </div>
    </div>
  )
}

AdminWidgetImage.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
