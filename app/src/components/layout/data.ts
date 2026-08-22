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
      title: 'Database Q&A',
      url: '/agent',
      icon: 'lucideBot',
    },
    {
      title: 'Model Test',
      url: '/model-test',
      icon: 'lucideCpu',
    },
    {
      title: 'Charts',
      url: '/agent-charts',
      icon: 'lucideChartLine',
    },
    {
      title: 'Logging',
      icon: 'lucideLogs',
      items: [
        {
          title: 'Q&A',
          url: '/logging/qa',
          icon: 'lucideFileText',
        },
        {
          title: 'Charts',
          url: '/logging/charts',
          icon: 'lucideChartLine',
        },
        {
          title: 'System',
          url: '/logging/system',
          icon: 'lucideCable',
        },
      ],
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
      title: 'Configurations',
      url: '/configurations',
      icon: 'lucideSettings',
    },
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
