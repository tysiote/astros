import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './button.scss'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconList = Object.keys(Icons)
  .filter(key => key !== 'fas' && key !== 'prefix')
  .map(icon => Icons[icon])

library.add(...iconList)
console.log(library)

export const Button = ({ children, type, onClick, className, icon, disabled, disabledText }) => {
  return (
    <button type={type} onClick={onClick} className={classNames('button', className, { disabled })} disabled={disabled}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {disabled ? disabledText ?? children : children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  type: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  disabledText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

Button.defaultProps = {
  children: null,
  type: 'button',
  onClick: () => {},
  className: null,
  icon: null,
  disabled: false,
  disabledText: null,
}
