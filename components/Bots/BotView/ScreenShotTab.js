import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
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

const ScreenShotTab = ({ botInstance, setCustomBack }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [limit] = useState(8)
  const [reportItems, setReportItems] = useState([])
  const [isReportMode, setReportMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const channel = useSelector((state) => state.bot.botInstance?.storage_channel)
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)
  const previous = useSelector((state) => {
    return state.fileSystem.history.slice(-1)?.[0]?.openedFolder
  })
  const loading = useSelector((state) => state.fileSystem.loading)

  useEffect(() => {
    return () => dispatch(flush())
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
        dispatch(closeItem(openedFolder))
        dispatch(openItem(previous, { limit }))
      })
    }
  }, [openedFolder, previous])

  useEffect(() => {
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
      {loading ? (
        <Loader80bots
          styled={{
            width: '200px',
          }}
        />
      ) : (
        <Row>
          <Col>
            <FiltersSection>
              {isReportMode && <>Select issued screenshots |&nbsp;</>}
              <Button
                size="sm"
                type={'danger'}
                color="danger"
                onClick={() => {
                  setReportMode(!isReportMode)
                }}
              >
                {isReportMode ? 'Cancel' : 'Report Issue'}
              </Button>
              {isReportMode && (
                <>
                  &nbsp;|&nbsp;
                  <Button
                    size="sm"
                    type={'success'}
                    onClick={() => setIsModalOpen(true)}
                    disabled={!reportItems.length}
                  >
                    Proceed
                  </Button>
                </>
              )}
            </FiltersSection>
            <FileSystem
              selectedItems={reportItems}
              onFileOpen={isReportMode ? handleItemSelect : () => {}}
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
  botInstance: PropTypes.object,
}

export default ScreenShotTab
