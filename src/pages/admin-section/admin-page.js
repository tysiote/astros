import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Sidebar } from '../../components'
import { findTabById, getAdminMenuItems, getBackendURL, makePostRequest, parseFetchedData } from '../utils'
import './admin.scss'
import classNames from 'classnames'
import { AdminBasic } from './admin-basic'
import { AdminAdvanced } from './admin-advanced'
import { FetchingPage } from '../fetching-page'
import { AdminPublish } from './admin-publish'
import { AdminContent } from './admin-content'
import { AdminSection } from './admin-section'

export class AdminPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: null,
      loading: true,
      saving: false,
      data: null,
    }
  }

  componentDidMount() {
    this.refreshContent()
  }

  refreshContent = () => {
    makePostRequest('adminContent', {}).then(result => {
      this.setState({ loading: false, saving: false, data: parseFetchedData(result) })
    })
  }

  handleOnTabChange = id => {
    this.setState({ activeTab: id })
  }

  handleOnAdminClick = () => {
    const { onAdminClick } = this.props

    onAdminClick()
  }

  handleOnMinimizeClicked = minimized => {
    this.setState({ minimized })
  }

  handleSettingsChanged = data => {
    if (data) {
      makePostRequest('saveSection', data).then(() => {
        this.refreshContent()
      })
    } else {
      this.refreshContent()
    }
  }

  renderBasicSettings = () => {
    return <div className="basic-settings">Company name</div>
  }

  renderMenu = () => {
    const { activeTab, data } = this.state

    return (
      <Sidebar
        items={getAdminMenuItems(data.sections, this.handleOnTabChange)}
        className="admin-menu"
        activeItem={activeTab}
        onItemClicked={this.handleOnTabChange}
        onMinimizeClicked={this.handleOnMinimizeClicked}
        onAdminLeave={this.handleOnAdminClick}
      />
    )
  }

  renderPage = () => {
    const { activeTab, data, saving } = this.state
    const section = findTabById(data.sections, activeTab)

    if (section?.length) {
      return (
        <AdminSection
          onChange={this.handleSettingsChanged}
          section={section[0]}
          data={data}
          isSaving={saving}
          forceRefresh={this.refreshContent}
        />
      )
    }

    switch (activeTab) {
      case 'advanced':
        return <AdminAdvanced data={data} onChange={this.handleSettingsChanged} />
      case 'publish':
        return <AdminPublish data={data} onChange={this.handleSettingsChanged} />
      case 'content':
        return <AdminContent data={data} onChange={this.handleSettingsChanged} />
      case null:
        return <AdminBasic data={data} onChange={this.handleSettingsChanged} />
    }
  }

  renderLoading = () => {
    return <FetchingPage />
  }

  render() {
    const { minimized, loading } = this.state
    if (loading) {
      return this.renderLoading()
    }

    return (
      <div className="admin-section">
        {this.renderMenu()}
        <div className={classNames('admin-tab-content', { minimized })}>{this.renderPage()}</div>
      </div>
    )
  }
}

AdminPage.propTypes = {
  onAdminClick: PropTypes.func.isRequired,
}
