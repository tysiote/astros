import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Modal } from '../modal'
import { Button } from '../button'
import { Listbox } from '../listbox'

const WIDGET_ITEMS = [
  { id: 'address', title: 'Address', itemTitle: 'Address' },
  { id: 'animation', title: 'Animation', itemTitle: 'Animation' },
  { id: 'article', title: 'Article', itemTitle: 'Article' },
  { id: 'form', title: 'Email form', itemTitle: 'Email form' },
  { id: 'full_tiles', title: 'Full Tiles', itemTitle: 'Full Tiles' },
  { id: 'logos', title: 'Logo Tiles', itemTitle: 'Logo Tiles' },
  { id: 'numeric_tiles', title: 'Numeric Tiles', itemTitle: 'Numeric Tiles' },
  { id: 'social', title: 'Social Networks', itemTitle: 'Social Networks' },
  { id: 'image', title: 'Image', itemTitle: 'Image' },
]

export const WidgetModal = ({ className, onSelect }) => {
  const [adding, setAdding] = useState(false)
  const [selectedWidget, setSelectedWidget] = useState(null)

  const handleOnModalClose = data => {
    setAdding(false)
    if (data) {
      onSelect(data)
    }
  }

  const handleOnMove = (value, up = true) => {
    // console.log('moved', value, up ? 'up' : 'down')
  }

  const handleOnRemove = value => {
    // console.log('removed', value)
  }

  const handleOnModalOpen = () => {
    setAdding(true)
  }

  const handleOnWidgetSelected = widgetId => {
    setSelectedWidget(widgetId)
  }

  return (
    <div className={classNames('dropdown', className)}>
      <Button onClick={handleOnModalOpen}>Add widget</Button>
      <Modal title="Add new widget" onOverlayClick={() => handleOnModalClose()} visible={adding}>
        <div className="widget-modal">
          <Listbox
            items={WIDGET_ITEMS}
            label="Widgets"
            actions={{
              onSelected: handleOnWidgetSelected,
              onMoveUp: value => handleOnMove(value),
              onMoveDown: value => handleOnMove(value, false),
              onRemove: value => handleOnRemove(value),
            }}
            selectedItem={selectedWidget}
          />
          <Button onClick={() => handleOnModalClose(selectedWidget)}>Add widget</Button>
        </div>
      </Modal>
    </div>
  )
}

WidgetModal.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func,
}

WidgetModal.defaultProps = {
  className: null,
  onSelect: () => {},
}
