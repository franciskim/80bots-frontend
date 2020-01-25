import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { css } from "@emotion/core";
import { theme } from "/config";
import { Label, Wrap, LabelWrap, Description } from "./Input";

const thumbStyles = css`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: hsl(200, 100%, 40%);
  cursor: pointer;
  transition: background 100ms ease-in-out;
  &:hover {
    background: ${theme.colors.darkishPink};
  }
`;

const DefaultRange = styled.input`
  &[type="range"] {
    -webkit-appearance: none;
    border-radius: 5px;
    height: 5px;
    outline: none;
    cursor: pointer;
    width: 100%;
    background-color: ${props => props.theme.colors.silver};
    &::-webkit-slider-thumb {
      ${thumbStyles};
    }
    &::-moz-range-thumb {
      ${thumbStyles};
    }
    &:active::-webkit-slider-thumb {
      background: ${props => props.theme.colors.darkishPink};
    }
    &:active::-moz-range-thumb {
      background: ${props => props.theme.colors.darkishPink};
    }
  }
`;

const RangeValue = styled.span`
  display: inline-block;
  position: relative;
  width: 50px;
  color: ${props => props.theme.colors.darkerGrey};
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  background: ${props => props.theme.colors.primary};
  padding: 5px 10px;
  margin-left: 12px;
  &:after {
    position: absolute;
    top: 8px;
    left: -7px;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-right: 7px solid ${props => props.theme.colors.primary};
    border-bottom: 7px solid transparent;
    content: "";
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  ${props => props.styles};
`;

export const Range = ({
  styles,
  onChange,
  min,
  label,
  value,
  description,
  ...props
}) => {
  const [val, setVal] = useState(value || min || 0);

  useEffect(() => {
    onChange(val);
  }, []);

  useEffect(() => {
    if (value) setVal(value);
  }, [value]);

  const changeValue = e => {
    onChange(Number(e.target.value));
    setVal(Number(e.target.value));
  };

  return (
    <Wrap styles={styles && styles.container}>
      <LabelWrap>
        {label && <Label styles={styles && styles.label}>{label}</Label>}
        {description && <Description text={description} />}
      </LabelWrap>
      <RangeContainer>
        <DefaultRange
          {...props}
          min={min}
          type={"range"}
          value={val}
          onChange={changeValue}
        />
        <RangeValue>{val}</RangeValue>
      </RangeContainer>
    </Wrap>
  );
};

Range.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  min: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    container: PropTypes.object,
    label: PropTypes.object,
    input: PropTypes.input
  })
};

export default Range;
