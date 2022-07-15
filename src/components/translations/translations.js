import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '../button'
import { Modal } from '../modal'
import './translations.scss'
import { Input } from '../input'
import {
  alterTranslationValuesByValue,
  convertValuesIntoTranslations,
  getAvailableTranslations,
  getDefaultTranslationValues,
  getLanguageByAbbr,
  getNewTranslations,
  makePostRequest,
} from '../../pages/utils'

export const Translations = ({ item, translations, languages, forceRefresh }) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const { id, type, itemValue, isTextArea, description } = item
  // let contentId = type !== null && (type !== undefined || type !== 'article') ? id : null
  // let widgetId = type !== null && (type !== undefined || type === 'article') ? null : id

  let contentId = null
  let widgetId = null

  if (type !== null && type !== undefined) {
    if (type === 'article') {
      widgetId = id
    } else {
      contentId = id
    }
  } else {
    widgetId = id
  }

  const [tempTranslations, setTempTranslations] = useState(
    getNewTranslations({ translations, contentId, widgetId, description }),
  )
  const [availableTranslations, setAvailableTranslations] = useState(
    getAvailableTranslations({ existingTranslations: tempTranslations, languages, description }),
  )
  const [values, setValues] = useState(
    getDefaultTranslationValues({
      existingLanguages: tempTranslations,
      availableLanguages: availableTranslations,
      description,
    }),
  )

  useEffect(() => {
    const { id, type, description } = item
    let contentId = null
    let widgetId = null

    if (type !== null && type !== undefined) {
      if (type === 'article') {
        widgetId = id
      } else {
        contentId = id
      }
    } else {
      widgetId = id
    }

    const newTempTranslations = getNewTranslations({ translations, contentId, widgetId, description })
    setTempTranslations(newTempTranslations)
    setAvailableTranslations(
      getAvailableTranslations({ existingTranslations: newTempTranslations, languages, description }),
    )
  }, [item, translations])

  const handleOnModalClose = overlay => {
    if (!overlay) {
      setModalOpened(false)
    }
  }

  const handleOnModalOpen = () => {
    setModalOpened(true)
  }

  const handleOnSave = () => {
    setDisabled(true)

    const valuesToSend = convertValuesIntoTranslations({ type, values, id, description })

    makePostRequest('saveTranslations', { data: valuesToSend }).then(() => {
      setDisabled(false)
      setModalOpened(false)
      forceRefresh()
    })
  }

  const handleOnChange = (abbr, value) => {
    setValues(alterTranslationValuesByValue(abbr, value, values))
  }

  return (
    <div className="translations">
      <div className="translations-button-controls">
        <Button disabled={disabled} onClick={handleOnModalOpen} className="info open-translations" icon="globe">
          Manage translations
        </Button>
      </div>

      <Modal visible={modalOpened} onOverlayClick={() => handleOnModalClose(true)} title="Manage translations">
        <div className="translations-modal-content">
          <div className="translations-modal-content-default">
            <Input
              textarea={isTextArea}
              value={itemValue}
              disabled={true}
              label="Original text"
              id="translations-input-default"
            />
          </div>
          <div className="translations-modal-content-available">
            {tempTranslations.map(t => (
              <div className="available-translation" key={`translations-available-${t['language_abbr']}-key`}>
                <Input
                  id={`translations-available-${t['language_abbr']}`}
                  value={description ? t.description : t.value ?? t.title}
                  label={getLanguageByAbbr(languages, t['language_abbr']).title}
                  textarea={isTextArea}
                  onChange={val => handleOnChange(t['language_abbr'], val)}
                />
              </div>
            ))}
            {availableTranslations.map(t => (
              <div className="available-translation" key={`translations-available-${t.abbr}-key`}>
                <Input
                  id={`translations-available-${t.abbr}`}
                  value={null}
                  label={t.title}
                  textarea={isTextArea}
                  onChange={val => handleOnChange(t.abbr, val)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="translations-modal-controls">
          <Button disabled={disabled} onClick={() => handleOnModalClose()}>
            Cancel
          </Button>
          <Button disabled={disabled} onClick={handleOnSave} className="primary">
            Save changes
          </Button>
        </div>
      </Modal>
    </div>
  )
}

Translations.propTypes = {
  item: PropTypes.object.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  languages: PropTypes.array.isRequired,
  forceRefresh: PropTypes.func.isRequired,
}
