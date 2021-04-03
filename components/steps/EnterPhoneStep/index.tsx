import React, { useContext } from 'react'
import clsx from 'clsx'
import { WhiteBlock } from '../../WhiteBlock'
import { Button } from '../../Button'
import { StepInfo } from '../../StepInfo'

import styles from './EnterPhoneStep.module.scss'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { MainContext } from "../../../pages";

type InputValueState = {
  format: string
  value: string
}

export const EnterPhoneStep = () => {
  const [values, setValues] = React.useState<InputValueState>({} as InputValueState)
  const { onNextStep } = useContext(MainContext);

  const nextDisabled = !values.value || values.value.length !== values.format.match(/[.]/g).length

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/phone.png"
        title="Enter your phone #"
        description="We will send you a confirmation code"
      />
      <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
        <div className={clsx('mb-30', styles.input)}>
          <img src="/static/belarus-flag.png" alt="flag" width={24} />
          <PhoneInput
            country={'by'}
            value={values.value}
            onChange={(value, country: { format: string }) => {
              setValues({ value, format: country.format })
            }}
            inputClass="field-phone_input"
            containerClass="field-phone"
            buttonClass="field-phone_button"
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true,
            }}
          />
        </div>
        <Button disabled={nextDisabled} onClick={onNextStep}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
        <p className={clsx(styles.policyText, 'mt-30')}>
          By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
        </p>
      </WhiteBlock>
    </div>
  )
}
