import React, { Component } from 'react'
import './animation.scss'
import PropTypes from 'prop-types'
import { alterDots, createDots, createClusters } from './utils'
import { TICK_MS } from './constants'
import { getResource } from '../../pages/utils'

export class Animation extends Component {
  constructor(props) {
    super(props)
    const { clusters, dots, width, height } = this.createDots()
    const { color } = props.widgetData[0].style ?? {}
    const themeColor = getResource('theme_color', props.otherData.core)

    this.ctx = null
    this.timer = null
    this.state = {
      height,
      width,
      dots,
      clusters,
      color: color ?? themeColor,
    }
  }

  componentDidMount() {
    this.timer = setInterval(this.handleOnTimerTick, TICK_MS)
  }

  componentWillUnmount() {
    if (this.timer) {
    }
    clearInterval(this.timer)
    this.timer = null
  }

  setRef = node => {
    this.ctx = node?.getContext('2d')
  }

  clearCanvas = ({ width, height }) => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, width, height)
    }
  }

  createDots = (x, y) => {
    const { widgetData } = this.props
    let { count, width, height } = widgetData[0].style ?? {}
    count = count ? parseInt(count, 10) : 200
    height = height ? parseInt(height, 10) : 400
    width = width ? parseInt(width, 10) : 400
    const clusters = createClusters({ count, width, height })
    const dots = createDots({ count, centerX: x ?? width / 2, centerY: y ?? height / 2, clusters })
    return { dots, clusters, width, height }
  }

  handleOnTimerTick = () => {
    const { dots, width, height, clusters } = this.state
    const { clusters: newClusters, dots: newDots } = alterDots({ dots, width, height, clusters })
    this.setState({ dots: newDots, clusters: newClusters })
  }

  handleOnMouseDown = event => {
    const { left, top } = event.target.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top
    const { dots, clusters } = this.createDots(x, y)
    this.setState({ dots, clusters })
  }

  renderCanvas = data => {
    const { style } = data
    const { width, height } = this.state

    if (this.ctx) {
      this.clearCanvas({ width: width + 5, height: height + 5 })
      this.renderDots(data)
    }

    return (
      <canvas
        width={width + 5}
        height={height + 5}
        onMouseDown={this.handleOnMouseDown}
        ref={this.setRef}
        style={style}
      />
    )
  }

  renderDots = () => {
    const { dots, color } = this.state
    this.ctx.fillStyle = color
    this.strokeStyle = color

    dots.forEach(dot => {
      const { x, y } = dot
      this.ctx.fillRect(x, y, 3, 3)
    })
  }

  render() {
    const { id, widgetData, style } = this.props

    return (
      <div className="animation" style={style} key={`widget-animation-${id}`}>
        {this.renderCanvas(widgetData[0])}
      </div>
    )
  }
}

Animation.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  otherData: PropTypes.shape({
    core: PropTypes.array,
  }).isRequired,
}
