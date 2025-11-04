/* eslint-disable @typescript-eslint/no-explicit-any */


export interface DynamicKeyObject {
  [key: string]: any;
}

export enum EUserRole {
  ADMIN = "Admin",
  CUSTOMER = "Customer",
}