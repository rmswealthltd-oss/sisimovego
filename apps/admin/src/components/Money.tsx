import { formatMoney } from "../lib/money";

export function Money({ value }: { value: number }) {
  return <span>{formatMoney(value)}</span>;
}
