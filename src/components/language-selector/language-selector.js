import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './language-selector.scss'
import { getActiveLanguages, getBackendURL, getLanguageByAbbr, getResource } from '../../pages/utils'

const useHover = () => {
  const ref = useRef()
  const _ref = useRef()
  const [hovered, setHovered] = useState(false)

  const enter = () => {
    setHovered(true)
  }
  const leave = () => {
    setHovered(false)
  }

  useEffect(() => {
    if (ref.current) {
      _ref.current = ref.current
      _ref.current.addEventListener('mouseenter', enter)
      _ref.current.addEventListener('mouseleave', leave)
    }

    return () => {
      if (_ref.current) {
        _ref.current.removeEventListener('mouseenter', enter)
        _ref.current.removeEventListener('mouseleave', leave)
      }
    }
  }, [])

  return [ref, hovered]
}

export const LanguageSelector = ({ languages, onChange, otherData: { core }, selected }) => {
  const activeLanguages = getActiveLanguages(languages)
  const assetsPath = getResource('assets_path', core)
  const themeColor = getResource('theme_color', core)
  const [opened, setOpened] = useState(false)
  const selectedLanguage = getLanguageByAbbr(activeLanguages, selected)

  const handleOnLanguageClick = abbr => {
    setOpened(false)
    onChange(abbr)
  }

  const handleOnOpenClick = () => {
    setOpened(!opened)
  }

  if (activeLanguages.length < 2) {
    return null
  }

  const [ref, hovered] = useHover()

  return (
    <div className="language-selector">
      <div
        className="language-selected"
        onClick={handleOnOpenClick}
        ref={ref}
        style={{ color: hovered ? themeColor : null }}
      >
        <div
          className="language-flag"
          style={{ backgroundImage: `url(${getBackendURL()}${assetsPath}${selectedLanguage.path})` }}
        />
        <div className="language-title">{selectedLanguage.abbr.toUpperCase()}</div>
      </div>
      {opened && (
        <div className="language-menu">
          {activeLanguages.map(lang => (
            <div
              className={classNames('language-item', { selected: lang.abbr === selected })}
              key={`language-item-${lang.abbr}-key`}
              onClick={() => handleOnLanguageClick(lang.abbr)}
            >
              <div
                className="language-flag"
                style={{ backgroundImage: `url(${getBackendURL()}${assetsPath}${lang.path})` }}
              />
              <div className="language-title">{lang.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

LanguageSelector.propTypes = {
  languages: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  otherData: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
}
