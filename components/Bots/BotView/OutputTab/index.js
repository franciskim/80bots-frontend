import React, { useState } from 'react'
import styled from 'styled-components'
import ImagesType from './ImagesType'
import JsonType from './JsonType'
import { CardBody, Button, TabContent, TabPane, Nav, NavItem } from 'reactstrap'
import FilesType from './FileType'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { flush } from 'store/fileSystem/actions'

const OUTPUT_TYPES = {
  JSON: {
    value: 'json',
    label: 'JSON',
  },
  IMAGES: {
    value: 'images',
    label: 'Images',
  },
  FILES: {
    value: 'files',
    label: 'Files',
  },
}

const Hint = styled.span`
  font-size: 14px;
  color: #fff;
`

const OutputTab = ({ setCustomBack }) => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('images')

  const toggle = (tab) => {
    if (activeTab !== tab) {
      dispatch(flush())
      setActiveTab(tab)
    }
  }

  return (
    <>
      <CardBody>
        <Nav className="mb-2">
          {Object.values(OUTPUT_TYPES).map((item, i, all) => {
            const color = item.value === activeTab ? 'success' : 'primary'
            return (
              <NavItem key={i}>
                <Button
                  outline
                  color={color}
                  onClick={() => {
                    toggle(item.value)
                  }}
                  size="sm"
                >
                  {item.label}
                </Button>
                {all.length - 1 > i && <Hint>&nbsp;|&nbsp;</Hint>}
              </NavItem>
            )
          })}
        </Nav>

        <TabContent activeTab={activeTab}>
          {activeTab === 'json' && (
            <TabPane tabId="json">
              <JsonType setCustomBack={setCustomBack} />
            </TabPane>
          )}
          {activeTab === 'images' && (
            <TabPane tabId="images">
              <ImagesType setCustomBack={setCustomBack} />
            </TabPane>
          )}
          {activeTab === 'files' && (
            <TabPane tabId="files">
              <FilesType setCustomBack={setCustomBack} />
            </TabPane>
          )}
        </TabContent>
      </CardBody>
    </>
  )
}

OutputTab.propTypes = {
  botInstance: PropTypes.object,
  setCustomBack: PropTypes.func.isRequired,
}

export default OutputTab
