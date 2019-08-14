import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from './Button';
import Icon from './icons';
import styled from '@emotion/styled';
import moment from 'moment';
import { theme } from 'config';
import { connect } from 'react-redux';

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%'
  })
};

const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  &:first-of-type {
    margin-top: 20px;
  }
`;

const SelectWrap = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
  width: 100%;
  margin-right: 10px;
  &:last-of-type {
    flex: 1;
    align-self: flex-end;
    margin: 0 0 4px 0;
  }
`;

const Label = styled.label`
  font-size: 13px;
  margin-bottom: 5px;
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  &:last-child {
    margin-right: 0;
  }
`;

const TYPE_OPTIONS = [
  { value: 'stop', label: 'Stop' },
  { value: 'start', label: 'Start' }
];

const DAY_OPTIONS = moment.weekdays().map(day => ({ value: day, label: day }));

const TIME_OPTIONS = (() => {
  const startTime = moment('00:00', 'HH:mm');
  const endTime = moment('23:30', 'HH:mm');
  let timeStops = [];
  while(startTime <= endTime){
    let stop = new moment(startTime).format('HH:mm');
    timeStops.push({ value: stop, label: stop });
    startTime.add(30, 'minutes');
  }
  return timeStops;
})();

const Schedule = ({ type, day, time, idx, add, remove, updateScheduleList, ...props }) => {
  const [scheduleType, setScheduleType] = useState(TYPE_OPTIONS.find(item => item.value === type) || null);
  const [scheduleDay, setScheduleDay] = useState(DAY_OPTIONS.find(item => item.value === day) || null);
  const [scheduleTime, setScheduleTime] = useState(TIME_OPTIONS.find(item => item.value === time) || null);

  useEffect(() => {
    setScheduleType(TYPE_OPTIONS.find(item => item.value === type) || null);
  }, [type]);

  useEffect(() => {
    setScheduleDay(DAY_OPTIONS.find(item => item.value === day) || null);
  }, [day]);

  useEffect(() => {
    setScheduleTime(TIME_OPTIONS.find(item => item.value === time) || null);
  }, [time]);

  const addSchedule = () => {
    setScheduleType(null);
    setScheduleDay(null);
    setScheduleTime(null);
    add();
  };

  const changeSchedule = (fieldName, setter, option) => {
    setter(option);
    let schedule = {
      type: scheduleType && scheduleType.value,
      day: scheduleDay && scheduleDay.value,
      time: scheduleTime && scheduleTime.value
    };
    schedule[fieldName] = option.value;
    updateScheduleList(schedule, idx);
  };

  return(
    <SelectContainer {...props}>
      <SelectWrap>
        <Label>Type</Label>
        <Select options={TYPE_OPTIONS} styles={selectStyles} defaultValue={scheduleType} value={scheduleType}
          onChange={option => changeSchedule('type', setScheduleType, option)}
        />
      </SelectWrap>
      <SelectWrap>
        <Label>Day</Label>
        <Select options={DAY_OPTIONS} styles={selectStyles} defaultValue={scheduleDay} value={scheduleDay}
          onChange={option => changeSchedule('day', setScheduleDay, option)}
        />
      </SelectWrap>
      <SelectWrap>
        <Label>Time</Label>
        <Select options={TIME_OPTIONS} styles={selectStyles} defaultValue={scheduleTime} value={scheduleTime}
          onChange={option => changeSchedule('time', setScheduleTime, option)}
        />
      </SelectWrap>
      <SelectWrap>
        {
          idx === 0
            ? <IconButton type={'success'} onClick={addSchedule}>
              <Icon name={'plus'} color={theme.colors.white}/>
            </IconButton>
            : <IconButton type={'danger'} onClick={remove}>
              <Icon name={'garbage'} color={theme.colors.white}/>
            </IconButton>
        }

      </SelectWrap>
    </SelectContainer>
  );
};

const ScheduleEditor = ({ close, ...props }) => {
  const [schedules, setSchedules] = useState([{}].concat(props.schedules));

  const addSchedule = () => {
    setSchedules([{}].concat(schedules));
  };

  const removeSchedule = (idx) => {
    setSchedules([].concat(schedules.slice(0, idx), schedules.slice(idx + 1)));
  };

  const updateScheduleList = (schedule, idx) => {
    schedules[idx] = schedule;
    setSchedules(schedules);
  };

  const updateSchedule = () => {

  };

  return(
    <>
      {
        schedules.map(
          (schedule, idx) => <Schedule key={idx} type={schedule.type} day={schedule.day} idx={idx}
            time={schedule.time} add={addSchedule} remove={() => removeSchedule(idx)}
            updateScheduleList={updateScheduleList}
          />
        )
      }
      <Buttons>
        <Button type={'primary'} onClick={updateSchedule}>Update</Button>
        <Button type={'danger'} onClick={close}>Cancel</Button>
      </Buttons>
    </>
  );
};

ScheduleEditor.propTypes = {
  close: PropTypes.func.isRequired,
  schedules: PropTypes.array.isRequired
};

Schedule.propTypes = {
  idx: PropTypes.number.isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  updateScheduleList: PropTypes.func.isRequired,
  time: PropTypes.string,
  day: PropTypes.string,
  type: PropTypes.string
};

export default connect(null, null)(ScheduleEditor);