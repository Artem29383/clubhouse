import { WelcomeStep } from "../components/steps/WelcomeStep";
import { EnterNameStep } from "../components/steps/EnterNameStep";
import { TwitterStep } from "../components/steps/GithubStep";
import { ChooseAvatarStep } from "../components/steps/ChooseAvatarStep";
import { EnterPhoneStep } from "../components/steps/EnterPhoneStep";
import { EnterCodeStep } from "../components/steps/EnterCodeStep";
import React, { createContext, useCallback, useState } from "react";

const stepsComponents = {
  0: WelcomeStep,
  1: TwitterStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
}

export type UserData = {
  id: number;
  fullName: string;
  avatarUrl: string;
  isActive: number;
  username: string;
  phone: string;
  token?: string;
};

interface IMainContext {
  onNextStep: () => void
  setUserData: React.Dispatch<React.SetStateAction<User>>
  step: number
  userData: User;
  setFieldValue: (field: string, value: string) => void
}

export const MainContext = createContext<IMainContext>({} as IMainContext)

export type User = {
  fullName: string;
  id: string;
  avatarUrl: string;
  isActive: number;
  username: string;
  phone: string
}

export default function Home() {
  const [userData, setUserData] = useState<User>()
  const [step, setStep] = useState<number>(0)
  const Step = stepsComponents[step]

  const onNextStep = useCallback(() => setStep((prev) => prev + 1), [setStep]);

  const setFieldValue = (field: keyof User, value: string) => {
    setUserData(prevState => ({ ...prevState, [field]: value }))
  }

  return (
    <div>
      <MainContext.Provider value={{ step, onNextStep, userData, setUserData, setFieldValue }}>
        <Step />
      </MainContext.Provider>
    </div>
  )
}
