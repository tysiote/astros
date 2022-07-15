import React, { Component } from 'react'
import './form.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button } from '../button'
import { getTranslationById, makePostRequest } from '../../pages/utils'

export class Form extends Component {
  constructor(props) {
    super(props)

    const values = {}
    props.widgetData.forEach(item => (values[item.id] = ''))
    this.state = {
      values,
      buttonHovered: false,
      disabled: false,
      buttonWidth: null,
      buttonProgressText: null,
    }
  }

  handleOnButtonClick = () => {
    const { values } = this.state
    const { widgetData } = this.props
    let sender = null
    let content = null

    widgetData.forEach(wD => {
      if (wD.style?.isTextarea) {
        content = values[wD.id]
      } else {
        sender = values[wD.id]
      }
    })

    this.setState({ disabled: true, buttonProgressText: 'Sending email ...' })
    makePostRequest('sendEmail', { content, sender }).then(() => {
      this.setState({ buttonProgressText: 'Email sent successfully', buttonWidth: 300 })
    })
  }

  handleOnTextChange = (event, id) => {
    const { values } = this.state
    const newValues = values

    newValues[id] = event.target.value

    this.setState({ values: newValues })
  }

  handleOnButtonMouseToggle = () => {
    this.setState({ buttonHovered: !this.state.buttonHovered })
  }

  renderButton = styles => {
    const { disabled, buttonProgressText, buttonWidth } = this.state
    const { buttonSize, buttonColor, buttonText, buttonBgColor } = styles
    const finalStyles = {}
    finalStyles.width = buttonWidth ? `${buttonWidth}px` : undefined
    finalStyles.backgroundColor = buttonBgColor ? buttonBgColor : undefined
    finalStyles.borderColor = buttonBgColor ? buttonBgColor : undefined
    finalStyles.color = buttonColor ? buttonColor : undefined

    return (
      <div className="form-item">
        <div className="form-group-button">
          <Button
            onClick={this.handleOnButtonClick}
            className="primary"
            disabled={disabled}
            style={finalStyles}
            // onMouseEnter={this.handleOnButtonMouseToggle}
            // onMouseLeave={this.handleOnButtonMouseToggle}
          >
            {buttonProgressText ?? buttonText}
          </Button>
        </div>
      </div>
    )
  }

  renderOneItem = item => {
    const { values, disabled } = this.state
    const {
      lang,
      otherData: { translations },
    } = this.props
    const { id, title, description, style } = item
    const { isTextarea, labelColor, labelSize, rowsCount, ...restStyle } = style ?? {}
    const elementId = `form-item-${id}`
    const trans = getTranslationById({ translations, lang, widgetId: id })
    const elementProps = {
      value: values[id],
      onChange: e => this.handleOnTextChange(e, id),
      placeholder: trans?.description ?? description,
      id: elementId,
      disabled: disabled,
      className: classNames({ disabled }),
    }

    return (
      <div className="form-item" key={elementId} style={restStyle}>
        <div className="form-group">
          <label htmlFor={elementId} style={{ fontSize: labelSize, color: labelColor }}>
            {trans?.title ?? title}
          </label>
          {isTextarea ? <textarea {...elementProps} rows={rowsCount ?? 10} /> : <input {...elementProps} />}
        </div>
      </div>
    )
  }

  render() {
    const { id, widgetData, style } = this.props
    const { buttonText, buttonSize, buttonColor, buttonBgColor, ...restStyle } = style
    return (
      <div className="form" key={`widget-form-${id}`} style={restStyle}>
        {widgetData.map(item => this.renderOneItem(item))}
        {this.renderButton({
          buttonText,
          buttonSize,
          buttonColor,
          buttonBgColor,
        })}
      </div>
    )
  }
}

Form.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  lang: PropTypes.string.isRequired,
  otherData: PropTypes.shape({
    core: PropTypes.array,
    translations: PropTypes.array,
  }).isRequired,
}
