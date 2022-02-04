import React from 'react'
import ReactSwitch from 'react-switch'
import './switch.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const Switch = props => {
  const { label, ...rest } = props
  return (
    <div className={classNames('switch-wrapper', { 'with-label': !!label })}>
      {label && <label className="switch-label">{label}</label>}
      <ReactSwitch
        {...rest}
        onColor="#FF8A80"
        onHandleColor="#EF5350"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={15}
        width={30}
        className="switch"
      />
    </div>
  )
}

Switch.propTypes = {
  label: PropTypes.string,
}

Switch.defaultProps = {
  label: null,
}
