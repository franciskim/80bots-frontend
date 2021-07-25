import React, { useState, useRef, useEffect } from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
// import Icon from 'components/default/icons'
// import Router from 'next/router'
import LaunchEditor from './LaunchEditor'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Modal,
  Container,
} from 'reactstrap'
import { Paginator } from 'components/default'
import { LimitFilter, SearchFilter, Th } from 'components/default/Table'
import { useDispatch, useSelector } from 'react-redux'
import {
  syncLocalBots,
  launchInstance,
  getBots,
  updateStatusBot,
  getBotSettings,
  updateBotSettings,
  deleteBot,
  setBotLimit,
} from 'store/bot/actions'
import { Table } from 'reactstrap'

// import { addNotification } from 'store/notification/actions'
import { NOTIFICATION_TYPES, NOTIFICATION_TIMINGS } from 'config'
import { addListener } from 'store/socket/actions'

// const Container = styled(Card)`
//   background: #333;
//   border: none;
//   color: #fff;
// `

// const Deploy = styled(Button)`
//   padding: 0 10px;
//   font-size: 16px;
//   margin-right: 5px;
// `

// const IconButton = styled(Button)`
//   display: inline-flex;
//   justify-content: center;
//   padding: 2px;
//   margin-right: 5px;
//   width: 27px;
//   height: 27px;

//   &:last-child {
//     margin-right: 0;
//   }

//   svg {
//     width: 15px;
//     height: 15px;
//   }
// `

