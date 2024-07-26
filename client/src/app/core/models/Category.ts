import { Type } from "./Type";

export class Category {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public isDefault: boolean,
    public type: Type,
  ) {}
}
