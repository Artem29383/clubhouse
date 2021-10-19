import { WelcomeStep } from "../components/steps/WelcomeStep";
import { EnterNameStep } from "../components/steps/EnterNameStep";
import { TwitterStep } from "../components/steps/GithubStep";
import { ChooseAvatarStep } from "../components/steps/ChooseAvatarStep";
import { EnterPhoneStep } from "../components/steps/EnterPhoneStep";
import { EnterCodeStep } from "../components/steps/EnterCodeStep";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { checkAuth } from "../helpers/checkAuth";
import { Axios } from "../core/axios";
import { wrapper } from "../redux/store";

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
  token?: string;
  fullName: string;
  id: string;
  avatarUrl: string;
  isActive: number;
  username: string;
  phone: string
}

const getFormStep = () => {
  const data = JSON.parse(localStorage.getItem('userData')) || {};
  if (data.id) {
    if (data.phone) {
      return 5;
    } else {
      return 4;
    }
  }
  return 0;
}

export default function Home() {
  const [userData, setUserData] = useState<User>(undefined)
  const [step, setStep] = useState<number>(0)
  const Step = stepsComponents[step]

  const onNextStep = useCallback(() => setStep((prev) => prev + 1), [setStep]);

  const setFieldValue = (field: keyof User, value: string) => {
    setUserData(prevState => ({ ...prevState, [field]: value }))
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    setStep(getFormStep());
    setUserData(JSON.parse(localStorage.getItem('userData')) || {});
  }, [])

  useEffect(() => {
    if (userData === undefined) return;
    localStorage.setItem('userData', userData ? JSON.stringify(userData) : JSON.stringify({}));
    Axios.defaults.headers.Authorization = `Bearer ${userData.token}`
  }, [userData]);

  return (
    <div>
      <MainContext.Provider value={{ step, onNextStep, userData, setUserData, setFieldValue }}>
        <Step />
      </MainContext.Provider>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  try {
    const user = await checkAuth(ctx, store);
    console.info('user', user)
    if (user) {
      return {
        props: {},
        redirect: {
          destination: '/rooms',
          permanent: false,
        },
      };
    }
  } catch (err) {}

  return { props: {} };
});
