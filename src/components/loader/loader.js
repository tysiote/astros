import React, { Component } from 'react'
import propTypes from 'prop-types'
import { RingLoader } from 'react-spinners'
import './loader.scss'

export class Loader extends Component {
  constructor(props) {
    super(props)

    this.state = { dots: props.dotsTimer ? 3 : 0 }
    this.timer = null
  }

  componentDidMount() {
    const { dotsTimer } = this.props
    if (dotsTimer) {
      this.timer = setInterval(this.handleOnDotsTimer, dotsTimer)
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  handleOnDotsTimer = () => {
    const { dots } = this.state

    this.setState({ dots: dots === 3 ? 1 : dots + 1 })
  }

  render() {
    const { children, color } = this.props
    const { dots } = this.state

    return (
      <div className="loader">
        <div className="loader-spinner">
          <RingLoader loading={true} size={150} color={color} />
        </div>
        <div className="loader-text">
          {children}
          {' . '.repeat(dots)}
        </div>
      </div>
    )
  }
}

Loader.propTypes = {
  children: propTypes.node,
  color: propTypes.string,
  dotsTimer: propTypes.number,
}

Loader.defaultProps = {
  children: null,
  color: '#FAFAFA',
  dotsTimer: 500,
}
