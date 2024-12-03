export type DecodedToken = {
  email: string
  picture: string
  name: string
}

export interface IpInfoResponse {
  country_name: string
  [key: string]: any
}
