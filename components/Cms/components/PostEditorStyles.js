import styled from "@emotion/styled";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 10px 0;
`;

export const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  .btn {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  }
`;

export const ErrorsList = styled.div`
  width: 100%;
  text-align: left;
`;

export const Error = styled.div`
  font-size: 15px;
  color: ${props => props.theme.colors.darkishPink};
`;

export const selectStyles = {
  valueContainer: provided => ({
    ...provided,
    padding: "0 8px",
    borderColor: "#ced4da"
  })
};

export const FormGroup = styled.div`
  text-align: left;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const InlineInput = styled.div`
  display: flex;
  align-items: center;
  .label {
    margin-right: 5px;
    flex-shrink: 0;
  }
  .form-control {
    flex: 2;
  }
`;
