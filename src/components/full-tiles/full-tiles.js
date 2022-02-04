import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import './full-tiles.scss'
import { getBackendURL, getResource } from '../../pages/utils'

const iconList = Object.keys(Icons)
  .filter(key => key !== 'fas' && key !== 'prefix')
  .map(icon => Icons[icon])

library.add(...iconList)

export class FullTiles extends Component {
  renderOneTile = tile => {
    const {
      otherData: { core },
    } = this.props
    const assetsPath = getResource('assets_path', core)
    const { icon, title, description, id, style, path } = tile
    const { titleColor, descriptionColor, iconColor, footerColor, iconSize, titleSize, descriptionSize, ...restStyle } =
      style ?? {}

    const content = (
      <>
        <div className="full-tile-content">
          {icon && (
            <div className="full-tile-header" style={{ color: iconColor }}>
              <FontAwesomeIcon icon={icon} color={iconColor} size={iconSize} />
            </div>
          )}
          <div className="full-tile-title" style={{ color: titleColor, fontSize: titleSize }}>
            {title}
          </div>
          <div className="full-tile-description" style={{ color: descriptionColor, fontSize: descriptionSize }}>
            {description}
          </div>
        </div>
        <div className="full-tile-footer" style={{ borderColor: footerColor }} />
      </>
    )

    return path ? (
      <div className="full-tile" key={`full-tile-${id}`} style={restStyle}>
        <div
          className="full-tile-background"
          style={{ backgroundImage: `url(${getBackendURL()}${assetsPath}${path})` }}
        >
          {content}
        </div>
      </div>
    ) : (
      <div className="full-tile" key={`full-tile-${id}`} style={restStyle}>
        {content}
      </div>
    )
  }

  render() {
    const { id, widgetData } = this.props
    return (
      <div className="full-tiles" key={`widget-full-tiles-${id}`}>
        {widgetData.map(widget => this.renderOneTile(widget))}
      </div>
    )
  }
}

FullTiles.propTypes = {
  widgetData: PropTypes.array.isRequired,
  otherData: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}
