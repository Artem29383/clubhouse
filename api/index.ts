import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import axios from "axios";
import { UserApi } from "./UserApi";
import { RoomApi } from "./RoomApi";

type ApiReturnType = ReturnType<typeof UserApi> & ReturnType<typeof RoomApi>;

export const Api = (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  // Axios.defaults.headers.Authorization = `Bearer ${cookies.token}`;
  const instance = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
      Authorization: 'Bearer ' + cookies.token,
    },
  });
  return [UserApi, RoomApi].reduce((prev, f) => ({ ...prev, ...f(instance) }), {} as ApiReturnType);
};
