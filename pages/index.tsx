import { WelcomeStep } from "../components/steps/WelcomeStep";
import { EnterNameStep } from "../components/steps/EnterNameStep";
import { TwitterStep } from "../components/steps/TwitterStep";
import { ChooseAvatarStep } from "../components/steps/ChooseAvatarStep";
import { EnterPhoneStep } from "../components/steps/EnterPhoneStep";
import { EnterCodeStep } from "../components/steps/EnterCodeStep";
import { createContext, useCallback, useState } from "react";

const stepsComponents = {
  0: WelcomeStep,
  1: EnterNameStep,
  2: TwitterStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
}

interface IMainContext {
  onNextStep: () => void
  step: number
}

export const MainContext = createContext<IMainContext>({} as IMainContext)

export default function Home() {
  const [step, setStep] = useState<number>(0)
  const Step = stepsComponents[step]

  const onNextStep = useCallback(() => setStep((prev) => prev + 1), [setStep]);

  return (
    <div>
    <MainContext.Provider value={{ step, onNextStep }}>
      <Step />
    </MainContext.Provider>
    </div>
  )
}
