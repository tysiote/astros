import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../components'
import { getResource } from '../utils'
import './admin.scss'

export const AdminPublish = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const betaURL = getResource('beta_url', data.core)

  const handleOnMigrateStart = () => {
    setLoading(true)
  }

  const handleOnMigrateEnd = () => {
    setLoading(false)
  }

  return (
    <div className="admin-publish-page">
      <div className="admin-publish-page-content">
        <h2>Migration and publishing process</h2>
        <p>
          The application is supposed to be published not only in master folder (your website basically), but also there
          should be a demo URL.
          <br />
          The demo page serves as a safe place where an admin can review their settings and content before publishing to
          public.
          <br />
          All changes of settings or content by admin are applied only in beta/demo database.
          <br />
          The migration process means to take the current snapshot of the beta database and replace the production
          database with it.
          <br />
        </p>
        <p>
          This admin zone only changes the content of databases, that are reflected on the page, that users view. For
          any script/code changes or requests, please contact{' '}
          <a href="https://www.tila.sk/" target={'_blank'} rel="noreferrer">
            Tila s.r.o.
          </a>
        </p>

        <div className="admin-publish-migration-stats">
          <div className="admin-publish-url">
            <label>You can visit the beta version on:</label>
            <a href={betaURL} target={'_blank'} rel="noreferrer">
              {betaURL}
            </a>
          </div>
          <div className="admin-publish-button">
            <Button onClick={handleOnMigrateStart} disabled={loading} disabledText="Migrating" className="primary">
              Migrate
            </Button>
          </div>
        </div>
        <p>You can start the migration process by clicking on the button above.</p>
      </div>
    </div>
  )
}

AdminPublish.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
