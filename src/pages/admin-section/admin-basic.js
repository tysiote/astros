import React, { useState } from 'react'
import { Button, ColorPicker, Input, Uploader } from '../../components'
import PropTypes from 'prop-types'
import { getBackendURL, getResource, makePostRequest } from '../utils'

export const AdminBasic = ({ data, onChange }) => {
  const brandName = getResource('brand_name', data.core)
  const themeColor = getResource('theme_color', data.core)
  const assetsPath = getResource('assets_path', data.core)
  const logoPath = getResource('logo_path', data.core)
  const [companyName, setCompanyName] = useState(brandName)
  const [newLogoPath, setNewLogoPath] = useState(null)
  const [theme, setTheme] = useState(themeColor)
  const [loading, setLoading] = useState(false)

  const handleOnColorChange = newValue => {
    setTheme(newValue)
  }

  const handleOnUploadStart = () => {
    setLoading(true)
  }

  const handleOnUploadFinish = res => {
    setLoading(false)
    setNewLogoPath(res.data['file_name'])
  }

  const saveSettings = () => {
    const dataToSend = {}
    if (brandName !== companyName) {
      dataToSend.brandName = companyName
    }

    if (newLogoPath) {
      dataToSend.logoPath = newLogoPath
    }

    if (theme !== themeColor) {
      dataToSend.themeColor = theme
    }

    setLoading(true)
    makePostRequest('companySettings', dataToSend).then(() => {
      setLoading(false)
      onChange()
    })
  }

  return (
    <div className="admin-basic-page">
      <div className="admin-basic-page-content">
        <div className="admin-basic-showcase">
          <div
            className={'admin-basic-showcase-logo'}
            style={{ backgroundImage: `url(${getBackendURL()}${assetsPath}${logoPath})` }}
          />
          <h2 style={{ color: themeColor }}>{brandName}</h2>
        </div>
        <Input
          disabled={loading}
          id="admin-basic-page-company-name"
          label="Company name:"
          value={companyName}
          onChange={val => setCompanyName(val)}
        />

        <Uploader
          path={getBackendURL()}
          id="admin-basic-page-company-logo"
          onUploadStart={handleOnUploadStart}
          onUploadFinish={handleOnUploadFinish}
          label="Company logo:"
        />

        <div className="admin-basic-company-theme">
          <ColorPicker
            value={theme}
            id="admin-basic-color-picker"
            onChange={handleOnColorChange}
            className="admin-basic-color-picker"
            label="Theme color:"
          />
        </div>

        <div className="save-form">
          <Button onClick={saveSettings} disabled={loading} disabledText="Saving" className="primary">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

AdminBasic.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
