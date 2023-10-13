type AuthenticationRequest = {
    email: string,
    password: string
}

type AuthenticationResponse = {
  statusCode: number
  status: string,
  message: string
  userRole?: string,
  accessToken?: string,
  refreshToken?: string
}

type ResponseMessage = {
  statusCode: number,
  status: string,
  message: string,
  title:? string,
}

type userDTO = {
  firstName: string,
  lastName: string,
  email: string,
  mobileNumber: string,
  password: string,
  role: string,
  isActive: string,
}

type resetPassword = {
  email: string,
  password: string,
}

type allocateSite = {
  siteId: string,
  userEmail: string,
}

type deallocateSite = {
  siteId: string,
  userEmail: string,
}