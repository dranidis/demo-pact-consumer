import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import path from "path";
import { ProductsAPIClient } from "./productsAPIClient";

const provider = new PactV3({
  dir: path.resolve(process.cwd(), "./pacts"),
  consumer: "ProductsUI",
  provider: "ProductsAPI",
});

const productExample = { id: 1, name: "Wireless Mouse" };

describe("GET /products", () => {
  let productsAPIClient: ProductsAPIClient;

  it("returns an HTTP 200 and a list of products", () => {
    // Arrange: Setup our expected interactions
    //
    // We use Pact to mock out the backend API
    provider
      .given("there is a non-empty list of products")
      .uponReceiving("a request for all products")
      .withRequest({
        method: "GET",
        path: "/products",
        headers: { Accept: "application/json" },
      })
      .willRespondWith({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: MatchersV3.eachLike(productExample),
      });

    return provider.executeTest(async (mockserver) => {
      // Act: test our API client behaves correctly
      //
      // Note we configure the ProductsAPI client dynamically to
      // point to the mock service Pact created for us, instead of
      // the real one
      productsAPIClient = new ProductsAPIClient(mockserver.url);
      const products = await productsAPIClient.getAllProducts();

      // Assert: check the result
      expect(products[0].id).toEqual(productExample.id);
      expect(products[0].name).toEqual(productExample.name);    });
  });

  it("returns an HTTP 200 and a single product", () => {
    // Arrange: Setup our expected interactions
    //
    // We use Pact to mock out the backend API
    provider
      .given("there exists a product with id 12345")
      .uponReceiving("a request for a product with id 12345")
      .withRequest({
        method: "GET",
        path: "/products/12345",
        headers: { Accept: "application/json" },
      })
      .willRespondWith({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: MatchersV3.like(productExample),
      });

    return provider.executeTest(async (mockserver) => {
      // Act: test our API client behaves correctly
      //
      // Note we configure the ProductsAPI client dynamically to
      // point to the mock service Pact created for us, instead of
      // the real one
      productsAPIClient = new ProductsAPIClient(mockserver.url);
      const product = await productsAPIClient.getProduct("12345");

      // Assert: check the result
      expect(product.id).toEqual(productExample.id);
      expect(product.name).toEqual(productExample.name);
    });
  });
});
