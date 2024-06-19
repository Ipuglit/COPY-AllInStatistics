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
    title: 'Uplines',
    path: '/uplines',
    icon: icon('ic_user'),
  },
  {
    title: 'Applications',
    path: '/applications',
    icon: icon('ic_cart'),
  },
  {
    title: 'Clubs',
    path: '/clubs',
    icon: icon('ic_blog'),
  },
  {
    title: 'FX Rates',
    path: '/fxrates',
    icon: icon('ic_blog'),
  },
  {
    title: 'History',
    path: '/history',
    icon: icon('ic_blog'),
  },
];

