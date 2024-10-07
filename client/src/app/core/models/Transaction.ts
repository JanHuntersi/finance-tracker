import {Category} from "./Category";

export class Transaction {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public type_id: number,
    public amount: number,
    public date: string,
    public category: Category | undefined,
    public category_id: number,
  ) {}
}
