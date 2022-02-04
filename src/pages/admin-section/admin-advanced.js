import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  alterLanguagesByActive,
  getBackendURL,
  getResource,
  mapLanguagesToListbox,
  mapEmailsToListbox,
  alterEmailsByCreation,
  alterEmailsByRemoval,
  makePostRequest,
} from '../utils'
import { Button, Input, Listbox, Uploader } from '../../components'
import md5 from 'md5'

export const AdminAdvanced = ({ data, onChange }) => {
  const browserTitle = getResource('browser_title', data.core)
  const assetsPath = getResource('assets_path', data.core)
  const defaultLanguages = data.languages
  const defaultEmails = data.emails

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(browserTitle)
  const [password, setPassword] = useState('')
  const [newLogo, setNewLogo] = useState(null)
  const [languages, setLanguages] = useState(mapLanguagesToListbox(defaultLanguages))
  const [emails, setEmails] = useState(mapEmailsToListbox(defaultEmails))

  const handleOnUploadStart = () => {
    setLoading(true)
  }

  const handleOnUploadFinish = res => {
    setLoading(false)
    setNewLogo(res.data['file_name'])
  }

  const handleOnLanguageEnable = (languageId, newValue) => {
    setLanguages(alterLanguagesByActive(languages, languageId, newValue))
  }

  const handleOnEmailCreated = value => {
    setEmails(alterEmailsByCreation(emails, value))
  }

  const handleOnEmailRemoved = value => {
    console.log('removal', value)
    setEmails(alterEmailsByRemoval(emails, value))
  }

  const handleOnSaveSettings = () => {
    const dataToSend = {}
    if (title !== browserTitle) {
      dataToSend.browserTitle = title
    }

    if (newLogo) {
      dataToSend.browserLogo = newLogo
    }

    if (password?.length) {
      dataToSend.password = md5(password)
    }

    if (emails !== defaultEmails) {
      dataToSend.emails = emails
    }

    if (languages !== defaultLanguages) {
      dataToSend.languages = languages
    }

    setLoading(true)
    makePostRequest('companySettings', dataToSend).then(() => {
      setLoading(false)
      onChange()
    })
  }

  return (
    <div className="admin-advanced-page">
      <div className="admin-advanced-page-content">
        <Input
          disabled={loading}
          id="admin-advanced-page-browser-title"
          label="Browser title:"
          value={title}
          onChange={val => setTitle(val)}
        />

        <Uploader
          path={getBackendURL()}
          id="admin-advanced-page-browser-logo"
          onUploadStart={handleOnUploadStart}
          onUploadFinish={handleOnUploadFinish}
          label="Browser logo:"
        />

        <Input
          disabled={loading}
          id="admin-advanced-page-password"
          label="Admin password:"
          placeholder="Enter new password"
          value={password}
          onChange={val => setPassword(val)}
        />

        <Listbox
          items={languages}
          label="Languages:"
          assetsPath={assetsPath}
          actions={{ onEnable: handleOnLanguageEnable }}
        />

        <Listbox
          items={emails}
          label="Emails:"
          actions={{
            onAdd: handleOnEmailCreated,
            onRemove: handleOnEmailRemoved,
            onAddText: 'Add an email',
          }}
        />

        <div className="save-form">
          <Button onClick={handleOnSaveSettings} disabled={loading} disabledText="Saving" className="primary">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

AdminAdvanced.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
