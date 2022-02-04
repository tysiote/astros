import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { alterSeekStepBarWithPositions, getActiveItemByValue, getNearbyStep } from './utils'
import './seek-step-bar.scss'

const SEEK_STEP_BAR_WIDTH = 150
const SEEK_STEP_BAR_HEIGHT = 50
const SEEK_STEP_BAR_DIAMETER = 20
const SEEK_STEP_BAR_PADDING = 5

export class SeekStepBar extends Component {
  constructor(props) {
    super(props)

    this.ctx = null
    this.state = {
      steps: alterSeekStepBarWithPositions(
        props.steps,
        SEEK_STEP_BAR_WIDTH,
        SEEK_STEP_BAR_DIAMETER,
        SEEK_STEP_BAR_PADDING,
      ),
    }
  }

  setRef = node => {
    this.ctx = node?.getContext('2d')
  }

  clearCanvas = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, SEEK_STEP_BAR_WIDTH + SEEK_STEP_BAR_PADDING * 2, SEEK_STEP_BAR_HEIGHT)
    }
  }

  handleOnMouseDown = event => {
    const { steps } = this.state
    const { onChange } = this.props
    const { left } = event.target.getBoundingClientRect()
    const x = event.clientX - left
    const nearbyStepIndex = getNearbyStep(steps, x - SEEK_STEP_BAR_PADDING, SEEK_STEP_BAR_WIDTH)

    onChange(steps[nearbyStepIndex].value)
  }

  renderControls = () => {
    const { steps } = this.state
    const { color, inactiveColor, lineColor, value } = this.props

    this.ctx.beginPath()
    this.ctx.fillStyle = lineColor
    this.ctx.fillRect(SEEK_STEP_BAR_PADDING, SEEK_STEP_BAR_HEIGHT / 2 - 2, SEEK_STEP_BAR_WIDTH, 4)
    this.ctx.stroke()

    steps.forEach(step => {
      this.ctx.fillStyle = value === step.value ? color : inactiveColor
      this.ctx.beginPath()
      this.ctx.arc(step.x, SEEK_STEP_BAR_HEIGHT / 2, SEEK_STEP_BAR_DIAMETER / 2, 0, 2 * Math.PI)
      this.ctx.fill()
    })
  }

  renderCanvas = () => {
    setTimeout(() => {
      if (this.ctx) {
        this.clearCanvas()
        this.renderControls()
      }
    }, 1)

    return (
      <canvas
        width={SEEK_STEP_BAR_WIDTH + SEEK_STEP_BAR_PADDING * 2}
        height={SEEK_STEP_BAR_HEIGHT}
        ref={this.setRef}
        onMouseDown={this.handleOnMouseDown}
      />
    )
  }

  render() {
    const { className, label, value, id } = this.props
    const { steps } = this.state
    const activeStep = getActiveItemByValue(steps, value)

    return (
      <div className={classNames('seek-step-bar', className)} id={id}>
        <div className="seek-step-bar-info">
          {label && <div className="label">{label}</div>}
          <div className="value">{activeStep.title}</div>
        </div>
        {this.renderCanvas()}
      </div>
    )
  }
}

SeekStepBar.propTypes = {
  steps: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  color: PropTypes.string,
  inactiveColor: PropTypes.string,
  lineColor: PropTypes.string,
}

SeekStepBar.defaultProps = {
  className: null,
  label: null,
  value: null,
  onChange: () => {},
  color: 'red',
  inactiveColor: '#EEEEEE',
  lineColor: '#B0BEC5',
}
