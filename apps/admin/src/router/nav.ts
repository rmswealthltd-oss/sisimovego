export const nav = [
  { label: "Dashboard", to: "/" },

  { label: "Trips", to: "/trips" },
  { label: "Drivers", to: "/drivers" },

  { label: "Refunds", to: "/refunds" },

  {
    label: "Payouts",
    children: [
      { label: "Payout List", to: "/payouts" },
      { label: "Batch Payouts", to: "/payouts/batches" },
    ],
  },

  { label: "Reconciliation", to: "/reconciliation" },

  {
    label: "Fraud",
    children: [
      { label: "Dashboard", to: "/fraud" },
      { label: "Rules", to: "/fraud/rules" },
      { label: "Cases", to: "/fraud/cases" },
    ],
  },

  {
    label: "System",
    children: [
      { label: "DLQ", to: "/system/dlq" },
      { label: "Outbox", to: "/system/outbox" },
      { label: "Health", to: "/system/health" },
      { label: "Config", to: "/system/config" },
    ],
  },

  {
    label: "Users",
    to: "/users",
  },
];
