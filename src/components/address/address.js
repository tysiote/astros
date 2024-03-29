import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBackendURL, getResource } from '../../pages/utils'
import './address.scss'

export class Address extends Component {
  render() {
    const {
      id,
      widgetData,
      otherData: { core },
    } = this.props
    const assetsPath = getResource('assets_path', core)
    const logoPath = getResource('logo_path', core)
    const brandName = getResource('brand_name', core)
    const themeColor = getResource('theme_color', core)
    const { description, style } = widgetData[0]
    const { hasLogo, descriptionColor, descriptionSize, titleColor, titleSize, logoSize, ...restStyle } = style ?? {}

    return (
      <div className="address" key={`widget-address-${id}`} style={restStyle}>
        <div className="address-title">
          {(hasLogo || hasLogo === undefined) && (
            <div
              className="address-logo"
              style={{
                backgroundImage: `url(${getBackendURL()}${assetsPath}${logoPath})`,
                width: logoSize ?? '2x',
                height: logoSize ?? '2x',
              }}
            />
          )}
          <div className="address-brand" style={{ color: titleColor ?? themeColor, fontSize: titleSize }}>
            {brandName}
          </div>
        </div>
        <div className="address-description" style={{ fontSize: descriptionSize, color: descriptionColor }}>
          {description}
        </div>
      </div>
    )
  }
}

Address.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  otherData: PropTypes.shape({
    core: PropTypes.array,
  }).isRequired,
}
