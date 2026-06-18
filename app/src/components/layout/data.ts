export const data = {
  user: {
    name: 'superadmin',
    email: 'superadmin@example.com',
    avatar: '/assets/avatar.png',
  },
  navMain: [
    {
      title: 'Home',
      url: '/home',
      icon: 'lucideBot',
      isActive: true,
    },
    {
      title: 'Data Sources',
      url: '/data-sources',
      icon: 'lucideDatabaseZap',
      isActive: true,
    },
    {
      title: 'Toolchain',
      url: '/agent',
      icon: 'lucideBot',
    },
    {
      title: 'Charts',
      url: '/agent-charts',
      icon: 'lucideChartLine',
    },
    {
      title: 'Content Management',
      icon: 'lucideFileText',
      items: [],
    },
    {
      title: 'User Management',
      url: '/user-management',
      icon: 'lucideUsers',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: 'lucideUsers',
        },
        {
          title: 'Roles',
          url: '/roles',
          icon: 'lucideShield',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '.',
      icon: 'lucideLifeBuoy',
    },
    {
      title: 'Feedback',
      url: '.',
      icon: 'lucideSend',
    },
  ],
};
