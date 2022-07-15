import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './numeric-tiles.scss'
import { getTranslationById } from '../../pages/utils'

export class NumericTiles extends Component {
  renderOneTile = tile => {
    const {
      lang,
      otherData: { translations },
    } = this.props
    const { id, title, description, style } = tile
    const { titleColor, descriptionColor, footerColor, titleSize, descriptionSize, minHeight, height, ...restStyle } =
      style ?? {}

    const trans = getTranslationById({ translations, lang, widgetId: id })

    return (
      <div
        className="numeric-tile"
        key={`numeric-tile-${id}`}
        style={{ ...restStyle, minHeight: minHeight, height: minHeight }}
      >
        <div className="numeric-tile-content">
          <div className="numeric-tile-title" style={{ color: titleColor, fontSize: titleSize }}>
            {trans?.title ?? title}
          </div>
          <div className="numeric-tile-description" style={{ color: descriptionColor, fontSize: descriptionSize }}>
            {trans?.description ?? description}
          </div>
        </div>
        <div className="numeric-tile-footer" style={{ borderColor: footerColor }} />
      </div>
    )
  }
  render() {
    const { id, widgetData } = this.props

    return (
      <div className="numeric-tiles" key={`widget-numeric-tiles-${id}`}>
        {widgetData.map(widget => this.renderOneTile(widget))}
      </div>
    )
  }
}

NumericTiles.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  lang: PropTypes.string.isRequired,
  otherData: PropTypes.shape({
    core: PropTypes.array,
    translations: PropTypes.array,
  }).isRequired,
}
