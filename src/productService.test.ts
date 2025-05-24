import { PactV4, MatchersV3 } from "@pact-foundation/pact";
import path from "path";
import { ProductsAPIClient } from "./productsAPIClient";
import { Product } from "./Models/Product";

const provider = () =>
  new PactV4({
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
    return provider()
      .addInteraction()
      .given("there is a non-empty list of products")
      .uponReceiving("a request for all products")
      .withRequest("GET", "/products", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder_) => {
        builder_.headers({ "Content-Type": "application/json" });
        builder_.jsonBody(MatchersV3.eachLike(productExample));
      })
      .executeTest(async (mockserver) => {
        // Act: test our API client behaves correctly
        //
        // Note we configure the ProductsAPI client dynamically to
        // point to the mock service Pact created for us, instead of
        // the real one
        productsAPIClient = new ProductsAPIClient(mockserver.url);
        const products = await productsAPIClient.getAllProducts();

        // Assert: check the result
        expect(products[0].id).toEqual(productExample.id);
        expect(products[0].name).toEqual(productExample.name);
      });
  });

  it("returns an HTTP 200 and a single product by id", () => {
    // Arrange: Setup our expected interactions
    //
    // We use Pact to mock out the backend API
    return provider()
      .addInteraction()
      .given("there is a product with id 1")
      .uponReceiving("a request for a product by id")
      .withRequest("GET", "/products/1", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder_) => {
        builder_.headers({ "Content-Type": "application/json" });
        builder_.jsonBody(MatchersV3.like(productExample));
      })
      .executeTest(async (mockserver) => {
        // Act: test our API client behaves correctly
        //
        // Note we configure the ProductsAPI client dynamically to
        // point to the mock service Pact created for us, instead of
        // the real one
        productsAPIClient = new ProductsAPIClient(mockserver.url);
        const product = await productsAPIClient.getProductById(1);

        // Assert: check the result
        expect(product.id).toEqual(productExample.id);
        expect(product.name).toEqual(productExample.name);
      });
  });

  it("retuns an HTTP 200 when a product is created", () => {
    // Arrange: Setup our expected interactions
    //
    // We use Pact to mock out the backend API
    return provider()
      .addInteraction()
      .given("the product can be created")
      .uponReceiving("a request to create a product")
      .withRequest("POST", "/products", (builder) => {
        builder.headers({ Accept: "application/json" });
        builder.jsonBody({ name: productExample.name });
      })
      .willRespondWith(200, (builder_) => {
        builder_.headers({ "Content-Type": "application/json" });
        builder_.jsonBody(MatchersV3.like(productExample));
      })
      .executeTest(async (mockserver) => {
        // Act: test our API client behaves correctly
        //
        // Note we configure the ProductsAPI client dynamically to
        // point to the mock service Pact created for us, instead of
        // the real one
        productsAPIClient = new ProductsAPIClient(mockserver.url);
        const product: Product = await productsAPIClient.createProduct({ name: productExample.name });

        // Assert: check the result
        expect(product.id).toBeGreaterThan(0);
        expect(product.name).toEqual(productExample.name);
      });
  }
  );
});
