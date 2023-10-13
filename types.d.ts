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

type UserDTO = {
  userId?: string
  firstName: string,
  lastName: string,
  email: string,
  mobileNumber: string,
  password: string,
  role: string,
  isActive: string | boolean,
}

type ResetPassword = {
  email: string,
  password: string,
}

type AllocateSite = {
  siteId: string,
  userEmail: string,
}

type DeallocateSite = {
  siteId: string,
  userEmail: string,
}

type SiteDTO = {
  siteId: string;
  siteName: string;
  location: string;
  startDate: string;
  contactNumber: string;
  allocatedBudget: string;
  siteManagerId: string;
  procurementManagerId: string;
}

type Pageable = {
  page: number,
  size: number,
  sort: [
    string
  ]
  totalPages: number
  totalElements: number
}