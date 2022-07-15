import React, { useState } from 'react'
import { Button, Input } from '../../components'
import { makePostRequest } from '../utils'
import PropTypes from 'prop-types'
import md5 from 'md5'

export const LoginDialog = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [fetching, setFetching] = useState(false)
  const [invalid, setInvalid] = useState(false)

  const handleOnChange = newValue => {
    setInvalid(false)
    setPassword(newValue)
  }

  const handleOnProceed = () => {
    setFetching(true)
    makePostRequest('login', { password: md5(password) }).then(result => {
      if (result.status === 'logged_in') {
        setFetching(false)
        onLogin()
      } else {
        setInvalid(true)
        setFetching(false)
      }
    })
  }

  return (
    <div className="admin-login">
      <div className="admin-login-form">
        <Input
          label="Password"
          onChange={handleOnChange}
          id="admin-login-password"
          value={password}
          placeholder="Enter password"
          type="password"
          onKeyUp={e => {
            if (e?.code === 'Enter' || e?.code === 'NumpadEnter') {
              handleOnProceed()
            }
          }}
        />
        <div className="password-info">{invalid ? 'Invalid password' : ''}</div>

        <Button disabled={fetching} onClick={handleOnProceed} disabledText="Proceeding">
          Proceed
        </Button>
      </div>
    </div>
  )
}

LoginDialog.propTypes = {
  onLogin: PropTypes.func.isRequired,
}
