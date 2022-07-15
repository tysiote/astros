import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findHyperLinksInText, getTranslationById } from '../../pages/utils'

export class Article extends Component {
  renderOneItem = item => {
    const {
      lang,
      otherData: { translations },
    } = this.props
    const { id, title, style } = item
    const { isHeading, ...restStyle } = style ?? {}
    const trans = getTranslationById({ translations, lang, widgetId: id })
    const text = trans?.title ?? title
    const textParts = findHyperLinksInText(text)

    return (
      <div className="article-item" key={`widget-article-${id}`} style={restStyle}>
        {isHeading ? (
          <h2 style={restStyle}>{text}</h2>
        ) : (
          <div style={restStyle}>
            {textParts.map(t =>
              typeof t === 'string' ? (
                t
              ) : (
                <a href={t.url} target="_blank" rel="noreferrer" style={restStyle}>
                  {t.namespace}
                </a>
              ),
            )}
          </div>
        )}
      </div>
    )
  }

  render() {
    const { id, widgetData, style } = this.props

    const header = widgetData.filter(wD => wD.style?.isHeading)?.[0]
    const description = widgetData.filter(wD => !wD.style?.isHeading)?.[0]

    return (
      <div className="article" key={`widget-article-${id}`} style={style}>
        {header && this.renderOneItem(header)}
        {description && this.renderOneItem(description)}
        {/*{widgetData.map(widget => this.renderOneItem(widget))}*/}
      </div>
    )
  }
}

Article.propTypes = {
  widgetData: PropTypes.array.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  style: PropTypes.object,
  lang: PropTypes.string.isRequired,
  otherData: PropTypes.shape({
    core: PropTypes.array,
    translations: PropTypes.array,
  }).isRequired,
}
