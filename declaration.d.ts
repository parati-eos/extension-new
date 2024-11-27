// declaration.d.ts
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BACKEND_URL: string
    REACT_APP_ENV: string
  }
}
