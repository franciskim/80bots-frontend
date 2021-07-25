import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Container, CardBody, ButtonGroup, Label } from 'reactstrap'
import {
  LimitFilter,
  ListFilter,
  SearchFilter,
  Th,
} from 'components/default/Table'
import { Button, Badge, Modal, Table } from 'reactstrap'
import Icon from 'components/default/icons'
import { addNotification } from 'store/notification/actions'
import { useDispatch, useSelector } from 'react-redux'
import { NOTIFICATION_TYPES } from 'config'
import Paginator from 'components/default/Paginator'
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from 'store/schedule/actions'
import { getRunningBots } from 'store/bot/actions'

import ScheduleEditor from './ScheduleEditor'
import AsyncSelect from 'react-select/async'

// const Container = styled(Card)`
//   background: #333;
//   border: none;
//   color: #fff;
//   align-self: flex-start;
// `

// const IconButton = styled(Button)`
//   display: inline-flex;
//   justify-content: flex-start;
//   padding: 2px;
//   margin-right: 5px;
//   width: 30px;
//   height: 30px;
//   &:last-child {
//     margin-right: 0;
//   }
// `

// const Buttons = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// `

// const StatusButton = styled(Button)`
//   text-transform: uppercase;
// `

const Tag = styled(Badge)`
  text-transform: capitalize;
  margin-right: 0.5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`

const SelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

// const Label = styled.label`
//   font-size: 16px;
//   margin-bottom: 5px;
// `

// const Ul = styled.ul`
//   list-style: none;
//   margin: 0;
//   padding: 0;
// `

// const modalStyles = css`
//   min-width: 1200px;
//   overflow-y: visible;
//   min-height: 500px;
// `

const FILTERS_LIST_OPTIONS = [
  { value: 'all', label: 'All Schedules' },
  { value: 'my', label: 'My Schedules' },
]

const selectStyles = {
  control: (provided, { selectProps: { width } }) => ({
    ...provided,
    width: width,
    minWidth: '75px',
    border: 'solid 1px hsl(0,0%,80%)',
    borderRadius: '4px',
    color: '#fff',
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: '#7dffff',
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: '#fff',
  }),
  menu: (provided, state) => ({
    ...provided,
    border: 'solid 1px hsl(0,0%,80%)',
    borderRadius: '4px',
  }),
  menuList: (provided, state) => ({
    ...provided,
    backgroundColor: '#333',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? 'black' : '#fff',
  }),
}

