export function toKES(amountCents: number) {
  return `KES ${(amountCents / 100).toFixed(2)}`;
}

export function formatMoney(amount: number, currency = "KES") {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2
  })}`;
}
