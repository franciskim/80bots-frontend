import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Table,
  UncontrolledAlert,
} from 'reactstrap'
import ScheduleEditorRow from './ScheduleEditorRow'
import { useSelector } from 'react-redux'
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

// const Error = styled.span`
//   font-size: 15px;
//   text-align: center;
// `

const ScheduleEditor = ({ close, onUpdateClick, ...props }) => {
  const [schedules, setSchedules] = useState([{}].concat(props.schedules))
  const [error, setError] = useState(null)

  const user = useSelector((state) => state.auth.user)

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
      <ModalHeader>Schedule Editor</ModalHeader>
      <ModalBody>
        {error && (
          <UncontrolledAlert color="danger">
            <span className="alert-icon">
              <i className="ni ni-like-2" />
            </span>
            <span className="alert-text ml-1">{error}</span>
          </UncontrolledAlert>
        )}
        <Table className="table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>Status</th>
              <th>Day</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, idx) => (
              <ScheduleEditorRow
                key={idx}
                idx={idx}
                schedule={schedule}
                add={addSchedule}
                remove={() => removeSchedule(idx)}
                updateScheduleList={updateScheduleList}
                user={user}
                setError={setError}
              />
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button onClick={close}>Cancel</Button>
        <Button color={'primary'} onClick={updateSchedule}>
          Update
        </Button>
      </ModalFooter>
    </>
  )
}

ScheduleEditor.propTypes = {
  close: PropTypes.func.isRequired,
  schedules: PropTypes.array.isRequired,
  onUpdateClick: PropTypes.func.isRequired,
}

export default ScheduleEditor
