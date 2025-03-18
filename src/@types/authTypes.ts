export type DecodedToken = {
  email: string
  picture: string
  name: string
}

export interface IpInfoResponse {
  country: string
  [key: string]: any
}
