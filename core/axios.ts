import axios from 'axios'

// export enum ResponseStatus {
//   SUCCESS = 'success',
//   ERROR = 'error',
// }

// export enum StatusCode {
//   SUCCESS = 0,
//   ERROR = 1,
//   ERROR_VALID = 2,
// }

// export interface IResponse<D> {
//   status: ResponseStatus
//   data: D
//   statusCode: StatusCode
//   messages: Array<string>
// }

const API_URL = process.env.API_URL || '/api/v1.0/'

export const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export default instance
