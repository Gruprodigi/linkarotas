import { MapPin, Navigation, ExternalLink, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Order } from "@shared/schema";

interface OrderCardProps {
  order: Order;
  distance?: number;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  sequenceNumber?: number;
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  in_route: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const statusLabels = {
  pending: "Pendente",
  in_route: "Em Rota",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function OrderCard({ order, distance, selected, onSelectChange, sequenceNumber, onStatusChange }: OrderCardProps) {
  const wazeUrl = order.latitude && order.longitude
    ? `https://waze.com/ul?ll=${order.latitude},${order.longitude}&navigate=yes`
    : `https://waze.com/ul?q=${encodeURIComponent(order.address)}`;

  const googleMapsUrl = order.latitude && order.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;

  const handleWazeClick = () => {
    window.open(wazeUrl, "_blank");
  };

  const handleMapsClick = () => {
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <Card className={`p-6 hover-elevate ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          {sequenceNumber !== undefined && (
            <div 
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0"
              data-testid={`sequence-number-${order.id}`}
            >
              {sequenceNumber}
            </div>
          )}
          {onSelectChange && (
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onSelectChange(!!checked)}
              data-testid={`checkbox-select-${order.id}`}
            />
          )}
          <div className="font-mono text-sm font-semibold text-foreground">
            #{order.orderNumber}
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={statusColors[order.status as keyof typeof statusColors] || statusColors.pending}
        >
          {statusLabels[order.status as keyof typeof statusLabels] || "Pendente"}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {order.customerName}
      </h3>

      <div className="flex items-start gap-2 mb-4">
        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground line-clamp-2">
          {order.address}
        </p>
      </div>

      {distance && (
        <div className="mb-4">
          <Badge variant="secondary" className="text-xs">
            {distance.toFixed(1)} km de distância
          </Badge>
        </div>
      )}

      {order.status === "pending" && onStatusChange && (
        <div className="mb-3">
          <Button 
            size="sm" 
            variant="secondary"
            className="w-full"
            onClick={() => onStatusChange(order.id, "in_route")}
            data-testid={`button-start-route-${order.id}`}
          >
            <Truck className="w-4 h-4 mr-2" />
            Iniciar Entrega
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="default" 
          className="flex-1"
          onClick={handleWazeClick}
          data-testid={`button-waze-${order.id}`}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Waze
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={handleMapsClick}
          data-testid={`button-maps-${order.id}`}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Maps
        </Button>
      </div>
    </Card>
  );
}
