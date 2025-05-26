export class Product {
  constructor(public id: number, public name: string) {
    if (typeof id !== "number" || typeof name !== "string") {
      throw new Error("Invalid product data");
    }
  }
}
