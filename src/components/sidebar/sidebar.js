import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { alterItemGroup, isItemActive } from './utils'

import './sidebar.scss'

let iconList = Object.keys(Icons)
  .filter(key => key !== 'prefix')
  .map(icon => Icons[icon])
library.add(...iconList)

export class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      minimized: false,
      items: props.items,
      prevItems: props.items,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { items } = nextProps
    const { prevItems } = prevState

    if (JSON.stringify(items) !== JSON.stringify(prevItems)) {
      return { items, prevItems: items }
    }

    return null
  }

  handleOnItemGroupClicked = (id, e) => {
    const { items } = this.state
    const { onItemClicked } = this.props
    this.setState({ items: alterItemGroup(id, items) })
    onItemClicked(id, e)
  }

  handleOnMinimize = () => {
    const { minimized } = this.state
    const { onMinimizeClicked } = this.props
    const newValue = !minimized

    this.setState({ minimized: newValue })
    onMinimizeClicked(newValue)
  }

  handleOnAdminLeave = () => {
    const { onAdminLeave } = this.props

    onAdminLeave()
  }

  renderOneItem = (item, isSubItem, idx) => {
    const { activeItem } = this.props
    const { title, icon, subItems, id, expanded } = item
    const isActive = isItemActive(id, activeItem)
    const subItemsIcon = subItems?.length ? `${expanded ? 'chevron-up' : 'chevron-down'}` : null

    const mainItem = (
      <div
        className={classNames('menu-item', { active: isActive, 'sub-item': isSubItem })}
        onClick={e => this.handleOnItemGroupClicked(id, e)}
        key={`sidebar-${idx}-key`}
      >
        <div className="label">
          {icon && (
            <div className="icon">
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
          {title}
        </div>
        {subItemsIcon && <FontAwesomeIcon icon={subItemsIcon} />}
      </div>
    )

    return expanded ? (
      <div key={`sidebar-${idx}-key`}>
        {mainItem}
        <div className="sub-items">
          {subItems.map(subItem => this.renderOneItem(subItem, true, `${idx}-${subItem.id}`))}
        </div>
      </div>
    ) : (
      mainItem
    )
  }

  renderMinimize = () => {
    const { minimized } = this.state
    const iconName = minimized ? 'chevron-right' : 'chevron-left'
    return (
      <div className="menu-item sidebar-minimize" onClick={this.handleOnMinimize}>
        <FontAwesomeIcon icon={iconName} />
      </div>
    )
  }

  renderLeaveAdmin = () => {
    const { minimized } = this.state
    return (
      <div className="menu-item leave-admin" onClick={this.handleOnAdminLeave}>
        <div className="label">
          <div className="icon">
            <FontAwesomeIcon icon="sign-out-alt" />
          </div>
          {!minimized && <div>Leave admin zone</div>}
        </div>
      </div>
    )
  }

  render() {
    const { className } = this.props
    const { items, minimized } = this.state

    return (
      <div className={classNames('sidebar', className, { minimized })} key="sidebar">
        <div className="sidebar-items">
          {this.renderMinimize()}
          {!minimized && items.map((item, idx) => this.renderOneItem(item, null, idx))}
        </div>
        {this.renderLeaveAdmin()}
      </div>
    )
  }
}

Sidebar.propTypes = {
  items: PropTypes.array.isRequired,
  className: PropTypes.string,
  activeItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onItemClicked: PropTypes.func.isRequired,
  onMinimizeClicked: PropTypes.func.isRequired,
  onAdminLeave: PropTypes.func,
}

Sidebar.defaultProps = {
  className: null,
  activeItem: null,
  onAdminLeave: () => {},
}
