import React, { Component } from 'react'
import './social-networks.scss'
import PropTypes from 'prop-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import * as Icons2 from '@fortawesome/free-brands-svg-icons'

let iconList = Object.keys(Icons)
  .filter(key => key !== 'fas' && key !== 'prefix')
  .map(icon => Icons[icon])
library.add(...iconList)

iconList = Object.keys(Icons2)
  .filter(key => key !== 'fab' && key !== 'prefix')
  .map(icon => Icons2[icon])
library.add(...iconList)

export class SocialNetworks extends Component {
  handleOnIconClick = url => {
    window.open(url, '_blank').focus()
  }

  renderOneItem = item => {
    const { icon, url, id, style } = item
    const { iconColor, iconSize, ...restStyle } = style ?? {}

    return (
      <div className="social-networks-item" style={restStyle} key={`social-networks-item-${id}`}>
        <FontAwesomeIcon
          icon={['fab', icon]}
          color={iconColor}
          size={iconSize ?? '2x'}
          onClick={() => this.handleOnIconClick(url)}
        />
      </div>
    )
  }

  render() {
    const { id, widgetData, value, style } = this.props
    const { titleColor, titleSize, ...restStyle } = style ?? {}

    return (
      <div className="social-networks" key={`widget-social-networks-${id}`} style={restStyle}>
        <div className="social-networks-title" style={{ fontSize: titleSize, color: titleColor }}>
          {value}
        </div>
        <div className="social-networks-items">
          {widgetData.map(item => {
            return this.renderOneItem(item)
          })}
        </div>
      </div>
    )
  }
}

SocialNetworks.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
}
