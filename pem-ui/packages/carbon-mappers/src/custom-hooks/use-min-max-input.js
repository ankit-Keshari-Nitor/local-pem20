import { useState } from 'react';

const useMinMaxInput = () => {
  const [enteredValue, setEnteredValue] = useState('');
  const [inValid, setInvalid] = useState(false);
  const [invalidText, setInvalidText] = useState('');
  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
    valueIsValid(enteredValue, minValue, maxValue);
  };

  const minChangeHandler = (min) => {
    setMinValue(min);
    valueIsValid(enteredValue, min, maxValue);
  };

  const maxChangeHandler = (max) => {
    setMaxValue(max);
    valueIsValid(enteredValue, minValue, max);
  };

  function valueIsValid(value, min, max) {
    if (value.length > max || value.length < min) {
      if (value.length > max) {
        setInvalid(true);
        setInvalidText(`Input value must not be exceed ${max} characters!!`);
      }

      if (value.length < min) {
        setInvalid(true);
        setInvalidText(`Input value must not be less than ${min} characters!!`);
      }
    } else {
      setInvalid(false);
      setInvalidText('');
    }
  }

  return {
    value: enteredValue,
    isValid: inValid,
    invalidText: invalidText,
    valueChangeHandler,
    minChangeHandler,
    maxChangeHandler
  };
};

export default useMinMaxInput;
