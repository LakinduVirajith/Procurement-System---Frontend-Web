import { faUsersGear, faBuilding, faFileSignature, faBoxesPacking } from '@fortawesome/free-solid-svg-icons'

export const sideNavData: SideNav = [
    {
      menu: 'user',
      icon: faUsersGear,
      label: 'USER',
      access: 'ADMIN',
      submenu: [
        { label: 'CREATE USER', route: '/dashboard/user/create' },
        { label: 'USER DETAILS', route: '/dashboard/user/details' },
        { label: 'USER STATUS', route: '/dashboard/user/status' },
      ],
    },
    {
      menu: 'site',
      icon: faBuilding,
      label: 'SITE',
      access: 'ADMIN',
      submenu: [
        { label: 'SITE INFORMATIONS', route: '/dashboard/site/info' },
        { label: 'CREATE SITE', route: '/dashboard/site/create' },
        { label: 'UPDATE SITE', route: '/dashboard/site/update' },
      ],
    },
    {
      menu: 'item',
      icon: faBoxesPacking,
      label: 'ITEM',
      access: 'SITE_MANAGER',
      submenu: [
        { label: 'ITEM INFORMATIONS', route: '/dashboard/item/info' },
        { label: 'CREATE ITEM', route: '/dashboard/item/create' },
        { label: 'UPDATE ITEM', route: '/dashboard/item/update' },
      ],
    },
    {
      menu: 'procurement',
      icon: faFileSignature,
      label: 'PROCUREMENT',
      access: 'PROCUREMENT_MANAGER',
      submenu: [
        { label: 'ORDER APPROVAL', route: '/dashboard/procurement/approval' },
        { label: 'ASSIGN SUPPLIER', route: '/dashboard/procurement/supplier' },
      ],
    },
];
  