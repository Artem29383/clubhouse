import clsx from 'clsx';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';

import styles from './EnterNameStep.module.scss';
import React, { useContext } from 'react';
import { MainContext } from "../../../pages";

export const EnterNameStep = () => {
  const { onNextStep, userData: { fullName }, setFieldValue } = useContext(MainContext);
  const [inputValue, setInputValue] = React.useState(fullName);

  const nextDisabled = !inputValue;

  const handleChangeInput = (event) => {
    setInputValue(event.target.value);
  };

  const onClickNextStep = () => {
    setFieldValue('fullname', inputValue)
    onNextStep();
  };

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/man.png"
        title="What’s your full name?"
        description="People use real names on Clubhouse :) Thnx!"
      />
      <WhiteBlock className={clsx('m-auto', styles.whiteBlock)}>
        <div className="mb-30">
          <input
            onChange={handleChangeInput}
            value={inputValue}
            className="field"
            placeholder="Enter fullname"
          />
        </div>
        <Button disabled={nextDisabled} onClick={onClickNextStep}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};
