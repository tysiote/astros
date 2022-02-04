import React, { Component } from 'react'
import { FetchingPage } from './fetching-page'
import { getBackendURL, parseFetchedData } from './utils'
import { Navbar, Section, Footer } from '../components'
import './main.scss'
import { AdminPage } from './admin-section/admin-page'

export class MainApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadingData: true,
      data: null,
      inView: null,
      adminEnv: location.href.split('#')[1]?.toLowerCase() === 'admin',
    }

    this.timer = null
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isAdmin = location.href.split('#')[1]?.toLowerCase() === 'admin'

    if (prevState.adminEnv !== isAdmin) {
      return { adminEnv: isAdmin }
    }

    return null
  }

  componentDidMount() {
    fetch(getBackendURL())
      .then(result => {
        if (result.ok) {
          return result.json().then(data => this.handleOnFetchingFinished(data))
        }
        return this.handleFetchingErrored(result)
      })
      .catch(err => this.handleFetchingErrored(err))

    this.timer = setTimeout(this.handleTimerExpires, 150)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  handleTimerExpires = () => {
    const { data } = this.state

    if (data) {
      this.setState({ loadingData: false })
    }
    this.timer = null
  }

  handleFetchingErrored = error => {
    console.log('error', error)
  }

  handleOnInViewChanged = (sectionId, inView, etc) => {
    if (inView) {
      this.setState({ inView: sectionId })
    }
  }

  handleOnFetchingFinished = data => {
    const parsedData = parseFetchedData(data)

    if (this.timer) {
      this.setState({ data: parsedData })
    } else {
      this.setState({ data: parsedData, loadingData: false })
    }
  }

  handleOnAdminClick = () => {
    const { adminEnv } = this.state
    location.href = location.origin
  }

  renderAdmin = () => {
    const { data } = this.state
    return <AdminPage onAdminClick={this.handleOnAdminClick} data={data} />
  }

  renderMain = () => {
    const { data, inView } = this.state
    return (
      <>
        <Navbar sections={data.sections} inViewId={inView} otherData={data} />
        {data.sections.map((section, idx) => (
          <Section
            id={idx}
            key={`section-${section[0].id}`}
            sectionData={section}
            otherData={data}
            onViewChanged={this.handleOnInViewChanged}
          />
        ))}
        <Footer onAdminClick={this.handleOnAdminClick} />
      </>
    )
  }

  render() {
    const { loadingData, adminEnv } = this.state

    const content = () => (adminEnv ? this.renderAdmin() : this.renderMain())
    const dataToRender = loadingData ? <FetchingPage /> : content()

    return <div className="main-app">{dataToRender}</div>
  }
}
