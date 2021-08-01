import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import FileSystem from 'components/default/FileSystem'
import {
  flush,
  open as openItem,
  close as closeItem,
} from 'store/fileSystem/actions'
import { Loader80bots } from 'components/default'
import { Button, Row, Col } from 'reactstrap'
import ReportEditor from './ReportEditor'

const rootFolder = 'screenshots'

const FiltersSection = styled.div`
  width: 100%;
  text-align: left;
  padding: 1.25rem;
`

const Hint = styled.span`
  font-size: 14px;
`

const ScreenShotTab = ({ setCustomBack }) => {
  const dispatch = useDispatch()
  const [limit] = useState(16)
  const [reportItems, setReportItems] = useState([])
  const [isReportMode, setReportMode] = useState(false)
  // const [showReportModal, setShowReportModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  const botInstance = useSelector((state) => state.bot.botInstance)
  const channel = useSelector((state) => state.bot.botInstance?.storage_channel)
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)
  const previous = useSelector(
    (state) => state.fileSystem.history.slice(-1)?.[0]?.openedFolder
  )
  const loading = useSelector((state) => state.fileSystem.loading)
  const items = useSelector((state) => state.fileSystem.items)

  useEffect(() => {
    return () => flush()
  }, [router.query.id])

  useEffect(() => {
    if (channel && !!openedFolder) {
      return
    }
    dispatch(openItem({ path: rootFolder }, { limit }))
  }, [channel, openedFolder])

  useEffect(() => {
    if (!previous || openedFolder.path === rootFolder) {
      setCustomBack(null)
    } else {
      setCustomBack(() => {
        closeItem(openedFolder)
        dispatch(openItem(previous, { limit }))
      })
    }
  }, [openedFolder, previous])

  React.useEffect(() => {
    !isReportMode && setReportItems([])
  }, [isReportMode])

  const handleItemSelect = (item) => {
    const index = reportItems.findIndex((el) => el.path === item.path)
    if (index >= 0) {
      reportItems.splice(index, 1)
      return setReportItems([...reportItems])
    }
    setReportItems([...reportItems, item])
  }

  return (
    <div className="justify-content-center">
      {loading || !items.length ? (
        <Loader80bots
          data={'light'}
          styled={{
            width: '200px',
          }}
        />
      ) : (
        <Row>
          <Col>
            <FiltersSection>
              {isReportMode && <Hint>Select issued screenshots |&nbsp;</Hint>}
              <Button
                size="sm"
                type={'danger'}
                color="danger"
                onClick={() => setReportMode(!isReportMode)}
              >
                {isReportMode ? 'Cancel' : 'Report Issue'}
              </Button>
              {isReportMode && (
                <>
                  <Hint>&nbsp;|&nbsp;</Hint>
                  <Button
                    size="sm"
                    type={'success'}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Proceed
                  </Button>
                </>
              )}
            </FiltersSection>
            <FileSystem
              selectedItems={reportItems}
              onFileOpen={isReportMode ? handleItemSelect : null}
            />
          </Col>
        </Row>
      )}
      <ReportEditor
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        bot={botInstance}
        screenshots={reportItems}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

ScreenShotTab.propTypes = {
  setCustomBack: PropTypes.func.isRequired,
}

export default ScreenShotTab
