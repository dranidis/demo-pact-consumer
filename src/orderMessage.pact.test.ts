import path from "path";
import { MessageConsumerPact, MatchersV3 } from "@pact-foundation/pact";
import { handleOrderMessage, OrderMessage } from "./orderMessageHandler";
import { like } from "@pact-foundation/pact/src/dsl/matchers";

describe("Order Message Consumer Pact", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "ProductsUI-messages",
    provider: "Products-message-provider",
    dir: path.resolve(process.cwd(), "pacts"),
  });

  it("can handle an order message", async () => {
    await messagePact
      .given("an order is sent")
      .expectsToReceive("an order message")
      .withContent({
        orderId: like(1),
        date: like("2025-06-07T12:00:00Z"),
        premium: false
      })
      // .withMetadata({
      //   // "content-type": "application/json",
      // })
      .verify(async (message) => {
        // Parse message and call handler
        const parsedMessage = message.contents as OrderMessage;
        handleOrderMessage(parsedMessage);
      });
  });

  it("can handle a premium order message", async () => {
    await messagePact
      .given("a premium order is sent")
      .expectsToReceive("an order message")
      .withContent({
        orderId: like(1),
        date: like("2025-06-07T12:00:00Z"),
        premium: true
      })
      // .withMetadata({
      //   // "content-type": "application/json",
      // })
      .verify(async (message) => {
        // Parse message and call handler
        const parsedMessage = message.contents as OrderMessage;
        handleOrderMessage(parsedMessage);
      });
  });
});
