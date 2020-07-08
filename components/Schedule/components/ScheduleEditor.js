import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Button from "/components/default/Button";
import Icon from "/components/default/icons";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { theme, WEEKDAYS } from "/config";

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

const TYPE_OPTIONS = [
    { value: "stopped", label: "Stopped" },
    { value: "running", label: "Running" }
];

const DAY_OPTIONS = WEEKDAYS.map(day => ({ value: day, label: day }));

const TIME_OPTIONS = (() => {
    let startTime = dayjs()
      .hour(0)
      .minute(0)
      .second(0);
    const endTime = dayjs()
      .hour(23)
      .minute(30)
      .second(0);
    let timeStops = [];
    while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
        let stop = startTime.format("HH:mm");
        timeStops.push({ value: stop, label: stop });
        startTime = startTime.add(30, "minute");
    }
    return timeStops;
})();

const Schedule = ({
                      status,
                      day,
                      time,
                      idx,
                      add,
                      remove,
                      updateScheduleList,
                      ...props
                  }) => {
    const [scheduleType, setScheduleType] = useState(
      TYPE_OPTIONS.find(item => item.value === status) || null
    );
    const [scheduleDay, setScheduleDay] = useState(
      DAY_OPTIONS.find(item => item.value === day) || null
    );
    const [scheduleTime, setScheduleTime] = useState(
      TIME_OPTIONS.find(item => item.value === time) || null
    );
    const [error, setError] = useState(null);

    useEffect(() => {
        setScheduleType(TYPE_OPTIONS.find(item => item.value === status) || null);
    }, [status]);

    useEffect(() => {
        setScheduleDay(DAY_OPTIONS.find(item => item.value === day) || null);
    }, [day]);

    useEffect(() => {
        setScheduleTime(TIME_OPTIONS.find(item => item.value === time) || null);
    }, [time]);

    const addSchedule = () => {
        if (!scheduleTime || !scheduleType || !scheduleDay) {
            setError("You must fill all fields");
        } else {
            setError(null);
            setScheduleType(null);
            setScheduleDay(null);
            setScheduleTime(null);
            add();
        }
    };

    const changeSchedule = (fieldName, setter, option) => {
        setter(option);
        let schedule = {
            status: scheduleType && scheduleType.value,
            day: scheduleDay && scheduleDay.value,
            time: scheduleTime && scheduleTime.value
        };
        schedule[fieldName] = option.value;
        updateScheduleList(schedule, idx);
    };

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
                    onChange={option => changeSchedule("status", setScheduleType, option)}
                  />
              </SelectWrap>
              <SelectWrap>
                  <Label>Day</Label>
                  <Select
                    options={DAY_OPTIONS}
                    styles={selectStyles}
                    defaultValue={scheduleDay}
                    value={scheduleDay}
                    onChange={option => changeSchedule("day", setScheduleDay, option)}
                  />
              </SelectWrap>
              <SelectWrap>
                  <Label>Time</Label>
                  <Select
                    options={TIME_OPTIONS}
                    styles={selectStyles}
                    defaultValue={scheduleTime}
                    value={scheduleTime}
                    onChange={option => changeSchedule("time", setScheduleTime, option)}
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

const ScheduleEditor = ({ close, onUpdateClick, ...props }) => {
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
              day={schedule.day}
              idx={idx}
              time={schedule.time}
              add={addSchedule}
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
    onUpdateClick: PropTypes.func.isRequired
};

Schedule.propTypes = {
    idx: PropTypes.number.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    updateScheduleList: PropTypes.func.isRequired,
    time: PropTypes.string,
    day: PropTypes.string,
    status: PropTypes.string
};

export default ScheduleEditor;
