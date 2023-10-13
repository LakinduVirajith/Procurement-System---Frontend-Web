import { faUsersGear, faBuilding, faFileSignature } from '@fortawesome/free-solid-svg-icons'

export const sidebarData = [
    {
      menu: 'user',
      icon: faUsersGear,
      label: 'User',
      submenu: [
        { label: 'create user', route: '/dashboard/user/create' },
        { label: 'user details', route: '/dashboard/user/details' },
        { label: 'user status', route: '/dashboard/user/status' },
      ],
    },
    {
      menu: 'site',
      icon: faBuilding,
      label: 'Site',
      submenu: [
        { label: 'site informations', route: '/dashboard/site/info' },
        { label: 'create site', route: '/dashboard/site/create' },
        { label: 'update site', route: '/dashboard/site/update' },
      ],
    },
    {
      menu: 'procurement',
      icon: faFileSignature,
      label: 'Procurement',
      submenu: [
        { label: 'order approval', route: '/dashboard/procurement/approval' },
        { label: 'assign supplier', route: '/dashboard/procurement/supplier' },
      ],
    },
];
  