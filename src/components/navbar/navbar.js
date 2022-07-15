import React, { Component } from 'react'
import propTypes from 'prop-types'
import { scroller } from 'react-scroll'
import classNames from 'classnames'
import './navbar.scss'
import { InView } from 'react-intersection-observer'
import { getBackendURL, getResource, getTranslationById } from '../../pages/utils'
import PropTypes from 'prop-types'
import { LanguageSelector } from '../language-selector'

export class Navbar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      atTop: true,
      hoveredItem: null,
    }

    const {
      otherData: { core },
    } = props
    const browserTitle = getResource('browser_title', core)
    const browserLogo = getResource('browser_logo', core)
    const assetsPath = getResource('assets_path', core)

    if (document.title !== browserTitle) {
      document.title = browserTitle
    }
    document.getElementById('favicon').href = `${getBackendURL()}/${assetsPath}/${browserLogo}`
  }

  handleOnClick = id => {
    scroller.scrollTo(`section-${id}`, {
      duration: 500,
      delay: 100,
      smooth: true,
    })
  }

  handleOnNavbarObserverChanged = visible => {
    this.setState({ atTop: visible })
  }

  handleOnMouseEnter = id => {
    this.setState({
      hoveredItem: id,
    })
  }

  handleOnMouseLeave = () => {
    this.setState({
      hoveredItem: null,
    })
  }

  handleOnLanguageSelect = abbr => {
    const { onLanguageChange } = this.props

    onLanguageChange(abbr)
  }

  render() {
    const { sections, inViewId, otherData, languages, selectedLanguage } = this.props
    const { atTop, hoveredItem } = this.state
    const { core, translations } = otherData
    const assetsPath = getResource('assets_path', core)
    const themeColor = getResource('theme_color', core)
    const logoPath = getResource('logo_path', core)
    const brandName = getResource('brand_name', core)

    return (
      <>
        <InView as="div" onChange={inView => this.handleOnNavbarObserverChanged(inView)}>
          <div className="navbar-observer" />
        </InView>
        <div className={classNames('navbar', { 'at-top': atTop })}>
          <div className="navbar-logo" onClick={() => this.handleOnClick(sections[0][0].id)}>
            <div
              className="logo"
              style={{
                backgroundImage: `url(${getBackendURL()}${assetsPath}${logoPath})`,
              }}
            />
            <div className="brand" style={{ color: themeColor }}>
              {brandName}
            </div>
          </div>
          <div className="navbar-items">
            {sections.map(section => {
              const isVisible = inViewId === section[0].id
              const trans = getTranslationById({ translations, lang: selectedLanguage, contentId: section[0].id })
              return (
                <div
                  className={classNames('navbar-item', { visible: isVisible })}
                  key={`navbar-${section[0].id}`}
                  onClick={() => this.handleOnClick(section[0].id)}
                  style={hoveredItem === section[0].id || isVisible ? { color: themeColor } : null}
                  onMouseEnter={() => this.handleOnMouseEnter(section[0].id)}
                  onMouseLeave={this.handleOnMouseLeave}
                >
                  {trans?.value ?? section[0].value}
                </div>
              )
            })}
            {languages && (
              <LanguageSelector
                otherData={otherData}
                languages={languages}
                onChange={this.handleOnLanguageSelect}
                selected={selectedLanguage}
              />
            )}
          </div>
        </div>
      </>
    )
  }
}

Navbar.propTypes = {
  sections: propTypes.array.isRequired,
  inViewId: propTypes.oneOfType([propTypes.string, propTypes.number]),
  otherData: PropTypes.shape({
    core: PropTypes.array,
    translations: PropTypes.array,
  }).isRequired,
  languages: PropTypes.array.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
}

Navbar.defaultProps = {
  inViewId: null,
}
