import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Listbox } from '../../components'
import {
  alterSectionsByCreation,
  alterSectionsByPosition,
  alterSectionsByRemoval,
  makePostRequest,
  mapSectionsToContent,
  translateNewSectionsToBackend,
} from '../utils'

export const AdminContent = ({ data, onChange }) => {
  const { core, sections } = data
  const [newSections, setNewSections] = useState(mapSectionsToContent(sections))
  const [loading, setLoading] = useState(false)

  const handleOnSave = () => {
    setLoading(true)
    makePostRequest('saveSectionList', { sections: translateNewSectionsToBackend(newSections) }).then(result => {
      setLoading(false)
      onChange()
    })
  }

  const handleOnRemove = title => {
    setNewSections(alterSectionsByRemoval(newSections, title))
  }

  const handleOnAdd = title => {
    setNewSections(alterSectionsByCreation(newSections, title))
  }

  const handleOnShiftPosition = (title, inc) => {
    setNewSections(alterSectionsByPosition(newSections, inc, title))
  }

  return (
    <div className="admin-content-main-page">
      <div className="admin-content-main-page-content">
        <h2>Page content structure - sections</h2>
        <p>
          This page tab enables you to modify the structure of content using sections. <br />
          Each section is a separate tab in the sidebar. <br />
          An user or visitor of the public page (not admin part) scrolls through the sections vertically. <br />
          Each section has its own body/content that does not interact with other sections. <br />
          Each section is also represented in the top navigation bar (on the user page) having its own title. <br />
        </p>

        <Listbox
          items={newSections}
          label="Current sections:"
          actions={{
            onRemove: newSections.length > 1 ? handleOnRemove : null,
            onAdd: handleOnAdd,
            onAddText: 'Add section',
            onMoveUp: id => handleOnShiftPosition(id, -1),
            onMoveDown: id => handleOnShiftPosition(id, 1),
          }}
        />

        <p>Do not forget to save your changes before you move to another tab.</p>
        <div className="save-form">
          <Button onClick={handleOnSave} disabled={loading} disabledText="Saving" className="primary">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

AdminContent.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
