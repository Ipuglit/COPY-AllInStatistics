import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export const navPublic  = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'My accounts',
    path: '/myaccounts',
    icon: icon('ic_accounts3'),
  },
  {
    title: 'My clubs',
    path: '/products',
    icon: icon('ic_club2'),
  },
  {
    title: 'My history',
    path: '/blog',
    icon: icon('ic_history'),
  },
  {
    title: 'My data',
    path: '/blog',
    icon: icon('ic_graph2'),
  },
];


export const navPrivate  = [
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic_user'),
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: icon('ic_user'),
  },
  
  {
    title: 'Applications',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Clubs',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'History',
    path: '/blog',
    icon: icon('ic_blog'),
  },
];

