import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './listbox.scss'
import { getBackendURL } from '../../pages/utils'
import { Switch } from '../switch'
import { Modal } from '../modal'
import { Button } from '../button'
import { Input } from '../input'

export const Listbox = ({ className, label, items, actions, assetsPath, selectedItem }) => {
  const [newItems, setNewItems] = useState(items)
  const [adding, setAdding] = useState(false)
  const [addValue, setAddValue] = useState('')
  const {
    onRemove,
    onMoveUp,
    onMoveDown,
    onEnable,
    onAdd,
    onAddText,
    onRemoveText,
    onMoveUpText,
    onMoveDownText,
    onSelected,
  } = actions
  useEffect(() => {
    setNewItems(items)
  }, [items])

  const handleOnItemEnable = (id, value) => {
    onEnable(id, value)
  }

  const handleOnItemAddClick = () => {
    setAdding(true)
    setAddValue('')
  }

  const handleOnAddModalClose = value => {
    setAdding(false)
    if (value) {
      onAdd(value)
    }
  }

  const handleOnRemoveClick = (value, id, e) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(value, id)
  }

  const handleOnMoveUp = (value, e) => {
    e.preventDefault()
    e.stopPropagation()
    onMoveUp(value)
  }

  const handleOnMoveDown = (value, e) => {
    e.preventDefault()
    e.stopPropagation()
    onMoveDown(value)
  }

  const handleOnRowClick = id => {
    onSelected?.(id)
  }

  const renderAddItem = () => {
    return (
      <div className="listbox-add-item">
        <Button onClick={handleOnItemAddClick} className="listbox-add-item-button">
          {onAddText}
        </Button>
        <Modal
          className="listbox-add-item-modal"
          visible={adding}
          title={onAddText}
          onOverlayClick={handleOnAddModalClose}
        >
          <Input value={addValue} onChange={val => setAddValue(val)} id="admin-advanced-add-email-input" />
          <div className="listbox-add-item-modal-footer">
            <Button onClick={() => handleOnAddModalClose()}>Cancel</Button>
            <Button className="primary" onClick={() => handleOnAddModalClose(addValue)}>
              {onAddText}
            </Button>
          </div>
        </Modal>
      </div>
    )
  }

  const renderOneItem = (item, idx) => {
    const { id, title, itemTitle, logo, enabled = false, type } = item
    return (
      <div
        id={id}
        key={`listbox-items-${id}`}
        className={classNames('listbox-item', { selectable: onSelected, selected: selectedItem === id })}
        onClick={() => handleOnRowClick(id)}
      >
        {logo && (
          <div
            className="listbox-item-logo"
            style={{ backgroundImage: `url(${getBackendURL()}${assetsPath}${logo})` }}
          />
        )}
        <div className="listbox-item-title">{itemTitle ?? title}</div>
        <div className="listbox-item-actions">
          {onMoveUp && (
            <div className="listbox-item-action">
              <Button icon="chevron-up" onClick={e => handleOnMoveUp(itemTitle ?? title, e)} disabled={idx === 0}>
                {onMoveUpText}
              </Button>
            </div>
          )}
          {onMoveDown && (
            <div className="listbox-item-action">
              <Button
                icon="chevron-down"
                onClick={e => handleOnMoveDown(itemTitle ?? title, e)}
                disabled={idx === (newItems?.length || 0) - 1}
              >
                {onMoveDownText}
              </Button>
            </div>
          )}
          {onEnable && (
            <div className="listbox-item-action">
              <Switch onChange={val => handleOnItemEnable(id, val)} checked={enabled} />
            </div>
          )}
          {onRemove && (
            <div className="listbox-item-action">
              <Button
                icon="trash"
                onClick={type === 'group' ? () => {} : e => handleOnRemoveClick(itemTitle ?? title, id, e)}
                disabled={type === 'group'}
              >
                {onRemoveText}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderItems = () => {
    const items = newItems?.length ? (
      newItems.map((item, idx) => renderOneItem(item, idx))
    ) : (
      <div className="no-item">No items ...</div>
    )
    return <div className="listbox-items">{items}</div>
  }

  return (
    <div className={classNames('listbox', className)}>
      <label>{label}</label>
      {renderItems()}
      {onAdd && renderAddItem()}
    </div>
  )
}

Listbox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object,
  assetsPath: PropTypes.string,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Listbox.defaultProps = {
  className: null,
  label: null,
  actions: {},
  assetsPath: '',
  selectedItem: null,
}
