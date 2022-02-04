import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Button } from '../button'
import './uploader.scss'

export const Uploader = ({ id, path, onUploadStart, onUploadFinish, className, label }) => {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const inputFile = useRef(null)

  const handleOnFileSelected = e => {
    setFile(e?.target?.files?.[0])
    console.log(e.target.files[0])
  }

  const handleOnUploadStart = () => {
    onUploadStart()
    setUploading(true)
    const formData = new FormData()
    formData.append('fileToUpload', file)
    fetch(path, { method: 'POST', body: formData })
      .then(response => response.json())
      .then(res => {
        setUploading(false)
        handleOnUploadFinish(res)
      })
  }

  const handleOnUploadFinish = res => {
    onUploadFinish(res)
  }

  return (
    <div className={classNames('uploader', className)}>
      <input
        type="file"
        name="fileToUpload"
        id={id}
        onChange={handleOnFileSelected}
        disabled={uploading}
        ref={inputFile}
        className="uploader-input"
      />
      <label htmlFor={`uploader-${id}-browse`}>{label}</label>
      <div className="uploader-controls">
        <Button
          id={`uploader-${id}-browse`}
          className="uploader-btn-browse"
          onClick={() => inputFile?.current?.click?.()}
        >
          Browse
        </Button>
        <Button onClick={handleOnUploadStart} className="uploader-btn-upload" disabled={uploading || !file}>
          Upload
        </Button>
      </div>
      {file && <div className="uploader-file-label">{`File selected: ${file.name}`}</div>}
    </div>
  )
}

Uploader.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  path: PropTypes.string.isRequired,
  onUploadStart: PropTypes.func,
  onUploadFinish: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
}

Uploader.defaultProps = {
  onUploadFinish: () => {},
  onUploadStart: () => {},
  className: null,
  label: null,
}
