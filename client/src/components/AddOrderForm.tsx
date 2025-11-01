import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InsertOrder } from "@shared/schema";

interface AddOrderFormProps {
  onAdd?: (order: Omit<InsertOrder, "id">) => void;
}

export default function AddOrderForm({ onAdd }: AddOrderFormProps) {
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !customerName || !address) {
      return;
    }

    onAdd?.({
      orderNumber,
      customerName,
      address,
      latitude: null,
      longitude: null,
      status: "pending",
      groupId: null,
    });

    setOrderNumber("");
    setCustomerName("");
    setAddress("");
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Adicionar Pedido Manual</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Número do Pedido</Label>
            <Input
              id="orderNumber"
              placeholder="IF-12345"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              data-testid="input-order-number"
              className="font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerName">Nome do Cliente</Label>
            <Input
              id="customerName"
              placeholder="João Silva"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              data-testid="input-customer-name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço Completo</Label>
          <Textarea
            id="address"
            placeholder="Rua das Flores, 123 - Centro, São Paulo - SP, 01234-567"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="resize-none"
            rows={3}
            data-testid="input-address"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          data-testid="button-add-order"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pedido
        </Button>
      </form>
    </Card>
  );
}
