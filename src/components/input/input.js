import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './input.scss'

export const Input = ({
  label,
  className: inputClassName,
  id,
  placeholder,
  value,
  onChange,
  disabled,
  inputRef,
  textarea,
  suffix,
  type,
  ...rest
}) => {
  const [val, setVal] = useState(value ?? '')

  useEffect(() => {
    setVal(value ?? '')
  }, [value])
  const handleOnChange = e => {
    setVal(e.target.value)
    onChange(e.target.value, e)
  }
  const commonProps = {
    disabled,
    id,
    placeholder,
    onChange: handleOnChange,
    value: val,
    ref: inputRef,
    type,
  }
  return (
    <div className={classNames('form-group', { suffix })}>
      <label htmlFor={id} className="form-group-label">
        {label}
      </label>
      {textarea ? (
        <div className="form-group-input-wrapper">
          <textarea {...commonProps} className={classNames('form-group-input textarea', inputClassName, { suffix })} />
          {suffix}
        </div>
      ) : (
        <div className="form-group-input-wrapper">
          <input
            {...rest}
            {...commonProps}
            autoComplete="off"
            className={classNames('form-group-input', inputClassName, { suffix })}
          />
          {suffix}
        </div>
      )}
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.node })]),
  textarea: PropTypes.bool,
  suffix: PropTypes.node,
  type: PropTypes.string,
}

Input.defaultProps = {
  label: null,
  className: null,
  placeholder: null,
  value: null,
  onChange: () => {},
  disabled: false,
  inputRef: () => {},
  textarea: false,
  suffix: null,
  type: 'text',
}
