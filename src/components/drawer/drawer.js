import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './drawer.scss'
import { Button } from '../button'

import { Switch } from '../switch'
import { Uploader } from '../uploader'
import { ColorPicker } from '../color-picker'
import { Input } from '../input'
import { getBackendURL } from '../../pages/utils'

export const Drawer = ({
  className,
  visible,
  onDismiss,
  onSave,
  title,
  hasMargins,
  hasBgColor,
  hasColor,
  hasFontStyles,
  hasMaxWidth,
  hasPaddings,
  hasMinHeight,
  hasIconSize,
  hasFooterColor,
  hasShowLogo,
  hasButtonBgColor,
  hasButtonColor,
  styles,
}) => {
  if (!visible) {
    return <div className="drawer" />
  }

  const [disabled, setDisabled] = useState(false)
  const [bgMode, setBgMode] = useState(false)
  const [color, setColor] = useState(styles.color ?? '')
  const [bgColor, setBgColor] = useState(styles.backgroundColor ?? '')
  const [bgImage, setBgImage] = useState(styles.backgroundPath ? { file_name: styles.backgroundPath } : null)
  const [footerColor, setFooterColor] = useState(styles.footerColor ?? '')
  const [width, setWidth] = useState(styles.maxWidth ?? '')
  const [height, setHeight] = useState(styles.minHeight ?? '')
  const [icon, setIcon] = useState(styles.iconSize ?? '')
  const [showLogo, setShowLogo] = useState(styles.hasLogo ?? false)
  const [buttonColor, setButtonColor] = useState(styles.buttonColor ?? '')
  const [buttonBgColor, setButtonBgColor] = useState(styles.buttonBgColor ?? '')
  const [paddings, setPaddings] = useState([
    styles.paddingTop ?? '',
    styles.paddingRight ?? '',
    styles.paddingBottom ?? '',
    styles.paddingLeft ?? '',
  ])
  const [margins, setMargins] = useState([
    styles.marginTop ?? '',
    styles.marginRight ?? '',
    styles.marginBottom ?? '',
    styles.marginLeft ?? '',
  ])
  const [fontStyles, setFontStyles] = useState({
    bold: styles.fontWeight === 'bold' ?? false,
    italic: styles.fontStyle === 'italic' ?? false,
    underline: styles.textDecoration === 'underline' ?? false,
    size: styles.fontSize ?? '14px',
  })

  const paddingTypes = ['Top', 'Right', 'Bottom', 'Left']
  const paddingInputs = paddingTypes.map((type, idx) => (
    <Input
      value={paddings[idx]}
      label={type}
      onChange={val => handleOnPaddingsChange(idx, val)}
      id={`drawer-paddings-${idx}`}
      key={`drawer-paddings-${idx}`}
      disabled={disabled}
    />
  ))

  const marginTypes = ['Top', 'Right', 'Bottom', 'Left']
  const marginInputs = marginTypes.map((type, idx) => (
    <Input
      value={margins[idx]}
      label={type}
      onChange={val => handleOnMarginsChange(idx, val)}
      id={`drawer-margins-${idx}`}
      key={`drawer-margins-${idx}`}
      disabled={disabled}
    />
  ))

  const handleOnBackgroundModeChange = newMode => setBgMode(newMode)
  const handleOnColorChange = newValue => setColor(newValue)
  const handleOnFooterColorChange = newValue => setFooterColor(newValue)
  const handleOnBgColorChange = newValue => setBgColor(newValue)
  const handleOnButtonColorChange = newValue => setButtonColor(newValue)
  const handleOnButtonBgColorChange = newValue => setButtonBgColor(newValue)

  const handleOnPaddingsChange = (idx, val) => {
    const newPaddings = [...paddings]
    newPaddings[idx] = val
    setPaddings(newPaddings)
  }
  const handleOnMarginsChange = (idx, val) => {
    const newMargins = [...margins]
    newMargins[idx] = val
    setMargins(newMargins)
  }

  const handleOnUploadStart = () => {
    setDisabled(true)
  }

  const handleOnUploadFinish = res => {
    setDisabled(false)
    setBgImage(res.data)
  }

  const handleOnWidthChange = newWidth => setWidth(newWidth)
  const handleOnHeightChange = newHeight => setHeight(newHeight)
  const handleOnIconChange = newSize => setIcon(newSize)

  const handleOnFontStyleChanges = (key, val) => setFontStyles({ ...fontStyles, [key]: val })
  const handleOnShowLogoChange = newValue => setShowLogo(newValue)

  const handleOnSave = () => {
    const saveData = {}
    if (hasMaxWidth) {
      saveData.maxWidth = width ?? undefined
    }
    if (hasMinHeight) {
      saveData.minHeight = height ?? undefined
    }
    if (hasIconSize) {
      saveData.iconSize = icon ?? undefined
    }
    if (hasColor) {
      saveData.color = color ?? undefined
    }
    if (hasFooterColor) {
      saveData.footerColor = footerColor ?? undefined
    }
    if (hasBgColor) {
      if (bgMode) {
        saveData.backgroundPath = bgImage.file_name
        saveData.backgroundAssetId = bgImage.last_id
      } else {
        saveData.backgroundColor = bgColor ?? undefined
      }
    }

    if (hasMargins) {
      saveData.marginTop = margins[0] ?? undefined
      saveData.marginRight = margins[1] ?? undefined
      saveData.marginBottom = margins[2] ?? undefined
      saveData.marginLeft = margins[3] ?? undefined
    }

    if (hasPaddings) {
      saveData.paddingTop = paddings[0] ?? undefined
      saveData.paddingRight = paddings[1] ?? undefined
      saveData.paddingBottom = paddings[2] ?? undefined
      saveData.paddingLeft = paddings[3] ?? undefined
    }

    if (hasFontStyles) {
      saveData.fontSize = fontStyles.size ?? undefined
      saveData.fontWeight = fontStyles.bold ? 'bold' : undefined
      saveData.fontStyle = fontStyles.italic ? 'italic' : undefined
      saveData.textDecoration = fontStyles.underline ? 'underline' : undefined
    }

    if (hasShowLogo) {
      saveData.hasLogo = showLogo || undefined
    }

    if (hasButtonColor) {
      saveData.buttonColor = buttonColor || undefined
    }

    if (hasButtonBgColor) {
      saveData.buttonBgColor = buttonBgColor || undefined
    }

    onSave(saveData)
  }

  const colorPart = hasColor ? (
    <div className="styler-part">
      <h2>Color</h2>
      <ColorPicker onChange={handleOnColorChange} value={color} disabled={disabled} />
    </div>
  ) : null

  const footerPart = hasFooterColor ? (
    <div className="styler-part">
      <h2>Footer color</h2>
      <ColorPicker onChange={handleOnFooterColorChange} value={footerColor} disabled={disabled} />
    </div>
  ) : null

  const backgroundPart = hasBgColor ? (
    <div className="styler-part">
      <h2>Background</h2>
      <Switch
        onChange={val => handleOnBackgroundModeChange(val)}
        checked={bgMode}
        label="Background image:"
        disabled={disabled}
      />
      {bgMode ? (
        <Uploader
          path={getBackendURL()}
          disabled={disabled}
          onUploadStart={handleOnUploadStart}
          onUploadFinish={handleOnUploadFinish}
          label={bgImage?.['file_name']}
        />
      ) : (
        <ColorPicker onChange={handleOnBgColorChange} value={bgColor} disabled={disabled} />
      )}
    </div>
  ) : null

  const paddingsPart = hasPaddings ? (
    <div className="styler-part">
      <h2>Paddings</h2>
      {paddingInputs}
    </div>
  ) : null

  const marginsPart = hasMargins ? (
    <div className="styler-part">
      <h2>Margins</h2>
      {marginInputs}
    </div>
  ) : null

  const heightPart = hasMinHeight ? (
    <div className="styler-part">
      <h2>Minimum height</h2>
      <Input
        value={height}
        onChange={handleOnHeightChange}
        id="styler-height"
        label="Minimum height in px:"
        placeholder="Place numeric values only"
        disabled={disabled}
      />
    </div>
  ) : null

  const widthPart = hasMaxWidth ? (
    <div className="styler-part">
      <h2>Maximum width</h2>
      <Input
        value={width}
        onChange={handleOnWidthChange}
        id="styler-width"
        label="Maximum width:"
        placeholder="Use either as 60% or 400px"
        disabled={disabled}
      />
    </div>
  ) : null

  const iconPart = hasIconSize ? (
    <div className="styler-part">
      <h2>Icon size</h2>
      <Input
        value={icon}
        onChange={handleOnIconChange}
        id="styler-width"
        label="Icon size:"
        placeholder="Use 1x, 2x, 3x, ... 8x values only"
        disabled={disabled}
      />
    </div>
  ) : null

  const fontStylesPart = hasFontStyles ? (
    <div className="styler-part">
      <h2>Font styles</h2>
      <Switch
        onChange={val => handleOnFontStyleChanges('bold', val)}
        checked={fontStyles.bold}
        label="Bold:"
        disabled={disabled}
      />
      <Switch
        onChange={val => handleOnFontStyleChanges('italic', val)}
        checked={fontStyles.italic}
        label="Italic:"
        disabled={disabled}
      />
      <Switch
        onChange={val => handleOnFontStyleChanges('underline', val)}
        checked={fontStyles.underline}
        label="Underline:"
        disabled={disabled}
      />
      <Input
        value={fontStyles.size}
        onChange={val => handleOnFontStyleChanges('size', val)}
        label="Size:"
        id="drawer-font-size"
        disabled={disabled}
      />
    </div>
  ) : null

  const showLogoPart = hasShowLogo ? (
    <div className="styler-part">
      <h2>Logo</h2>
      <Switch
        onChange={val => handleOnShowLogoChange(val)}
        checked={showLogo}
        label="Show company logo:"
        disabled={disabled}
      />
    </div>
  ) : null

  const buttonColorPart = hasButtonColor ? (
    <div className="styler-part">
      <h2>Text color</h2>
      <ColorPicker onChange={handleOnButtonColorChange} value={buttonColor} disabled={disabled} />
    </div>
  ) : null

  const buttonBgColorPart = hasButtonBgColor ? (
    <div className="styler-part">
      <h2>Background color</h2>
      <ColorPicker onChange={handleOnButtonBgColorChange} value={buttonBgColor} disabled={disabled} />
    </div>
  ) : null

  return (
    <div className={classNames('drawer', className, { visible })}>
      <div className="drawer-inner">
        {title && (
          <div className="drawer-header">
            <h2>{title}</h2>
          </div>
        )}

        <div className="drawer-content">
          {colorPart}
          {footerPart}
          {backgroundPart}
          {widthPart}
          {heightPart}
          {fontStylesPart}
          {iconPart}
          {paddingsPart}
          {marginsPart}
          {showLogoPart}
          {buttonColorPart}
          {buttonBgColorPart}
        </div>

        <div className="drawer-footer">
          <Button onClick={onDismiss} disabled={disabled}>
            Dismiss
          </Button>
          <Button className="primary" onClick={handleOnSave} disabled={disabled}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

Drawer.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
  hasColor: PropTypes.bool,
  hasBgColor: PropTypes.bool,
  hasMargins: PropTypes.bool,
  hasFontStyles: PropTypes.bool,
  hasPaddings: PropTypes.bool,
  hasMinHeight: PropTypes.bool,
  hasMaxWidth: PropTypes.bool,
  hasIconSize: PropTypes.bool,
  hasFooterColor: PropTypes.bool,
  hasShowLogo: PropTypes.bool,
  hasButtonColor: PropTypes.bool,
  hasButtonBgColor: PropTypes.bool,
  styles: PropTypes.object,
}

Drawer.defaultProps = {
  className: null,
  visible: false,
  title: null,
  hasColor: false,
  hasBgColor: false,
  hasMargins: false,
  hasFontStyles: false,
  hasPaddings: false,
  hasMinHeight: false,
  hasMaxWidth: false,
  hasIconSize: false,
  hasFooterColor: false,
  hasShowLogo: false,
  hasButtonColor: false,
  hasButtonBgColor: false,
  styles: {},
}
