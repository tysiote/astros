import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './modal.scss'

export const Modal = ({ className, children, onOverlayClick, visible, title }) => {
  const handleOnOverlayClick = () => {
    onOverlayClick()
  }

  const handleOnModalClick = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (!visible) {
    return null
  }

  return (
    <div className={classNames('modal', className)}>
      <div className="modal-overlay" onClick={handleOnOverlayClick}>
        <div className="modal-content" onClick={handleOnModalClick}>
          {title && <div className="modal-title">{title}</div>}
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onOverlayClick: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
}

Modal.defaultProps = {
  className: null,
  onOverlayClick: () => {},
  visible: false,
  title: null,
}
