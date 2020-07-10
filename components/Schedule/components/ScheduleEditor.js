import React, { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Button from "/components/default/Button";
import Icon from "/components/default/icons";
import styled from "@emotion/styled";
import { theme } from "/config";
import {formatTimezone, formatDate, formatToDate} from "../../../lib/helpers";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const selectStyles = {
    valueContainer: provided => ({
        ...provided,
        padding: "0 8px",
        borderColor: "#ced4da",
    }),
    menuList: () => ({
        color: "#000000",
        backgroundColor: "#f8f9fa",

    }),
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectContainer = styled(Container)`
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

const Error = styled.span`
  font-size: 15px;
  text-align: center;
  color: ${props => props.theme.colors.darkishPink};
`;

const InputWrapper = styled.div`
    align-items: center;
    border-color: hsl(0,0%,80%);
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    min-height: 38px;
    outline: 0 !important;
    transition: all 100ms;
    box-sizing: border-box;
`;

const TYPE_OPTIONS = [
    { value: "stopped", label: "Stopped" },
    { value: "running", label: "Running" }
];

const Schedule = ({
  status,
  time,
  idx,
  add,
  remove,
  updateScheduleList,
  timezone,
  ...props
}) => {

    const [scheduleType, setScheduleType] = useState(
      TYPE_OPTIONS.find(item => item.value === status) || null
    );

    const [scheduleDate, setScheduleDate] = useState(time ? formatToDate(time) : null);

    const [error, setError] = useState(null);

    useEffect(() => {
        setScheduleType(TYPE_OPTIONS.find(item => item.value === status) || null);
    }, [status]);

    useEffect(() => {
        setScheduleDate( time ? formatToDate(time) : null);
    }, [time]);

    const addSchedule = () => {
        if ( !scheduleType || !scheduleDate) {
            setError("You must fill all fields");
        } else {
            setError(null);
            setScheduleType(null);
            setScheduleDate(null);
            add();
        }
    };

    const changeSchedule = (type, setter, option) => {
        setter(option);
        let schedule = {
            status: scheduleType && scheduleType.value,
        };
        switch (type) {
            case "schedule date":
                schedule['platform_time'] = formatDate(option);
                schedule['schedule_time'] = formatTimezone(option, timezone, 'UTC');
                break;
            case "schedule type":
                schedule['type'] = option.value;
                break;
            default:
                break;
        }
        updateScheduleList(schedule, idx);
    };

    const ref = React.createRef();

    const CustomDateInput = forwardRef(({ onClick, value }, ref) => (
      <InputWrapper onClick={onClick} value={value} onChange={onClick} ref={ref}> { value } </InputWrapper>
    ));

    return (
      <Container {...props}>
          <SelectContainer>
              <SelectWrap>
                  <Label>Status</Label>
                  <Select
                    options={TYPE_OPTIONS}
                    styles={selectStyles}
                    defaultValue={scheduleType}
                    value={scheduleType}
                    onChange={option => changeSchedule("schedule type", setScheduleType, option)}
                  />
              </SelectWrap>
              <SelectWrap>
                  <Label>Day & Time</Label>
                  <DatePicker
                    selected={scheduleDate}
                    onChange={date => changeSchedule("schedule date", setScheduleDate, date)}
                    timeInputLabel="Time:"
                    dateFormat="yyy-MM-dd h:mm aa"
                    showTimeInput
                    customInput={
                        <CustomDateInput ref={ref}/>
                    }
                  />
              </SelectWrap>
              <SelectWrap>
                  {idx === 0 ? (
                    <IconButton type={"success"} onClick={addSchedule}>
                        <Icon name={"plus"} color={theme.colors.white} />
                    </IconButton>
                  ) : (
                    <IconButton type={"danger"} onClick={remove}>
                        <Icon name={"garbage"} color={theme.colors.white} />
                    </IconButton>
                  )}
              </SelectWrap>
          </SelectContainer>
          {error && <Error>{error}</Error>}
      </Container>
    );
};

const ScheduleEditor = ({ close, onUpdateClick, user, ...props }) => {

    const [schedules, setSchedules] = useState([{}].concat(props.schedules));

    const addSchedule = () => {
        setSchedules([{}].concat(schedules));
    };

    const removeSchedule = idx => {
        setSchedules([].concat(schedules.slice(0, idx), schedules.slice(idx + 1)));
    };

    const updateScheduleList = (schedule, idx) => {
        schedules[idx] = schedule;
        setSchedules(schedules);
    };

    const updateSchedule = () => {
        onUpdateClick(schedules.slice(1));
    };

    return (
      <>
          {schedules.map((schedule, idx) => (
            <Schedule
              key={idx}
              status={schedule.status}
              idx={idx}
              time={schedule.platform_time}
              add={addSchedule}
              timezone={user.timezone}
              remove={() => removeSchedule(idx)}
              updateScheduleList={updateScheduleList}
            />
          ))}
          <Buttons>
              <Button type={"danger"} onClick={close}>
                  Cancel
              </Button>
              <Button type={"primary"} onClick={updateSchedule}>
                  Update
              </Button>
          </Buttons>
      </>
    );
};

ScheduleEditor.propTypes = {
    close: PropTypes.func.isRequired,
    schedules: PropTypes.array.isRequired,
    onUpdateClick: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};

Schedule.propTypes = {
    idx: PropTypes.number.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    updateScheduleList: PropTypes.func.isRequired,
    time: PropTypes.string,
    day: PropTypes.string,
    status: PropTypes.string,
    onClick: PropTypes.func,
    value:PropTypes.string,
    timezone:PropTypes.string,
};

export default ScheduleEditor;
