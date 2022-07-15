import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './footer.scss'

export class Footer extends Component {
  render() {
    const { onAdminClick } = this.props
    const yearCreated = 2021
    const curYear = new Date().getFullYear()
    const years = curYear === yearCreated ? yearCreated : `${yearCreated}-${curYear}`
    return (
      <div className="footer">
        &copy; {years}
        {/*Copyright |{' '}*/}
        {/*<a href="https://www.tila.sk/?ref=astros" target="_blank" rel="noreferrer">*/}
        {/*  Tila s.r.o.*/}
        {/*</a>*/}
        {/*<div onClick={onAdminClick}>ADMIN</div>*/}
      </div>
    )
  }
}

Footer.propTypes = {
  onAdminClick: PropTypes.func.isRequired,
}
