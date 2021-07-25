import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSystem from 'components/default/FileSystem'
import { flush, open, close } from 'store/fileSystem/actions'
import { Loader80bots, Button } from 'components/default'
import { Modal } from 'reactstrap'
import ReportEditor from './ReportIssue'

const rootFolder = 'screenshots'
const defaultLimit = 15

const Container = styled.div`
  position: relative;
  flex: 1;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`

const Report = styled(Button)`
  padding: 0 5px;
  animation: ${Fade} 200ms ease-in;
`

const FiltersSection = styled.div`
  width: 100%;
  text-align: left;
  padding: 1.25rem;
`

const Hint = styled.span`
  font-size: 14px;
`

const ScreenShotTab = ({
  flush,
  channel,
  openItem,
  closeItem,
  openedFolder,
  previous,
  setCustomBack,
  loading,
  items,
  botInstance,
}) => {
  const [limit] = useState(defaultLimit)
  const [reportItems, setReportItems] = useState([])
  const [isReportMode, setReportMode] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const router = useRouter()
  const reportModal = useRef(null)

  useEffect(() => {
    return () => flush()
  }, [router.query.id])

  useEffect(() => {
    if (channel && !!openedFolder) return
    openItem({ path: rootFolder }, { limit })
  }, [channel, openedFolder])

  useEffect(() => {
    if (!previous || openedFolder.path === rootFolder) {
      setCustomBack(null)
    } else {
      setCustomBack(() => {
        closeItem(openedFolder)
        openItem(previous, { limit })
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
    <>
      <Container>
        {loading || !items.length ? (
          <Loader80bots
            data={'light'}
            styled={{
              width: '200px',
            }}
          />
        ) : (
          <>
            <FiltersSection>
              {isReportMode && <Hint>Select issued screenshots |&nbsp;</Hint>}
              <Report
                type={'danger'}
                onClick={() => setReportMode(!isReportMode)}
              >
                {isReportMode ? 'Cancel' : 'Report Issue'}
              </Report>
              {isReportMode && (
                <>
                  <Hint>&nbsp;|&nbsp;</Hint>
                  <Report
                    type={'success'}
                    onClick={() => setShowReportModal(true)}
                  >
                    Proceed
                  </Report>
                </>
              )}
            </FiltersSection>
            <FileSystem
              selectedItems={reportItems}
              onFileOpen={isReportMode ? handleItemSelect : null}
            />
          </>
        )}
      </Container>
      <Modal
        mode={showReportModal ? 'in' : 'closed'}
        ref={reportModal}
        title={'Report Issue'}
        close={() => setShowReportModal(false)}
      >
        <ReportEditor
          bot={botInstance}
          screenshots={reportItems}
          onClose={() => setShowReportModal(false)}
        />
      </Modal>
    </>
  )
}

ScreenShotTab.propTypes = {
  flush: PropTypes.func.isRequired,
  channel: PropTypes.string,
  openItem: PropTypes.func.isRequired,
  closeItem: PropTypes.func.isRequired,
  openedFolder: PropTypes.object,
  previous: PropTypes.object,
  loading: PropTypes.bool,
  setCustomBack: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  botInstance: PropTypes.object,
}

const mapStateToProps = (state) => ({
  botInstance: state.bot.botInstance,
  channel: state.bot.botInstance?.storage_channel,
  openedFolder: state.fileSystem.openedFolder,
  previous: state.fileSystem.history.slice(-1)?.[0]?.openedFolder,
  loading: state.fileSystem.loading,
  items: state.fileSystem.items,
})

const mapDispatchToProps = (dispatch) => ({
  flush: () => dispatch(flush()),
  openItem: (item, query) => dispatch(open(item, query)),
  closeItem: (item) => dispatch(close(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ScreenShotTab)