const BotsSchedule = () => {
  const dispatch = useDispatch()
  const [clickedSchedule, setClickedSchedule] = useState(null)
  const [list, setFilterList] = useState('all')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [instanceId, setInstanceId] = useState(null)
  const [search, setSearch] = useState(null)

  const modal = useRef(null)
  const addModal = useRef(null)
  const editModal = useRef(null)

  useEffect(() => {
    dispatch(getSchedules({ page, limit, list }))
  }, [])

  const schedules = useSelector((state) => state.schedule.schedules)
  const runningBots = useSelector((state) => state.bot.botInstances)
  const total = useSelector((state) => state.schedule.total)
  const user = useSelector((state) => state.auth.user)

  const searchBots = (value, callback) => {
    dispatch(getRunningBots({ page: 1, limit: 50, search: value })).then(
      (action) => callback(action.data.data.map(toOptions))
    )
  }

  const onBotChange = (option) => {
    setInstanceId(option.value)
  }

  const toOptions = (bot) => ({
    value: bot.instance_id,
    label: bot.instance_id + '|' + bot.name,
  })

  const toFilters = (bot) => bot.status !== 'terminated'

  const changeScheduleStatus = (schedule) => {
    const statusName =
      schedule.status === 'active' ? 'deactivated' : 'activated'
    const status = schedule.status === 'active' ? 'inactive' : 'active'
    dispatch(updateSchedule(schedule.id, { status }))
      .then(() =>
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: `Schedule was successfully ${statusName}!`,
          })
        )
      )
      .catch(() =>
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: 'Status update failed',
          })
        )
      )
  }

  const toggleModal = (schedule) => {
    setClickedSchedule(schedule)
    modal.current.open()
  }

  const toggleAddModal = () => {
    dispatch(getRunningBots({ page: 1, limit: 50 }))
    addModal.current.open()
  }

  const toggleEditModal = (schedule) => {
    setClickedSchedule(schedule)
    editModal.current.open()
  }

  const addSchedule = () => {
    if (instanceId) {
      dispatch(createSchedule({ instanceId })).then(() => {
        dispatch(
          getSchedules({
            page: 1,
            limit,
            sort: order.field,
            order: order.value,
            search,
          })
        )
        addModal.current.close()
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: 'Schedule was successfully added',
          })
        )
      })
    }
  }

  const updateScheduleInstance = (editedSchedules) => {
    editModal.current.close()
    dispatch(updateSchedule(clickedSchedule.id, { details: editedSchedules }))
      .then(() =>
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: 'Schedule was successfully updated',
          })
        )
      )
      .catch(() =>
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: 'Update of schedule failed',
          })
        )
      )
      .finally(() => setClickedSchedule(null))
  }

  const modalDeleteSchedule = () => {
    modal.current.close()
    dispatch(deleteSchedule(clickedSchedule.id))
      .then(() => {
        dispatch(
          getSchedules({
            page: 1,
            limit,
            sort: order.field,
            order: order.value,
            search,
          })
        )
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: 'Schedule was successfully deleted',
          })
        )
      })
      .catch(() =>
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: 'Removal of Schedule failed',
          })
        )
      )
      .finally(() => setClickedSchedule(null))
  }

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getSchedules({ page, limit, sort: field, order: value, search }))
  }

  // eslint-disable-next-line react/prop-types
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

  const searchSchedules = (value) => {
    setSearch(value)
    dispatch(
      getSchedules({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search: value,
      })
    )
  }

  const renderRow = (schedule, idx) => (
    <tr key={idx}>
      <td>{schedule.user}</td>
      <td>{schedule.instance_id}</td>
      <td>{schedule.bot_name}</td>
      <td>
        <StatusButton
          type={schedule.status === 'active' ? 'success' : 'danger'}
          onClick={() => changeScheduleStatus(schedule)}
        >
          {schedule.status}
        </StatusButton>
      </td>
      <td>
        {schedule.details.length > 0 ? (
          <ul>
            {schedule.details.map((detail, idx) => (
              <li key={idx}>
                <Tag pill type={'info'}>
                  {detail.status +
                    ' at ' +
                    detail.day +
                    ' ' +
                    detail.time +
                    ', ' +
                    detail.timezone}
                </Tag>
              </li>
            ))}
          </ul>
        ) : (
          'No schedules added yet'
        )}
      </td>
      <td>
        <Button color="primary" onClick={() => toggleEditModal(schedule)}>
          <Icon name={'edit'} color={theme.colors.white} />
        </Button>
        <Button type={'danger'} onClick={() => toggleModal(schedule)}>
          <Icon name={'garbage'} color={theme.colors.white} />
        </Button>
      </td>
    </tr>
  )

  return (
    <>
      <style jsx global>{`
        div[class*='-menu'] {
          background: #000;
        }
      `}</style>
      <AddButtonWrap>
        <Button color="primary" onClick={toggleAddModal}>
          Add schedule list
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <div>
            <LimitFilter
              id="limitfilter"
              instanceId="limitfilter"
              onChange={({ value }) => {
                setLimit(value)
                dispatch(
                  getSchedules({
                    page,
                    limit: value,
                    list,
                    sort: order.field,
                    order: order.value,
                    search,
                  })
                )
              }}
            />
            <ListFilter
              id="listfilter1"
              instanceId="listfilter1"
              options={FILTERS_LIST_OPTIONS}
              onChange={({ value }) => {
                setFilterList(value)
                dispatch(
                  getSchedules({
                    page,
                    limit,
                    list: value,
                    sort: order.field,
                    order: order.value,
                    search,
                  })
                )
              }}
            />
            <SearchFilter
              onChange={(value) => {
                searchSchedules(value)
              }}
            />
          </div>
          <Table>
            <thead>
              <tr>
                <OrderTh field={'user'}>User</OrderTh>
                <OrderTh field={'instance_id'}>Instance Id</OrderTh>
                <OrderTh field={'bot_name'}>Bot Name</OrderTh>
                <OrderTh field={'status'}>Status</OrderTh>
                <OrderTh>Details</OrderTh>
                <OrderTh>Actions</OrderTh>
              </tr>
            </thead>
            <tbody>{schedules.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={(page) => {
              setPage(page)
              dispatch(
                getSchedules({
                  page,
                  limit,
                  list,
                  sort: order.field,
                  order: order.value,
                  search,
                })
              )
            }}
          />
        </CardBody>
      </Container>

      <Modal
        ref={modal}
        title={'Delete this schedule?'}
        onClose={() => setClickedSchedule(null)}
      >
        <ButtonGroup>
          <Button color="primary" onClick={modalDeleteSchedule}>
            Yes
          </Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>
            Cancel
          </Button>
        </ButtonGroup>
      </Modal>

      <Modal
        ref={addModal}
        title={'Add Schedule'}
        // contentStyles={modalStyles}
        onClose={() => setInstanceId(null)}
      >
        <SelectWrap>
          <Label>Select one of your running bots</Label>
          <AsyncSelect
            onChange={onBotChange}
            loadOptions={searchBots}
            defaultOptions={runningBots.filter(toFilters).map(toOptions)}
            styles={selectStyles}
          />
        </SelectWrap>
        <ButtonGroup>
          <Button type={'danger'} onClick={() => addModal.current.close()}>
            Cancel
          </Button>
          <Button color="primary" onClick={addSchedule}>
            Add
          </Button>
        </ButtonGroup>
      </Modal>
      <Modal
        ref={editModal}
        title={'Schedule Editor'}
        // contentStyles={modalStyles}
        onClose={() => setClickedSchedule(null)}
      >
        <ScheduleEditor
          schedules={clickedSchedule ? clickedSchedule.details : []}
          close={() => editModal.current.close()}
          onUpdateClick={updateScheduleInstance}
          user={user}
        />
      </Modal>
    </>
  )
}

export default BotsSchedule
