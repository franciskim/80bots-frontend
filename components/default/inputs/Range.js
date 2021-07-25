import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import { Wrap } from './Input'

// const thumbStyles = css`
//   appearance: none;
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background: hsl(200, 100%, 40%);
//   cursor: pointer;
//   transition: background 100ms ease-in-out;
// `;

const DefaultRange = styled.input`
  &[type='range'] {
    -webkit-appearance: none;
    border-radius: 5px;
    height: 5px;
    outline: none;
    cursor: pointer;
    width: 100%;
  }
`

const RangeValue = styled.span`
  display: inline-block;
  position: relative;
  width: 50px;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  padding: 5px 10px;
  margin-left: 12px;
  &:after {
    position: absolute;
    top: 8px;
    left: -7px;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    content: '';
  }
`

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

export const Range = ({
  // styles,
  // onChange,
  // min,
  // label,
  // value,
  // description,
  ...props
}) => {
  // const [val, setVal] = useState(value || min || 0)

  // useEffect(() => {
  //   onChange(val)
  // }, [])

  // useEffect(() => {
  //   if (value) setVal(value)
  // }, [value])

  // const changeValue = (e) => {
  //   onChange(Number(e.target.value))
  //   setVal(Number(e.target.value))
  // }

  return (
    // <Wrap styles={styles && styles.container}>
    //   <LabelWrap>
    //     {label && <Label styles={styles && styles.label}>{label}</Label>}
    //     {description && <Description text={description} />}
    //   </LabelWrap>
    <RangeContainer>
      <DefaultRange
        {...props}
        min={min}
        type={'range'}
        value={val}
        onChange={changeValue}
      />
      <RangeValue>{val}</RangeValue>
    </RangeContainer>
    // </Wrap>
  )
}

Range.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  min: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  // styles: PropTypes.shape({
  //   container: PropTypes.object,
  //   label: PropTypes.object,
  //   input: PropTypes.input,
  // }),
}

export default Range