// const StatusButton = styled(Deploy)`
//   text-transform: capitalize;
//   margin-right: 0;
// `

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;

  button {
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
`

// const BotType = styled(Badge)`
//   font-size: 14px;
//   text-transform: uppercase;
// `

// const Tag = styled(Badge)`
//   margin-right: 0.5rem;
//   font-size: 14px;

//   &:last-child {
//     margin-right: 0;
//   }
// `

// const Buttons = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// `

const Bots = () => {
  const dispatch = useDispatch()
  const [clickedBot, setClickedBot] = useState(null)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)

  const modal = useRef(null)
  const deleteModal = useRef(null)

  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const bots = useSelector((state) => state.bot.bots)
  const total = useSelector((state) => state.bot.total)
  const user = useSelector((state) => state.auth.user)
  const limit = useSelector((state) => state.bot.limit)
  useEffect(() => {
    dispatch(getBots({ page, limit }))
    // addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
    //   notify({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Sync completed' })
    //   getBots({
    //     page,
    //     limit,
    //     sort: order.field,
    //     order: order.value,
    //     search,
    //   })
    //   setPage(1)
    // })
    // return setPage(1)
  }, [page, limit])

  const launchBot = (params) => {
    modal.current.close()
    dispatch(launchInstance(clickedBot.id, params))
      .then(() => {
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: 'New bot instance is deploying',
        })
      })
      .catch((action) => {
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message:
            action.error?.response?.data?.message ||
            'Error occurred during new instance launch',
          delay: 1500,
        })
      })
  }

  const changeBotStatus = (bot) => {
    const statusName = bot.status === 'active' ? 'deactivated' : 'activated'
    const status = bot.status === 'active' ? 'inactive' : 'active'

    dispatch(updateStatusBot(bot.id, { status }))
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Bot was successfully ${statusName}!`,
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Status update failed',
        })
      )
  }

  const getDeleteBot = () => {
    setClickedBot(null)
    dispatch(deleteBot(clickedBot.id))
      .then(() => {
        notify({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Bot removed!' })
        getBots({
          page,
          limit,
          sort: order.field,
          order: order.value,
          search,
        })
        deleteModal.current.close()
      })
      .catch(() =>
        notify({ type: NOTIFICATION_TYPES.ERROR, message: 'Bot delete failed' })
      )
  }

  const sync = () => {
    dispatch(syncLocalBots())
      .then(() =>
        notify({ type: NOTIFICATION_TYPES.INFO, message: 'Sync started' })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Sync cannot be started',
        })
      )
  }

  const renderRow = (bot, idx) => (
    <tr key={idx}>
      <td>{bot.name}</td>
      <td>
        <Badge type={bot.type === 'public' ? 'info' : 'danger'} pill>
          {bot.type}
        </Badge>
      </td>
      <td>{bot.description}</td>
      {/* <td>
        {bot.tags && bot.tags.length > 0
          ? bot.tags.map((tag, idx) => (
              <Tag key={idx} pill type={"info"}>
                {tag.name}
              </Tag>
            ))
          : "-"}
      </td> */}
      <td>
        <Button
          color={bot.status === 'active' ? 'success' : 'danger'}
          onClick={() => changeBotStatus(bot)}
        >
          {bot.status}
        </Button>
      </td>
      <td>
        <ButtonGroup>
          <Button
            color="primary"
            className="btn-neutral btn-round btn-icon"
            size="sm"
            onClick={() => {
              setClickedBot(bot)
              modal.current.open()
            }}
          >
            Deploy
          </Button>
          <Button
            className="btn-neutral btn-round btn-icon"
            title={'Edit Bot'}
            size="sm"
            color="primary"
            onClick={() => {
              Router.push(`/bot/${bot.id}`)
            }}
          >
            {/* <Icon name={'edit'} /> */}
          </Button>
          <Button
            title={'Delete Bot'}
            type={'danger'}
            onClick={() => {
              setClickedBot(bot)
              deleteModal.current.open()
            }}
          >
            {/* <Icon name={'garbage'} /> */}
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  )

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    getBots({ page, limit, sort: field, order: value, search })
  }

  const OrderTh = (props) => (
    <Th
      {...props}
      // eslint-disable-next-line react/prop-types
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ''
      }
      onClick={onOrderChange}
    />
  )

  // const searchBots = (value) => {
  //   setSearch(value)
  //   getBots({
  //     page,
  //     limit,
  //     sort: order.field,
  //     order: order.value,
  //     search: value,
  //   })
  // }

  return (
    <>
      <AddButtonWrap style={{ marginBottom: '17px' }}>
        <Button color="success" onClick={() => Router.push('/bot')}>
          Add Bot
        </Button>
        <Button color="primary" onClick={sync} loading={`${syncLoading}`}>
          Sync Bots From Repo
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <div>
            <LimitFilter
              id="limitfilter"
              instanceId="limitfilter"
              defaultValue={limit}
              onChange={({ value }) => {
                setLimit(value)
                getBots({
                  page,
                  limit: value,
                  sort: order.field,
                  order: order.value,
                  search,
                })
              }}
            />
            <SearchFilter
              onChange={(value) => {
                searchBots(value)
              }}
            />
          </div>
          <Table responsive>
            <thead>
              <tr>
                <OrderTh field={'name'}>Bot Name</OrderTh>
                <OrderTh field={'type'}>Bot Type</OrderTh>
                <OrderTh field={'description'}>Description</OrderTh>
                <OrderTh field={'status'}>Status</OrderTh>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{bots.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            initialPage={page}
            onChangePage={(page) => {
              setPage(page)
              getBots({
                page,
                limit,
                sort: order.field,
                order: order.value,
                search,
              })
            }}
          />
        </CardBody>
      </Container>

      <Modal
        ref={modal}
        title={'Deploy selected bot?'}
        onClose={() => setClickedBot(null)}
        // disableSideClosing
      >
        <LaunchEditor
          onSubmit={launchBot}
          onClose={() => modal.current.close()}
          bot={clickedBot}
        />
      </Modal>
      <Modal ref={deleteModal} title={'Delete Bot'}>
        <ButtonGroup>
          <Button
            color="danger"
            onClick={() => {
              setClickedBot(null)
              deleteModal.current.close()
            }}
          >
            Cancel
          </Button>
          <Button color="primary" onClick={getDeleteBot}>
            Yes
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}

// const mapDispatchToProps = (dispatch) => ({
//   getBots: (query) => dispatch(getBots(query)),
//   notify: (payload) => dispatch(addNotification(payload)),
//   launchInstance: (id, params) => dispatch(launchInstance(id, params)),
//   updateStatusBot: (id, data) => dispatch(updateStatusBot(id, data)),
//   deleteBot: (id) => dispatch(deleteBot(id)),
//   getBotSettings: () => dispatch(getBotSettings()),
//   updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
//   syncLocalBots: () => dispatch(syncLocalBots()),
//   addListener: (room, eventName, handler) =>
//     dispatch(addListener(room, eventName, handler)),
//   setLimit: (limit) => dispatch(setBotLimit(limit)),
// })

export default Bots
