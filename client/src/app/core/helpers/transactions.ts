import {Transaction} from "../models/Transaction";

/**
 * Categorizes data by 'type_id'
 *
 * @param { any } data
 */
export function categorizeBudgetByType(data: any): any {
  const expenses = data.filter((expense: any) => expense.type_id === 1);
  const incomes = data.filter((income: any) => income.type_id === 2);
  const savings = data.filter((savings: any) => savings.type_id === 3);

  return { expenses, incomes, savings };
}

export function getCategoriesByType(
  typeId: number,
  expenses: Array<Transaction>,
  incomes: Array<Transaction>,
  savings: Array<Transaction>
): any {
  let typedCategories: Array<number> = [];

  if (typeId === 1) {
    typedCategories = expenses.map((expense: Transaction) => expense.category_id);
  } else if (typeId === 2) {
    typedCategories = incomes.map((income: Transaction) => income.category_id);
  } else  {
    typedCategories = savings.map((saving: Transaction) => saving.category_id);
  }

  return typedCategories;
}
