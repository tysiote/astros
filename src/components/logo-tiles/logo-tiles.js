import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBackendURL, getResource } from '../../pages/utils'
import './logo-tiles.scss'

export class LogoTiles extends Component {
  handleOnTileClick = (event, url) => {
    window.open(url, '_blank').focus()
  }

  renderOneTile = logo => {
    const {
      otherData: { core },
    } = this.props
    const assetsPath = getResource('assets_path', core)
    const { url, path, style, id } = logo

    return (
      <div
        className="logo-tile"
        style={{ ...style, backgroundImage: `url(${getBackendURL()}${assetsPath}${path})` }}
        onClick={e => this.handleOnTileClick(e, url)}
        key={`logo-${id}`}
      />
    )
  }

  render() {
    const { id, widgetData } = this.props

    return (
      <div className="logo-tiles" key={`widget-logo-tiles-${id}`}>
        {widgetData?.map(widget => this.renderOneTile(widget))}
      </div>
    )
  }
}

LogoTiles.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  otherData: PropTypes.shape({
    core: PropTypes.array,
  }).isRequired,
  lang: PropTypes.string.isRequired,
}
