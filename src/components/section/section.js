import React, { Component } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import './section.scss'
import { determineSectionColumns, getBackendURL, getResource, getSectionContentOrder } from '../../pages/utils'
import { Address, Form, SocialNetworks, LogoTiles, NumericTiles, FullTiles, Article, Animation, Image } from '../index'
import { Element } from 'react-scroll'
import { InView } from 'react-intersection-observer'

export class Section extends Component {
  constructor(props) {
    super(props)

    const order = getSectionContentOrder(props.sectionData)
    this.state = {
      order,
      flex: determineSectionColumns(order),
    }
  }

  renderHeading = item => {
    const { style, value, id, position } = item

    return (
      <div
        className={classNames('section-header', { right: position === 'right', center: position === 'center' })}
        key={`section-header-${id}`}
        style={style}
      >
        <h2>{value}</h2>
      </div>
    )
  }

  renderDescription = item => {
    const { style, value, id, position } = item
    const { maxWidth, ...restStyle } = style

    return (
      <div
        className={classNames('section-description', { right: position === 'right', center: position === 'center' })}
        key={`section-description-${id}`}
        style={restStyle}
      >
        <div style={{ maxWidth, whiteSpace: 'pre-wrap' }} className="section-description-content">
          {value}
        </div>
      </div>
    )
  }

  renderWidget = item => {
    const { otherData, lang } = this.props
    const { type, position, id } = item
    const className = classNames('section-widget', { right: position === 'right', center: position === 'center' })

    switch (type) {
      case 'full_tiles':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <FullTiles {...item} lang={lang} otherData={otherData} />
          </div>
        )
      case 'logos':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <LogoTiles {...item} lang={lang} otherData={otherData} />
          </div>
        )
      case 'numeric_tiles':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <NumericTiles lang={lang} {...item} otherData={otherData} />
          </div>
        )
      case 'address':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <Address {...item} lang={lang} otherData={otherData} />
          </div>
        )
      case 'social':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <SocialNetworks lang={lang} {...item} otherData={otherData} />
          </div>
        )
      case 'form':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <Form {...item} lang={lang} otherData={otherData} />
          </div>
        )
      case 'article':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <Article {...item} lang={lang} otherData={otherData} />
          </div>
        )
      case 'animation':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <Animation {...item} lang={lang} otherData={otherData} />
          </div>
        )
      case 'image':
        return (
          <div className={className} key={`section-widget-${id}`}>
            <Image {...item} lang={lang} otherData={otherData} />
          </div>
        )
      default:
        return null
    }
  }

  renderSection = (item, content) => {
    const {
      onViewChanged,
      fromGroup,
      otherData: { core },
      isEmpty,
    } = this.props
    const assetsPath = getResource('assets_path', core)
    const { position, style, path: itemPath, id } = item
    const path = itemPath ?? style?.backgroundPath

    return (
      <Element
        name={`section-${id}`}
        key={`section-${id}`}
        className={isEmpty ? 'section-dummy' : 'section-wrapper'}
        style={!isEmpty ? { backgroundImage: `url(${getBackendURL()}${assetsPath}${path})` } : null}
      >
        <div className={classNames('section', { full: position === 'full' })} style={style}>
          {!fromGroup && (
            <InView as="div" onChange={(inView, entry) => onViewChanged(id, inView, entry)}>
              <div className="section-viewer" />
            </InView>
          )}
          {path ? <div className="section-content">{content}</div> : <div className="section-content">{content}</div>}
        </div>
      </Element>
    )
  }

  renderGroup = item => {
    const { otherData, onViewChanged, lang } = this.props

    return (
      <div className="section-group" key={`section-group-${item.id}`}>
        {item.items.map(itm => (
          <Section
            sectionData={[itm]}
            otherData={otherData}
            key={`section-${itm.id}`}
            onViewChanged={onViewChanged}
            fromGroup={true}
            isEmpty={itm.type === 'section'}
            lang={lang}
          />
        ))}
      </div>
    )
  }

  render() {
    const { sectionData } = this.props
    const content = sectionData.map(item => {
      const { type } = item

      switch (type) {
        case 'heading':
          return this.renderHeading(item)
        case 'description':
          return this.renderDescription(item)
        case 'group':
          return this.renderGroup(item)
        case 'section':
          return null
        default:
          return this.renderWidget(item)
      }
    })

    return this.renderSection(sectionData[0], content)
  }
}

Section.propTypes = {
  sectionData: propTypes.array,
  otherData: propTypes.object,
  lang: propTypes.string.isRequired,
  onViewChanged: propTypes.func.isRequired,
  fromGroup: propTypes.bool,
  isEmpty: propTypes.bool,
}

Section.defaultProps = {
  sectionData: null,
  otherData: null,
  fromGroup: false,
  isEmpty: false,
}
