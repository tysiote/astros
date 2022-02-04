import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './color-picker.scss'
import { Input } from '../input'
import { Button } from '../button'
import { Modal } from '../modal'
import { COLORS } from './constants'
import { capitalizeString } from '../../pages/utils'

export const ColorPicker = ({ disabled, onChange, value: defaultValue, id, className, label }) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [value, setValue] = useState(defaultValue ?? '')
  const [colorSelected, setColorSelected] = useState(null)

  const handleOnModalOpen = () => {
    setModalOpened(true)
  }

  const handleOnModalClose = newValue => {
    setModalOpened(false)

    if (newValue) {
      setValue(newValue)
      handleOnColorInputChange(newValue)
    }
  }

  const handleOnColorInputChange = newValue => {
    onChange(newValue)
  }

  const handleOnColorClicked = color => {
    setColorSelected(color)
  }

  const renderOneColorTile = (color, family) => {
    const { title, value, alt } = color
    return (
      <div
        key={`color-picker-tile-${family}-${title}`}
        className="color-picker-color-tile"
        style={{ backgroundColor: value, color: alt, borderColor: alt }}
        onClick={() => handleOnColorClicked({ ...color, family })}
      >
        {title}
      </div>
    )
  }

  const renderColorColumn = (title, colors) => {
    return (
      <div className="color-picker-color-column" key={`color-picker-column-${title}`}>
        <div className="color-picker-color-tile" style={{ color: title.toLowerCase().replace(' ', '') }}>
          {capitalizeString(title)}
        </div>
        {colors.map(color => {
          return renderOneColorTile(color, title)
        })}
      </div>
    )
  }

  return (
    <div className={classNames('color-picker', className)} id={id}>
      <Input
        className="color-picker-input"
        label={label}
        disabled={disabled}
        value={value}
        onChange={handleOnColorInputChange}
        id={`${id}-input`}
      />
      <Button onClick={handleOnModalOpen}>Pick a predefined color</Button>
      <Modal visible={modalOpened} onOverlayClick={handleOnModalClose} title="Pick a predefined color">
        <div className="color-palette">
          {Object.entries(COLORS).map(([key, value]) => {
            return renderColorColumn(key, value)
          })}
        </div>
        <div className="color-palette-footer">
          <div className="color-showcase" style={{ backgroundColor: colorSelected?.value, color: colorSelected?.alt }}>
            {colorSelected ? `${colorSelected.family} ${colorSelected.title} (${colorSelected.value})` : null}
          </div>
          <div className="color-palette-controls">
            <Button onClick={() => handleOnModalClose()}>Cancel</Button>
            <Button className="primary" onClick={() => handleOnModalClose(colorSelected?.value)}>
              Choose
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

ColorPicker.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
}

ColorPicker.defaultProps = {
  disabled: false,
  onChange: () => {},
  value: null,
  className: null,
  label: 'Choose a color',
}
