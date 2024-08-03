/**
 * Transform type as string to type id, so @Input() can be a string, to be more readable
 */
export function getTypeIdFromString(type: string): number {
  switch (type) {
    case "expense":
      return 1;
    case "income":
      return 2;
    case "savings":
      return 3;
    default:
      return 0;
  }
}

/**
 * Get title for the graph from transaction type as string
 */
export function getTitleFromType(type: string): string {
  switch (type) {
    case "expense":
      return "Expenses by category";
    case "income":
      return "Incomes by category";
    case "savings":
      return "Savings by category";
    default:
      return "Huh";
  }
}

/**
 * Get class based on transaction type id
 *
 * @param type
 */
export function getClassBasedOnType(type: number): string {
  switch (type) {
    case 1:
      return "bg-red-100";
    case 2:
      return "bg-green-100";
    case 3:
      return "bg-blue-100";
    default:
      return "";
  }
}
