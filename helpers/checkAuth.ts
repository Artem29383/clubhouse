import { Api } from "../api";
import { UserData } from "../pages";
import { setUserData } from "../redux/slices/userSlice";

export const checkAuth = async (ctx: any, store: any): Promise<UserData | null> => {
  try {
    const user = await Api(ctx).getMe();
    store.dispatch(setUserData(user));
    return user;
  } catch (e) {
    return null;
  }
}
