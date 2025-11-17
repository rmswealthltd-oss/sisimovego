export const urls = {
  home: "/",

  login: "/login",

  trips: {
    list: "/trips",
    view: (id: string) => `/trips/${id}`,
  },

  drivers: {
    list: "/drivers",
    profile: (id: string) => `/drivers/${id}`,
  },

  refunds: {
    list: "/refunds",
    view: (id: string) => `/refunds/${id}`,
  },

  payouts: {
    list: "/payouts",
    batches: "/payouts/batches",
    batchView: (batchId: string) => `/payouts/batches/${batchId}`,
  },

  reconciliation: {
    dashboard: "/reconciliation",
  },

  fraud: {
    dashboard: "/fraud",
    rules: "/fraud/rules",
    rule: (id: string) => `/fraud/rules/${id}`,
    cases: "/fraud/cases",
    case: (id: string) => `/fraud/cases/${id}`,
  },

  system: {
    dlq: "/system/dlq",
    outbox: "/system/outbox",
    health: "/system/health",
    config: "/system/config",
  },

  users: {
    list: "/users",
    view: (id: string) => `/users/${id}`,
    trips: (id: string) => `/users/${id}/trips`,
  },
};
