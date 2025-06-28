import { sequelize } from "../model";
import { Transaction } from "sequelize";

export async function runWithTransaction<T>(
  fn: (transaction: Transaction) => Promise<T>,
  externalTransaction?: Transaction
): Promise<T> {
  if (externalTransaction) {
    return fn(externalTransaction);
  }
  return sequelize.transaction(async (newTransaction) => {
    return fn(newTransaction);
  });
}
