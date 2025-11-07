import { PactV4, MatchersV3 } from "@pact-foundation/pact";
import path from "path";
import { ProductsAPIClient } from "./productsAPIClient";

const provider = () =>
  new PactV4({
    dir: path.resolve(process.cwd(), "./pacts"),
    consumer: "ProductsUI",
    provider: "ProductsAPI",
  });


describe("ProductsAPI", () => {
  describe("GET /products", () => {
    it("returns an HTTP 200 and a list of products", () => {
      const productExample = { id: 1, name: "Wireless Mouse" };
      return provider()
        .addInteraction()
        .given("there are many products")
        .uponReceiving("a request for all products")
        .withRequest("GET", "/products", (builder) => {
          builder.headers({ Accept: "application/json" });
        })
        .willRespondWith(200, (builder) => {
          builder.headers({ "Content-Type": "application/json" });
          builder.jsonBody(MatchersV3.eachLike(productExample));
        })
        .executeTest(async (mockserver) => {
          // We configure the ProductsAPI client dynamically to
          // point to the mock service Pact created for us, instead of the real one
          const productsAPIClient = new ProductsAPIClient(mockserver.url);
          // Act: fetch the products from the mock server
          const products = await productsAPIClient.getAllProducts();
          // Assert: check the result
          expect(products.length).toBe(1);
          expect(products[0].id).toBe(productExample.id);
          expect(products[0].name).toBe(productExample.name);
        });
    });
  });
});

