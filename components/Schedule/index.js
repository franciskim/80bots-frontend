import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  ModalBody,
  Modal,
  Button,
  Badge,
  Label,
  Table,
  ModalFooter,
  ModalHeader,
  CardHeader,
  CardFooter,
} from 'reactstrap'
import {
  LimitFilter,
  ListFilter,
  SearchFilter,
  Th,
} from 'components/default/Table'
import { addNotification } from 'lib/helper'
import { useDispatch, useSelector } from 'react-redux'
import { NOTIFICATION_TYPES } from 'config'
import Paginator from 'components/default/Paginator'
import SweetAlert from 'react-bootstrap-sweetalert'
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

// const Tag = styled(Badge)`
//   text-transform: capitalize;
//   margin-right: 0.5rem;
//   font-size: 14px;
//   &:last-child {
//     margin-right: 0;
//   }
// `
const FILTERS_LIST_OPTIONS = [
  { value: 'all', label: 'All Schedules' },
  { value: 'my', label: 'My Schedules' },
]

// const selectStyles = {
//   control: (provided, { selectProps: { width } }) => ({
//     ...provided,
//     width: width,
//     minWidth: '75px',
//     border: 'solid 1px hsl(0,0%,80%)',
//     borderRadius: '4px',
//     color: '#fff',
//     backgroundColor: 'transparent',
//     '&:hover': {
//       borderColor: '#7dffff',
//     },
//   }),
//   singleValue: (provided, state) => ({
//     ...provided,
//     color: '#fff',
//   }),
//   menu: (provided, state) => ({
//     ...provided,
//     border: 'solid 1px hsl(0,0%,80%)',
//     borderRadius: '4px',
//   }),
//   menuList: (provided, state) => ({
//     ...provided,
//     backgroundColor: '#333',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     color: state.isFocused ? 'black' : '#fff',
//   }),
// }

const BotsSchedule = () => {
  const dispatch = useDispatch()
  const [clickedSchedule, setClickedSchedule] = useState(null)
  const [list, setFilterList] = useState('all')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [instanceId, setInstanceId] = useState(null)
  const [search, setSearch] = useState(null)

  const [isModalOpen, setIsModelOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    dispatch(getSchedules({ page, limit, list }))
  }, [])

  const schedules = useSelector((state) => state.schedule.schedules)
  const runningBots = useSelector((state) => state.bot.botInstances)
  const total = useSelector((state) => state.schedule.total)
  const user = useSelector((state) => state.auth.user)

  const searchBots = (value, callback) => {
    dispatch(getRunningBots({ page: 1, limit: 50, search: value })).then(
      (action) => {
        console.error(action, 'returns,')
        return callback(action.data.data.map(toOptions))
      }
    )
  }

  const onBotChange = (option) => {
    console.error(option, '>>>>')
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
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Schedule was successfully ${statusName}!`,
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Status update failed',
        })
      )
  }

  const toggleModal = (schedule) => {
    setClickedSchedule(schedule)
    modal.current.open()
  }

  const toggleAddModal = () => {
    dispatch(getRunningBots({ page: 1, limit: 50 }))
    setIsAddModalOpen(true)
  }

  const toggleEditModal = (schedule) => {
    setClickedSchedule(schedule)
    setIsEditModalOpen(true)
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
        setIsAddModalOpen(false)
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Schedule was successfully added',
        })
      })
    }
  }

  const updateScheduleInstance = (editedSchedules) => {
    setIsEditModalOpen(false)
    dispatch(updateSchedule(clickedSchedule.id, { details: editedSchedules }))
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Schedule was successfully updated',
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Update of schedule failed',
        })
      )
      .finally(() => setClickedSchedule(null))
  }

  const modalDeleteSchedule = () => {
    setIsModelOpen(false)
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
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Schedule was successfully deleted',
        })
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Removal of Schedule failed',
        })
      )
      .finally(() => setClickedSchedule(null))
  }

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getSchedules({ page, limit, sort: field, order: value, search }))
  }

  const OrderTh = (props) => (
    <Th
      {...props}
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

  const renderRow = (schedule) => (
    <tr key={schedule.id}>
      <td>{schedule.user}</td>
      <td>{schedule.instance_id}</td>
      <td>{schedule.bot_name}</td>
      <td>
        <Button
          color={schedule.status === 'active' ? 'success' : 'danger'}
          onClick={() => changeScheduleStatus(schedule)}
          size="sm"
        >
          {schedule.status}
        </Button>
      </td>
      <td>
        {schedule.details.length > 0 ? (
          <ul className="list-unstyled">
            {schedule.details.map((detail, idx) => (
              <li key={idx}>
                <Badge pill color={'info'} key={idx}>
                  {detail.status +
                    ' at ' +
                    detail.day +
                    ' ' +
                    detail.time +
                    ', ' +
                    detail.timezone}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          'No schedules added yet'
        )}
      </td>
      <td>
        <a
          className="table-action"
          href="#"
          title="Edit"
          onClick={() => toggleEditModal(schedule)}
        >
          <i className="fas fa-edit" />
        </a>
        <a
          className="table-action"
          href="#"
          title="Delete"
          onClick={() => toggleModal(schedule)}
        >
          <i className="fas fa-trash" />
        </a>
      </td>
    </tr>
  )

  return (
    <Card>
      <CardHeader>
        <Button color="primary" onClick={toggleAddModal}>
          Add schedule list
        </Button>
      </CardHeader>
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
            searchProps={{
              onSearch: (value) => {
                searchSchedules(value)
              },
            }}
          />
        </div>
        <Table responsive>
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
        {isModalOpen && (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes"
            confirmBtnBsStyle="danger"
            title="Delete this schedule?"
            onConfirm={modalDeleteSchedule}
            onCancel={() => {
              setIsModelOpen(false)
            }}
            focusCancelBtn
          />
        )}

        <Modal isOpen={isAddModalOpen} onClose={() => setInstanceId(null)}>
          <ModalHeader>Add Schedule</ModalHeader>
          <ModalBody>
            <Label>Select one of your running bots</Label>
            <AsyncSelect
              onChange={onBotChange}
              loadOptions={searchBots}
              defaultOptions={runningBots.filter(toFilters).map(toOptions)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button color="primary" onClick={addSchedule}>
              Add
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setClickedSchedule(null)}
        >
          <ScheduleEditor
            schedules={clickedSchedule ? clickedSchedule.details : []}
            close={() => setIsEditModalOpen(false)}
            onUpdateClick={updateScheduleInstance}
            user={user}
          />
        </Modal>
      </CardBody>
      <CardFooter>
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
      </CardFooter>
    </Card>
  )
}

export default BotsSchedule
