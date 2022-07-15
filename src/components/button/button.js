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

export const Button = ({ children, type, onClick, className, icon, disabled, disabledText, hint, ...rest }) => {
  return (
    <button
      {...rest}
      type={type}
      onClick={onClick}
      className={classNames('button', className, { disabled })}
      disabled={disabled}
      title={hint}
    >
      {icon && (
        <div className="button-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
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
  hint: PropTypes.string,
}

Button.defaultProps = {
  children: null,
  type: 'button',
  onClick: () => {},
  className: null,
  icon: null,
  disabled: false,
  disabledText: null,
  hint: null,
}
