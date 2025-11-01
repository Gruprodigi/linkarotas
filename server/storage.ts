import { type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
  bulkCreateOrders(orders: InsertOrder[]): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private orders: Map<string, Order>;

  constructor() {
    this.orders = new Map();
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      latitude: insertOrder.latitude ?? null,
      longitude: insertOrder.longitude ?? null,
      status: insertOrder.status ?? "pending",
      groupId: insertOrder.groupId ?? null,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }

  async bulkCreateOrders(insertOrders: InsertOrder[]): Promise<Order[]> {
    const createdOrders: Order[] = [];
    for (const insertOrder of insertOrders) {
      const order = await this.createOrder(insertOrder);
      createdOrders.push(order);
    }
    return createdOrders;
  }
}

export const storage = new MemStorage();
