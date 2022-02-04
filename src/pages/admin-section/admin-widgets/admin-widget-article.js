import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  createEmptyWidget,
  findDescriptionInWidget,
  findHeadingInWidget,
  getResource,
  purgeArrayFromUndefined,
  translateWidgetTitle,
} from '../../utils'
import { Button, Input, Styler } from '../../../components'
import { SeekStepBar } from '../../../components/seek-step-bar/seek-step-bar'

export const AdminWidgetArticle = ({ widget, data, onChange }) => {
  const { type, position, widgetData } = widget
  const [pos, setPos] = useState(position)
  const heading = findHeadingInWidget(widgetData)?.[0]
  const description = findDescriptionInWidget(widgetData)?.[0]
  const [header, setHeader] = useState(heading?.title)
  const [content, setContent] = useState(description?.title)
  const posSteps = [
    { title: 'Left', value: 'left' },
    { title: 'Center', value: 'center' },
    { title: 'Right', value: 'right' },
  ]
  const [headerStyles, setHeaderStyles] = useState(heading?.style)
  const [contentStyles, setContentStyles] = useState(description?.style)
  const [widgetStyles, setWidgetStyles] = useState(widget.style)

  useEffect(() => {
    const heading = findHeadingInWidget(widgetData)?.[0]
    const description = findDescriptionInWidget(widgetData)?.[0]
    setPos(widget.position)
    setHeader(heading?.title)
    setContent(description?.title)
    setHeaderStyles(heading?.style)
    setContentStyles(description?.style)
    setWidgetStyles(widget.style)
  }, [widget])

  const handleOnPosChange = newValue => {
    setPos(newValue)
    onChange(widget.id, { ...widget, position: newValue })
  }
  const handleOnHeaderChange = newValue => {
    setHeader(newValue)
    const head = findHeadingInWidget(widgetData)?.[0]
    const desc = findDescriptionInWidget(widgetData)?.[0]
    head.title = newValue
    onChange(widget.id, { ...widget, widgetData: purgeArrayFromUndefined([head, desc]) })
  }

  const handleOnContentChange = newValue => {
    setContent(newValue)
    const head = findHeadingInWidget(widgetData)?.[0]
    const desc = findDescriptionInWidget(widgetData)?.[0]
    desc.title = newValue
    onChange(widget.id, { ...widget, widgetData: purgeArrayFromUndefined([head, desc]) })
  }

  const handleOnWidgetStylesChange = newValue => setWidgetStyles(newValue)
  const handleOnHeaderStylesChange = newValue => setHeaderStyles(newValue)
  const handleOnContentStylesChange = newValue => setContentStyles(newValue)
  const handleOnHeaderRemoved = () => {
    const desc = findDescriptionInWidget(widgetData)?.[0]
    onChange(widget.id, { ...widget, widgetData: purgeArrayFromUndefined([desc]) })
  }

  const handleOnHeaderCreated = () => {
    const desc = findDescriptionInWidget(widgetData)?.[0]
    const head = createEmptyWidget({
      widget_id: widget.id,
      style: { isHeading: true },
      id: `new-${widget.id}-0`,
      order: 0,
      title: '',
    })
    onChange(widget.id, { ...widget, widgetData: purgeArrayFromUndefined([head, desc]) })
  }

  const handleOnContentRemoved = () => {
    const head = findHeadingInWidget(widgetData)?.[0]
    onChange(widget.id, { ...widget, widgetData: purgeArrayFromUndefined([head]) })
  }

  const handleOnContentCreated = () => {
    const head = findHeadingInWidget(widgetData)?.[0]
    const desc = createEmptyWidget({ widget_id: widget.id, id: `new-${widget.id}-1`, order: 1, title: '' })
    onChange(widget.id, { ...widget, widgetData: purgeArrayFromUndefined([head, desc]) })
  }

  return (
    <div className="widget-article">
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
        className="admin-active-section-styler"
        label="Custom styles for Article widget"
        title="Article widget styler"
        styles={widgetStyles}
        onSave={handleOnWidgetStylesChange}
        hasPaddings
        hasMargins
        hasMaxWidth
        hasMinHeight
      />

      {heading ? (
        <div className="admin-section-active-widget-heading-wrapper">
          <Input
            value={header}
            onChange={handleOnHeaderChange}
            className="admin-section-active-widget-heading"
            id={`admin-section-active-widget-heading-${heading.id}`}
            label="Heading:"
            placeholder="Enter heading"
          />
          <div className="header-options">
            <Styler
              className="admin-active-section-styler-header"
              label="Custom styles for header"
              title="Article header styler"
              styles={headerStyles}
              onSave={handleOnHeaderStylesChange}
              hasColor
              hasFontStyles
            />
            <Button onClick={handleOnHeaderRemoved}>Remove header</Button>
          </div>
        </div>
      ) : (
        <div className="admin-section-active-widget-heading-wrapper">
          <Button onClick={handleOnHeaderCreated} className="primary">
            Add header
          </Button>
        </div>
      )}

      {description ? (
        <div className="admin-section-active-widget-content-wrapper">
          <Input
            value={content}
            onChange={handleOnContentChange}
            className="admin-section-active-widget-content"
            id={`admin-section-active-widget-content-${description.id}`}
            label="Article content:"
            textarea
          />
          <div className="header-options">
            <Styler
              className="admin-active-section-styler-content"
              label="Custom styles for content"
              title="Article content styler"
              styles={contentStyles}
              onSave={handleOnContentStylesChange}
              hasColor
              hasFontStyles
            />
            <Button onClick={handleOnContentRemoved}>Remove content</Button>
          </div>
        </div>
      ) : (
        <div className="admin-section-active-widget-content-wrapper">
          <Button onClick={handleOnContentCreated} className="primary">
            Add content
          </Button>
        </div>
      )}
    </div>
  )
}

AdminWidgetArticle.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
