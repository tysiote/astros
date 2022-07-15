import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getBackendURL, getResource } from '../../pages/utils'
import './image.scss'

export const Image = ({ className, style, otherData: { core }, widgetData }) => {
  const assetsPath = getResource('assets_path', core)
  const { path } = widgetData?.[0] ?? {}
  const height = style?.minHeight ?? '100%'
  const width = style?.maxWidth ?? '100%'
  const finalStyle = { ...style, backgroundImage: `url(${getBackendURL()}${assetsPath}${path})`, height, width }

  return <div className={classNames('image', className)} style={finalStyle} />
}

Image.propTypes = {
  otherData: PropTypes.object.isRequired,
  widgetData: PropTypes.array.isRequired,
  className: PropTypes.string,
  path: PropTypes.string,
  style: PropTypes.object,
}

Image.defaultProps = {
  className: null,
  path: null,
  style: {},
}
