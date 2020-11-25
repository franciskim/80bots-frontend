import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
    Input,
    Label,
    LabelWrap,
    Description,
    Select,
    Range
} from "/components/default/inputs";
import { Button } from "/components/default";

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
  min-height: 38px;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 10px;
`;

const inputStyle = {
    container: css`
    margin-top: 10px;
  `
};

const selectStyles = {
    container: css`
    margin-top: 10px;
    max-width: 400px;
  `
};

const RestartEditor = ({ botInstance, onSubmit, onClose }) => {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        initializeValues();
    }, [botInstance]);

    const initializeValues = () => {
        let botParams = {};
        botInstance &&
        botInstance.parameters.forEach(param => {
            if (getInputType(param.type) === "checkbox")
                botParams[param.name] = false;
            if (getInputType(param.type) === "range")
                botParams[param.name] = Number(
                    Math.floor((Number(param.range[0]) + Number(param.range[1])) / 2)
                );
            if (
                getInputType(param.type) === "text" ||
                getInputType(param.type) === "number" ||
                getInputType(param.type) === "password"
            )
                botParams[param.name] = "";
            if (param.type === "multiselect")
                botParams[param.name] = { term: "", options: [] };
        });
        setValues(botParams);
    };

    const validateValues = () => {
        let err = [];
        setErrors([]);
        botInstance &&
        botInstance.parameters.forEach(param => {
            if (
                (!values[param.name] &&
                    getInputType(param.type) !== "checkbox" &&
                    getInputType(param.type) !== "range" &&
                    values[param.name] !== 0) ||
                (param.type === "multiselect" && !values[param.name].options)
            ) {
                err.push(param.name);
            }
        });
        if (err.length) setErrors(err);
        return !err.length;
    };

    const valuesToResult = values => {

        let result = {};
        let combined = [];
        values.forEach(val => {
            botInstance.parameters.forEach(({ name, type }) => {
                switch (type) {
                    case "multiselect": {
                        result[name] = val[name].options.map(item => item.value);
                        break;
                    }
                    case "enum": {
                        result[name] = val[name].value;
                        break;
                    }
                    default: {
                        result[name] = val[name];
                        break;
                    }
                }
            });
            combined.push(result);
        });
        return combined;
    };
    const submit = () => {
        console.log('values ', values);
        if (validateValues()) {
            let result = [];
            result[0] = values;
            console.log('result -----------'+ JSON.stringify(result));
            onSubmit(valuesToResult(result));
        }
            
    };

    const cancel = () => {
        onClose();
    };

    const changeValue = (field, value, option) => {
        let valuesCopy = { ...values };
        valuesCopy[field] = option || value;
        setValues(valuesCopy);
    };

    const toOptions = value => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value
    });

    const getLabel = param =>
        param.title || param.name.charAt(0).toUpperCase() + param.name.slice(1);

    const getInputType = type => {
        switch (type) {
            case "string":
            case "String":
                return "text";

            case "integer":
            case "Integer":
            case "Number":
                return "number";

            case "range":
                return "range";

            case "password":
                return "password";

            case "boolean":
            case "Boolean":
            case "bool":
                return "checkbox";
        }
    };

    const getMultiSelectOptions = paramName => {
        let options = values[paramName] ? values[paramName].options : [];
        const term = values[paramName] ? values[paramName].term : "";
        if (
            term &&
            options &&
            !options.find(item => item.label.match(new RegExp(term, "ig")))
        ) {
            options = [{ value: term, label: term }].concat(options);
        }
        return options;
    };

    const changeMultiSelectValue = (field, options) => {
        let valuesCopy = { ...values };
        valuesCopy[field].options = options;
        setValues(valuesCopy);
    };

    const onMultiSelectChange = (field, newValue) => {
        let valuesCopy = { ...values };
        valuesCopy[field].term = newValue;
        setValues(valuesCopy);
    };

    const renderParams = (item, idx) => {
        const type = getInputType(item.type);
        const label = getLabel(item);

        switch (item.type) {
            case "enum":
                return (
                    <Select
                        key={idx}
                        options={item.values.map(toOptions)}
                        label={label}
                        value={values[item.name]}
                        menuPlacement={"top"}
                        error={
                            errors.indexOf(item.name) > -1 ? "This field is required" : ""
                        }
                        description={item.description}
                        onChange={option => changeValue(item.name, option.value, option)}
                        styles={selectStyles}
                    />
                );

            case "integer":
            case "Integer":
                return (
                    <Input
                        key={idx}
                        type={type}
                        label={label}
                        styles={inputStyle}
                        value={values[item.name]}
                        min={item.range && Number(item.range[0])}
                        max={item.range && Number(item.range[1])}
                        onChange={e => changeValue(item.name, Number(e.target.value))}
                        description={item.description}
                        error={
                            errors.indexOf(item.name) > -1 ? "This field is required" : ""
                        }
                        descriptionPosition={idx === 0 ? "bottom" : "top"}
                    />
                );

            case "bool":
            case "boolean":
            case "Boolean":
                return (
                    <InputWrap key={idx}>
                        <LabelWrap>
                            <Label>{label}</Label>
                            {item.description && (
                                <Description
                                    text={item.description}
                                    position={idx === 0 ? "bottom" : "top"}
                                />
                            )}
                        </LabelWrap>
                        <StatusButton
                            type={values[item.name] ? "primary" : "danger"}
                            onClick={() => changeValue(item.name, !values[item.name])}
                        >
                            {values[item.name] ? "Yes" : "No"}
                        </StatusButton>
                    </InputWrap>
                );

            case "multiselect":
                return (
                    <Select
                        key={idx}
                        label={label}
                        isMulti
                        error={
                            errors.indexOf(item.name) > -1 ? "This field is required" : ""
                        }
                        onChange={options => changeMultiSelectValue(item.name, options)}
                        styles={selectStyles}
                        options={getMultiSelectOptions(item.name)}
                        description={item.description}
                        onInputChange={input => onMultiSelectChange(item.name, input)}
                        value={values[item.name].options}
                        descriptionPosition={idx === 0 ? "bottom" : "top"}
                    />
                );

            case "String":
            case "password":
            case "string":
                return (
                    <Input
                        key={idx}
                        type={type}
                        label={label}
                        styles={inputStyle}
                        value={values[item.name]}
                        onChange={e => changeValue(item.name, e.target.value)}
                        description={item.description}
                        error={
                            errors.indexOf(item.name) > -1 ? "This field is required" : ""
                        }
                        descriptionPosition={idx === 0 ? "bottom" : "top"}
                    />
                );

            case "range":
                return (
                    <Range
                        key={idx}
                        label={label}
                        styles={inputStyle}
                        description={item.description}
                        min={item.range && Number(item.range[0])}
                        max={item.range && Number(item.range[1])}
                        onChange={value => changeValue(item.name, value)}
                        value={values[item.name]}
                        descriptionPosition={idx === 0 ? "bottom" : "top"}
                    />
                );
        }
    };

    return(
        <>
            {botInstance && botInstance.parameters.map(renderParams)}
            <Buttons>
                <Button
                    type={"danger"}
                    onClick={cancel}
                >
                    Cancel
                </Button>
                <Button type={"primary"} onClick={submit}>
                     Restart
                </Button>
            </Buttons>
        </>
    );
};

RestartEditor.propTypes = {
    botInstance: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RestartEditor;
