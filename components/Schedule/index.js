import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  Modal,
  Button,
  Badge,
  Table,
  CardHeader,
  CardFooter,
} from 'reactstrap'
import { SearchFilter, LimitFilter, ListFilter } from 'components/default'
import { Th } from 'components/default/Table'
import { addNotification } from 'lib/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { NOTIFICATION_TYPES } from 'config'
import { Paginator } from 'components/default/Paginator'
import SweetAlert from 'react-bootstrap-sweetalert'
import {
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from 'store/schedule/actions'
import { getRunningBots } from 'store/bot/actions'
import ScheduleEditor from './ScheduleEditor'
import Skeleton from 'react-loading-skeleton'
import AddScheduleModal from './AddScheduleModal'

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
  const [list, setFilterList] = useState('all')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)
  const [clickedSchedule, setClickedSchedule] = useState(null)
  const [loadingAll, setLoadingAll] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const onSearch = () => {
    return dispatch(
      getSchedules({
        page,
        limit,
        list,
        sort: order.field,
        value: order.value,
        search,
      })
    )
  }

  useEffect(() => {
    onSearch().then(() => {
      setLoadingAll(false)
    })
  }, [])

  const schedules = useSelector((state) => state.schedule.schedules)
  const total = useSelector((state) => state.schedule.total)
  // const user = useSelector((state) => state.auth.user)
  // const error = useSelector((state) => state.schedule.error)

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
    setIsModalOpen(true)
  }

  const toggleAddModal = () => {
    dispatch(getRunningBots({ page: 1, limit: 50 }))
    setIsAddModalOpen(true)
  }

  const toggleEditModal = (schedule) => {
    setClickedSchedule(schedule)
    setIsEditModalOpen(true)
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
    setIsModalOpen(false)
    dispatch(deleteSchedule(clickedSchedule.id))
      .then(() => {
        setPage(1)
        onSearch()
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

  const SortableTableHeader = (props) => (
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

  // const loadSchedules = () => {}

  return (
    <Card>
      <CardHeader>
        <Button color="success" outline onClick={toggleAddModal}>
          Add schedule list
        </Button>
      </CardHeader>
      <CardBody>
        {/* {error && (
          <UncontrolledAlert color="danger">
            <span className="alert-icon">
              <i className="ni ni-like-2" />
            </span>
            <span className="alert-text ml-1">
              <strong>Danger!</strong> This is a danger alert—check it out!
            </span>
          </UncontrolledAlert>
        )} */}
        <div>
          <LimitFilter
            id="limitfilter"
            instanceId="limitfilter"
            onChange={({ value }) => {
              setLimit(value)
              onSearch()
            }}
          />
          <ListFilter
            id="listfilter1"
            instanceId="listfilter1"
            options={FILTERS_LIST_OPTIONS}
            onChange={({ value }) => {
              setFilterList(value)
              onSearch()
            }}
          />
          <SearchFilter
            onChange={(value) => {
              setSearch(value)
              onSearch()
            }}
          />
        </div>
        {loadingAll && <Skeleton count={5} />}
        {!loadingAll && (
          <Table responsive>
            <thead>
              <tr>
                <SortableTableHeader field={'user'}>User</SortableTableHeader>
                <SortableTableHeader field={'instance_id'}>
                  Instance Id
                </SortableTableHeader>
                <SortableTableHeader field={'bot_name'}>
                  Bot Name
                </SortableTableHeader>
                <SortableTableHeader field={'status'}>
                  Status
                </SortableTableHeader>
                <SortableTableHeader>Details</SortableTableHeader>
                <SortableTableHeader>Actions</SortableTableHeader>
              </tr>
            </thead>
            <tbody>{schedules.map(renderRow)}</tbody>
          </Table>
        )}
        {isModalOpen && (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes"
            confirmBtnBsStyle="danger"
            title="Delete this schedule?"
            onConfirm={modalDeleteSchedule}
            onCancel={() => {
              setIsModalOpen(false)
            }}
            focusCancelBtn
          />
        )}
        <AddScheduleModal
          isOpen={isAddModalOpen}
          onClose={setIsAddModalOpen}
          onRefresh={() => {
            setPage(1)
            onSearch()
          }}
        />
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setClickedSchedule(null)}
          size="lg"
        >
          <ScheduleEditor
            schedules={clickedSchedule ? clickedSchedule.details : []}
            close={() => setIsEditModalOpen(false)}
            onUpdateClick={updateScheduleInstance}
          />
        </Modal>
      </CardBody>
      <CardFooter>
        {!loadingAll && (
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={(page) => {
              setPage(page)
              onSearch()
            }}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export default BotsSchedule
