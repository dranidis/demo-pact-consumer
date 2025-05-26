import axios from "axios";
import { Product } from "./Models/Product";

// API Client that fetches products from the ProductsAPI
// This is the target of our Pact test
export class ProductsAPIClient {

  // The constructor takes a URL to the API so that we can change it
  // to the mock server URL used by Pact when we run the pact consumer tests
  constructor(private url: string) { }

  async getAllProducts(): Promise<Product[]> {
    const response = await axios.request({
      baseURL: this.url,
      headers: { Accept: "application/json" },
      method: "GET",
      url: "/products",
    });

    // return the data from the response converted to an array of Products
    return response.data.map((jsonResponse: any) => {
      return new Product(jsonResponse.id, jsonResponse.name);
    });
  }

}
