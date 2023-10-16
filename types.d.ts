type SideNav = {
  menu: string;
  icon: IconDefinition;
  label: string;
  access: string;
  submenu: {
        label: string;
        route: string;
  }[]
}[]

type AuthenticationRequest = {
  email: string;
  password: string;
}

type AuthenticationResponse = {
  statusCode: number;
  status: string;
  message: string;
  userRole?: string;
  accessToken?: string;
  refreshToken?: string;
}

type ResponseMessage = {
  statusCode: number;
  status: string;
  message: string;
  title:? string;
}

type UserDTO = {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: string;
  isActive: string | boolean;
}

type ResetPassword = {
  email: string;
  password: string;
}

type AllocateSite = {
  siteId: string;
  userEmail: string;
}

type DeallocateSite = {
  siteId: string;
  userEmail: string;
}

type SiteDTO = {
  siteId?: string;
  siteName: string;
  location: string;
  startDate: string;
  contactNumber: string;
  allocatedBudget: number;
  siteManagerId: string;
  procurementManagerId: string;
}

type ItemDTO = {
  itemId?: number;
  name: string;
  description: string;
  manufacturer: string;
  price: string;
  volumeType: string;
  weight: string;
  color: string;
}

type OrderDTO = {
  orderId: number;
  status: string;
  requiredDate: string;
  items: [
    {
      orderItemId: number;
      quantity: number;
      status: string;
      itemId: number;
      orderId: number;
    }
  ],
  supplierId: number;
  siteId: number;
}

type AssignSupplier = {
  orderId: string;
  supplierId: string;
}

type Pageable = {
  page: number;
  size: number;
  sort: [
    string
  ]
  totalPages: number;
  totalElements: number;
}
