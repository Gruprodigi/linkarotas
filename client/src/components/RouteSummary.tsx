import { Package, MapPin, Clock, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RouteSummaryProps {
  totalOrders: number;
  totalDistance: number;
  estimatedTime: number;
  selectedCount?: number;
  onExport?: () => void;
}

export default function RouteSummary({
  totalOrders,
  totalDistance,
  estimatedTime,
  selectedCount = 0,
  onExport,
}: RouteSummaryProps) {
  return (
    <Card className="p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Resumo da Rota</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Pedidos</p>
            <p className="text-xl font-semibold" data-testid="text-total-orders">
              {totalOrders}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distância Total</p>
            <p className="text-xl font-semibold" data-testid="text-total-distance">
              {totalDistance.toFixed(1)} km
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tempo Estimado</p>
            <p className="text-xl font-semibold" data-testid="text-estimated-time">
              {estimatedTime} min
            </p>
          </div>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={onExport}
        data-testid="button-export-route"
      >
        <Download className="w-4 h-4 mr-2" />
        {selectedCount > 0 
          ? `Copiar Agrupamento (${selectedCount})`
          : "Copiar Todos"
        }
      </Button>
    </Card>
  );
}
