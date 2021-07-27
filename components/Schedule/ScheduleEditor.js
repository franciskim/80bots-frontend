import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import { WEEKDAYS } from 'config'
import { Button, ModalFooter, Label, Container, Col, Row } from 'reactstrap'

// const selectStyles = {
//   control: (provided, state) => ({
//     ...provided,
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

// const Buttons = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// `

// const SelectContainer = styled(Container)`
//   flex-direction: row;
//   justify-content: space-between;
//   width: 100%;
//   margin-bottom: 20px;
//   &:first-of-type {
//     margin-top: 20px;
//   }
// `

// const SelectWrap = styled.div`
//   display: flex;
//   flex: 3;
//   flex-direction: column;
//   width: 100%;
//   margin-right: 10px;
//   &:last-of-type {
//     flex: 1;
//     align-self: flex-end;
//     margin: 0 0 4px 0;
//   }
// `

// const IconButton = styled(Button)`
//   display: inline-flex;
//   justify-content: center;
//   align-items: center;
//   padding: 2px;
//   margin-right: 5px;
//   width: 30px;
//   height: 30px;
//   &:last-child {
//     margin-right: 0;
//   }
// `

const Error = styled.span`
  font-size: 15px;
  text-align: center;
`

const STATUS_OPTIONS = [
  { value: 'stopped', label: 'Stopped' },
  { value: 'running', label: 'Running' },
]

const DAY_OPTIONS = WEEKDAYS.map((day) => ({ value: day, label: day }))

const TIME_OPTIONS = (() => {
  let startTime = dayjs().hour(0).minute(0).second(0)
  const endTime = dayjs().hour(23).minute(30).second(0)
  let timeStops = []
  while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
    let stop = startTime.format('h:mm A')
    timeStops.push({ value: stop, label: stop })
    startTime = startTime.add(30, 'minute')
  }
  return timeStops
})()

const Schedule = ({
  status,
  time,
  day,
  idx,
  add,
  remove,
  updateScheduleList,
  timezone,
}) => {
  const [scheduleStatus, setScheduleStatus] = useState(
    STATUS_OPTIONS.find((item) => item.value === status) || null
  )

  const [scheduleDay, setScheduleDay] = useState(
    DAY_OPTIONS.find((item) => item.value === day) || null
  )

  const [scheduleTime, setScheduleTime] = useState(
    TIME_OPTIONS.find((item) => item.value === time) || null
  )

  const [error, setError] = useState(null)

  useEffect(() => {
    setScheduleStatus(
      STATUS_OPTIONS.find((item) => item.value === status) || null
    )
  }, [status])

  useEffect(() => {
    setScheduleDay(DAY_OPTIONS.find((item) => item.value === day) || null)
  }, [day])

  useEffect(() => {
    setScheduleTime(TIME_OPTIONS.find((item) => item.value === time) || null)
  }, [time])

  const addSchedule = () => {
    if (!scheduleStatus || !scheduleDay || !scheduleTime) {
      setError('You must fill all fields')
    } else {
      setError(null)
      setScheduleStatus(null)
      setScheduleDay(null)
      setScheduleTime(null)
      add()
    }
  }

  const changeSchedule = (status, setter, option) => {
    setter(option)
    let schedule = {
      status: scheduleStatus && scheduleStatus.value,
      day: scheduleDay && scheduleDay.value,
      time: scheduleTime && scheduleTime.value,
      timezone: timezone,
    }
    schedule[status] = option.value
    updateScheduleList(schedule, idx)
  }

  return (
    <Container>
      <Row>
        <Col md="3">
          <Label>Status</Label>
          <Select
            options={STATUS_OPTIONS}
            defaultValue={scheduleStatus}
            value={scheduleStatus}
            onChange={(option) =>
              changeSchedule('status', setScheduleStatus, option)
            }
            // styles={selectStyles}
          />
        </Col>
        <Col md="3">
          <Label>Day</Label>
          <Select
            options={DAY_OPTIONS}
            // styles={selectStyles}
            defaultValue={scheduleDay}
            value={scheduleDay}
            onChange={(option) => changeSchedule('day', setScheduleDay, option)}
          />
        </Col>
        <Col md="3">
          <Label>Time</Label>
          <Select
            options={TIME_OPTIONS}
            // styles={selectStyles}
            defaultValue={scheduleTime}
            value={scheduleTime}
            onChange={(option) =>
              changeSchedule('time', setScheduleTime, option)
            }
          />
        </Col>
        <Col md="3">
          {idx === 0 ? (
            <Button
              className="btn-icon"
              color="success"
              type="button"
              onClick={addSchedule}
              size="sm"
            >
              <span className="btn-inner--icon mr-1">
                <i className="fa fa-plus" />
              </span>
            </Button>
          ) : (
            <Button
              className="btn-icon"
              color="danger"
              type="button"
              onClick={remove}
              size="sm"
            >
              <span className="btn-inner--icon mr-1">
                <i className="fa fa-trash" />
              </span>
            </Button>
          )}
        </Col>
        {error && <Error>{error}</Error>}
      </Row>
    </Container>
  )
}

const ScheduleEditor = ({ close, onUpdateClick, user, ...props }) => {
  const [schedules, setSchedules] = useState([{}].concat(props.schedules))

  const addSchedule = () => {
    setSchedules([{}].concat(schedules))
  }

  const removeSchedule = (idx) => {
    setSchedules([].concat(schedules.slice(0, idx), schedules.slice(idx + 1)))
  }

  const updateScheduleList = (schedule, idx) => {
    schedules[idx] = schedule
    setSchedules(schedules)
  }

  const updateSchedule = () => {
    onUpdateClick(schedules.slice(1))
  }

  return (
    <>
      {schedules.map((schedule, idx) => (
        <Schedule
          key={idx}
          status={schedule.status}
          time={schedule.time}
          day={schedule.day}
          idx={idx}
          add={addSchedule}
          timezone={user.timezone}
          remove={() => removeSchedule(idx)}
          updateScheduleList={updateScheduleList}
        />
      ))}
      <ModalFooter>
        <Button color={'danger'} onClick={close}>
          Cancel
        </Button>
        <Button color={'primary'} onClick={updateSchedule}>
          Update
        </Button>
      </ModalFooter>
    </>
  )
}

// ScheduleEditor.propTypes = {
//   close: PropTypes.func.isRequired,
//   schedules: PropTypes.array.isRequired,
//   onUpdateClick: PropTypes.func.isRequired,
//   user: PropTypes.object.isRequired,
// }

// Schedule.propTypes = {
//   status: PropTypes.string,
//   time: PropTypes.string,
//   day: PropTypes.string,
//   idx: PropTypes.number.isRequired,
//   add: PropTypes.func.isRequired,
//   remove: PropTypes.func.isRequired,
//   updateScheduleList: PropTypes.func.isRequired,
//   onClick: PropTypes.func,
//   value: PropTypes.string,
//   timezone: PropTypes.string,
// }

export default ScheduleEditor
