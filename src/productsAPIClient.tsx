import axios from "axios";
import { Product } from "./Models/Product";

// API Client that will fetches prdoducts from the ProductsAPI
// This is the target of our Pact test
export class ProductsAPIClient {
  constructor(private url: string) {}

  async getAllProducts  (): Promise<Product[]>  {
    const response = await axios.request({
      baseURL: this.url,
      headers: { Accept: "application/json" },
      method: "GET",
      url: "/products",
    });

    // return the data from the response converted to an array of Products
    return response.data.map((product: any) => {
      return new Product(product.id, product.name);
    });
  };

  async  getProduct (id: string): Promise<Product>  {
    const response =  
    await axios.request({
      baseURL: this.url,
      headers: { Accept: "application/json" },
      method: "GET",
      url: `/products/${id}`,
    });

    // return the data from the response coverted to a Product
    return new Product(
      response.data.id,
      response.data.name
    );

  };
}
