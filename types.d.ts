type AuthenticationRequest = {
    email: string,
    password: string
}

type AuthenticationResponse = {
  statusCode: number
  status: string,
  message: string
  userRole: string,
  accessToken: string,
  refreshToken: string
}
