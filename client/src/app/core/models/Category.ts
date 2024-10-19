import { Type } from "./Type";

export class Category {
  constructor(
    public id: number,
    public name: string,
    public icon: string,
    public description: string,
    public isDefault: boolean,
    public type_id: number,
    public goals: any,
  ) {}
}
