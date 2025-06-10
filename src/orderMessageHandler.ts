// orderMessageHandler.ts
export type OrderMessage = {
  orderId: number;
  date: string;
};

export function handleOrderMessage(message: OrderMessage): void {
  // This is where your consumer logic would go
  console.log(`Order received: ID=${message.orderId}, Date=${message.date}`);
}
