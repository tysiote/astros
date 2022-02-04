import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './styler.scss'
import { Button } from '../button'
import { Drawer } from '../drawer'

export const Styler = ({ className, label, onSave, ...props }) => {
  const [visible, setVisible] = useState(false)

  const handleOnStylerOpen = () => {
    setVisible(true)
  }

  const handleOnStylerClose = data => {
    setVisible(false)
    if (data) {
      onSave(data)
    }
  }

  return (
    <div className={classNames('styler', className)}>
      <Button className="styler-button" onClick={handleOnStylerOpen}>
        {label}
      </Button>
      <Drawer {...props} visible={visible} onDismiss={() => handleOnStylerClose()} onSave={handleOnStylerClose} />
    </div>
  )
}

Styler.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onSave: PropTypes.func,
}

Styler.defaultProps = {
  classNames: null,
  label: null,
  onSave: () => {},
}
