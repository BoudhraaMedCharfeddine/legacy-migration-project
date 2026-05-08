export const USERS_SERVICE = 'USERS_SERVICE';
export const CATEGORIES_SERVICE = 'CATEGORIES_SERVICE';
export const PRODUCTS_SERVICE = 'PRODUCTS_SERVICE';
export const ORDERS_SERVICE = 'ORDERS_SERVICE';
export const PAYMENTS_SERVICE = 'PAYMENTS_SERVICE';

export const MSG = {
  USERS_FIND_ALL:       { cmd: 'users_find_all' },
  USERS_FIND_ONE:       { cmd: 'users_find_one' },
  USERS_CREATE:         { cmd: 'users_create' },
  USERS_UPDATE:         { cmd: 'users_update' },
  USERS_DELETE:         { cmd: 'users_delete' },

  CATEGORIES_FIND_ALL:  { cmd: 'categories_find_all' },
  CATEGORIES_FIND_ONE:  { cmd: 'categories_find_one' },
  CATEGORIES_CREATE:    { cmd: 'categories_create' },
  CATEGORIES_UPDATE:    { cmd: 'categories_update' },
  CATEGORIES_DELETE:    { cmd: 'categories_delete' },

  PRODUCTS_FIND_ALL:    { cmd: 'products_find_all' },
  PRODUCTS_FIND_ONE:    { cmd: 'products_find_one' },
  PRODUCTS_CREATE:      { cmd: 'products_create' },
  PRODUCTS_UPDATE:      { cmd: 'products_update' },
  PRODUCTS_DELETE:      { cmd: 'products_delete' },

  ORDERS_FIND_ALL:      { cmd: 'orders_find_all' },
  ORDERS_FIND_ONE:      { cmd: 'orders_find_one' },
  ORDERS_CREATE:        { cmd: 'orders_create' },
  ORDERS_UPDATE:        { cmd: 'orders_update' },
  ORDERS_DELETE:        { cmd: 'orders_delete' },

  PAYMENTS_FIND_ALL:    { cmd: 'payments_find_all' },
  PAYMENTS_FIND_ONE:    { cmd: 'payments_find_one' },
  PAYMENTS_CREATE:      { cmd: 'payments_create' },
  PAYMENTS_UPDATE:      { cmd: 'payments_update' },
  PAYMENTS_DELETE:      { cmd: 'payments_delete' },
} as const;

export const EVT = {
  PAYMENT_CREATED: 'payment.created',
} as const;

export const QUEUES = {
  USERS:      'users_queue',
  CATEGORIES: 'categories_queue',
  PRODUCTS:   'products_queue',
  ORDERS:     'orders_queue',
  PAYMENTS:   'payments_queue',
} as const;
