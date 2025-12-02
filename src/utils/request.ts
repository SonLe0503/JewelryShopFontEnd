import axios, { type AxiosRequestConfig } from "axios";


const instance = axios.create({
  baseURL: "https://shop.hijean.io.vn/api",
  headers: {
    "Content-Type": "application/json"
  }
})

export const request = async(config: AxiosRequestConfig) => {
  return instance({
    ...config,
  })
}