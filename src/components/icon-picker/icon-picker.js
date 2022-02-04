import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button, Input, Modal } from '../index'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import * as Icons2 from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './icon-picker.scss'

let iconList = Object.keys(Icons)
  .filter(key => key !== 'fas' && key !== 'prefix')
  .map(icon => Icons[icon])
library.add(...iconList)

iconList = Object.keys(Icons2)
  .filter(key => key !== 'fab' && key !== 'prefix')
  .map(icon => Icons2[icon])
library.add(...iconList)

export const IconPicker = ({ className, value, onChange, color, label, onlyBrands }) => {
  const [opened, setOpened] = useState(false)
  const [icon, setIcon] = useState(value)
  const [prefix, setPrefix] = useState(onlyBrands ? 'fab' : 'fas')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setIcon(value)
  }, [value])

  const handleOnModalOpen = () => {
    setOpened(true)
  }

  const handleOnSearchChange = newValue => setSearchValue(newValue)

  const handleOnModalClose = newValue => {
    if (newValue) {
      onChange(newValue)
    }
    setSearchValue('')

    setOpened(false)
  }

  const handleOnIconSelect = (iconName, key) => {
    setIcon(iconName)
    setPrefix(key)
  }

  const renderIconList = key => {
    return (
      <div className="icon-picker-icon-list">
        <h2>{key === 'fab' ? 'Brands' : 'Solid'}</h2>
        {Object.entries(library.definitions[key])
          .filter(iconName => {
            return !searchValue.length || iconName[0].toLowerCase().includes(searchValue.toLowerCase())
          })
          .map(
            ([iconName]) =>
              !iconName.includes('font-awesome') && (
                <div
                  className={classNames('icon-picker-icon', { selected: iconName === icon })}
                  key={`icon-picker-${iconName}`}
                  onClick={() => handleOnIconSelect(iconName, key)}
                >
                  <FontAwesomeIcon icon={[key, iconName]} color={color} size={'2x'} />
                </div>
              ),
          )}
      </div>
    )
  }

  return (
    <div className={classNames('icon-picker', className)}>
      {label && <label>{label}</label>}
      <div className="icon-picker-status">
        <Input
          label="Selected icon:"
          id="icon-picker-icon"
          className="icon-picker-icon"
          value={icon ?? ''}
          suffix={icon ? <FontAwesomeIcon icon={[prefix, icon]} size={'2x'} color={color} /> : <div />}
        />
      </div>
      <Button onClick={handleOnModalOpen} className="" id="icon-picker">
        Select an icon
      </Button>
      <Modal visible={opened} onOverlayClick={() => handleOnModalClose()} title="Icon picker">
        <div className="icons-search">
          <Input onChange={handleOnSearchChange} value={searchValue} placeholder="Search an icon" />
        </div>
        <div className="icons-container">
          {!onlyBrands && renderIconList('fas')}
          {renderIconList('fab')}
        </div>
        <div className="icon-picker-footer">
          <div className="icon-picker-icon-name">
            {`Selected icon: ${icon}`}
            {icon && <FontAwesomeIcon icon={[prefix, icon]} className="selected-icon" size={'2x'} />}
          </div>
          <div className="icon-picker-controls">
            <Button onClick={() => handleOnModalClose()}>Cancel</Button>
            <Button className="primary" onClick={() => handleOnModalClose(icon)}>
              Choose
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

IconPicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  color: PropTypes.string,
  label: PropTypes.string,
  onlyBrands: PropTypes.bool,
}

IconPicker.defaultProps = {
  className: null,
  onChange: () => {},
  color: '#EF5350',
  label: null,
  onlyBrands: false,
}
