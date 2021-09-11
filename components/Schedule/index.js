import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  Modal,
  Button,
  Table,
  CardHeader,
  CardFooter,
} from 'reactstrap'
import {
  SearchFilter,
  LimitFilter,
  ListFilter,
  TableHeader,
} from 'components/default'
import ScheduleTableRow from './ScheduleTableRow'

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

const BotsSchedule = () => {
  const dispatch = useDispatch()
  const [list, setFilterList] = useState('all')
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)
  const [clickedSchedule, setClickedSchedule] = useState(null)
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
    onSearch()
  }, [])

  const schedules = useSelector((state) => state.schedule.schedules)
  const total = useSelector((state) => state.schedule.total)
  const loading = useSelector((state) => state.schedule.loading)

  const handleStatusChange = (schedule) => {
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

  const handleDelete = (schedule) => {
    setClickedSchedule(schedule)
    setIsModalOpen(true)
  }

  const toggleAddModal = () => {
    dispatch(getRunningBots({ page: 1, limit: 50 }))
    setIsAddModalOpen(true)
  }

  const handleEdit = (schedule) => {
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
    <TableHeader
      {...props}
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ''
      }
      onClick={onOrderChange}
    />
  )

  return (
    <Card>
      <CardHeader>
        <Button color="success" outline onClick={toggleAddModal}>
          Add schedule list
        </Button>
      </CardHeader>
      <CardBody>
        <div>
          <LimitFilter
            defaultValue={limit}
            total={total}
            onChange={(value) => {
              setLimit(value)
              onSearch()
            }}
            loading={loading}
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
        {loading && <Skeleton count={5} />}
        {!loading && (
          <Table className="table-flush" responsive>
            <thead className="thead-light">
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
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => {
                return (
                  <ScheduleTableRow
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    handleStatusChange={handleStatusChange}
                  />
                )
              })}
            </tbody>
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
          onClose={() => {
            setIsAddModalOpen(false)
          }}
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
        {!loading && (
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
