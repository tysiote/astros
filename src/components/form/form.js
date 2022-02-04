import React, { Component } from 'react'
import './form.scss'
import PropTypes from 'prop-types'
import { Button } from '../button'

export class Form extends Component {
  constructor(props) {
    super(props)

    const values = {}
    props.widgetData.forEach(item => (values[item.id] = ''))
    this.state = {
      values,
      buttonHovered: false,
    }
  }

  handleOnButtonClick = () => {
    alert()
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
    const { buttonHovered } = this.state
    const { buttonSize, buttonColor, buttonText, buttonHoverColor, buttonBackgroundColor, buttonHoverBackgroundColor } =
      styles

    return (
      <div className="form-item">
        <div className="form-group-button">
          <Button
            onClick={this.handleOnButtonClick}
            className="primary"
            // onMouseEnter={this.handleOnButtonMouseToggle}
            // onMouseLeave={this.handleOnButtonMouseToggle}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    )
  }

  renderOneItem = item => {
    const { values } = this.state
    const { id, title, description, style } = item
    const { isTextarea, labelColor, labelSize, rowsCount, ...restStyle } = style ?? {}
    const elementId = `form-item-${id}`
    const elementProps = {
      value: values[id],
      onChange: e => this.handleOnTextChange(e, id),
      placeholder: description,
      id: elementId,
    }

    return (
      <div className="form-item" key={elementId} style={restStyle}>
        <div className="form-group">
          <label htmlFor={elementId} style={{ fontSize: labelSize, color: labelColor }}>
            {title}
          </label>
          {isTextarea ? <textarea {...elementProps} rows={rowsCount ?? 10} /> : <input {...elementProps} />}
        </div>
      </div>
    )
  }

  render() {
    const { id, widgetData, style } = this.props
    const {
      buttonText,
      buttonSize,
      buttonColor,
      buttonHoverColor,
      buttonBackgroundColor,
      buttonHoverBackgroundColor,
      ...restStyle
    } = style
    return (
      <div className="form" key={`widget-form-${id}`} style={restStyle}>
        {widgetData.map(item => this.renderOneItem(item))}
        {this.renderButton({
          buttonText,
          buttonSize,
          buttonColor,
          buttonHoverColor,
          buttonBackgroundColor,
          buttonHoverBackgroundColor,
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
}
