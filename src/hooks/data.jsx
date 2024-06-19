import { Icon } from '@iconify/react';

export const BY_STATUS = [
  { id: 1, idd: 1, value: 'ACTIVE', label: 'Active', others: "", what: "STATUS" },
  { id: 2, idd: 2, value: 'PENDING', label: 'Pending', others: "", what: "STATUS" },
  { id: 3, idd: 3, value: 'ACTIVEPENDING', label: 'Active & Pending', others: "", what: "STATUS" },
  { id: 4, idd: 4, value: 'DISABLED', label: 'Disabled', others: "", what: "STATUS" },
];

export const BY_ORDER = [
  { id: 0, value: 'ASC', label: <Icon icon="bxs:up-arrow"/> },
  { id: 1, value: 'DESC', label: <Icon icon="bxs:down-arrow"/> },
];

// ====================== +++ ITEMS +++ ====================================

export const BY_ACCOUNTS = [
  { id: 0,idd: 0, value: 'NONE', label: 'ID', others: "", what: "ACCOUNTS" },
  { id: 1,idd: 1, value: 'app.name', label: 'Application', others: "", what: "ACCOUNTS" },
  { id: 2,idd: 2, value: 'a.accountID', label: 'Account ID', others: "", what: "ACCOUNTS" },
  { id: 3,idd: 3, value: 'a.accountNickname', label: 'Nickname', others: "", what: "ACCOUNTS" },
  { id: 4,idd: 4, value: 'a.accountRole', label: 'Role', others: "", what: "ACCOUNTS" },
  { id: 5,idd: 5, value: 'a.status', label: 'Status', others: "", what: "ACCOUNTS" },
];