import { UserData } from "../pages";

export const UserApi = (instance) => {
  return {
    getMe: async (): Promise<UserData> => {
      const { data } = await instance.get('/auth/me');
      return data;
    },
  }
}
