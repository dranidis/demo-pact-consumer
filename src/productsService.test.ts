import { PactV4, MatchersV3 } from "@pact-foundation/pact";
import path from "path";
import { ProductsAPIClient } from "./productsAPIClient";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import { Product } from "./Models/Product";

const provider = () =>
  new PactV4({
    dir: path.resolve(process.cwd(), "./pacts"),
    consumer: "ProductsUI",
    provider: "ProductsAPI",
  });

const productExample = { id: 1, name: "Wireless Mouse" };

describe("ProductsAPI", () => {

  describe("GET /products", () => {

    it("returns an HTTP 200 and a list of products", () => {
      // Arrange: Setup our expected interactions
      //
      // We use Pact to mock out the backend API
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
          // Act: test our API client behaves correctly
          //
          // Note we configure the ProductsAPI client dynamically to
          // point to the mock service Pact created for us, instead of
          // the real one
          const productsAPIClient = new ProductsAPIClient(mockserver.url);
          const products = await productsAPIClient.getAllProducts();

          // Assert: check the result
          expect(products.length).toBe(1);
          expect(products[0].id).toBe(productExample.id);
          expect(products[0].name).toBe(productExample.name);
        });
    });
  });

});

