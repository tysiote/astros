import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Article extends Component {
  renderOneItem = item => {
    const { id, title, style } = item
    const { isHeading, ...restStyle } = style ?? {}

    return (
      <div className="article-item" key={`widget-article-${id}`} style={restStyle}>
        {isHeading ? <h2 style={restStyle}>{title}</h2> : <div style={restStyle}>{title}</div>}
      </div>
    )
  }

  render() {
    const { id, widgetData, style } = this.props

    return (
      <div className="article" key={`widget-article-${id}`} style={style}>
        {widgetData.map(widget => this.renderOneItem(widget))}
      </div>
    )
  }
}

Article.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  style: PropTypes.object,
}
