import { useState } from "react";
import { Download, FileText, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport?: (options: ExportOptions) => void;
  orderCount?: number;
}

interface ExportOptions {
  includeMapLinks: boolean;
  includeWazeLinks: boolean;
  includeStatus: boolean;
}

export default function ExportModal({ open, onClose, onExport, orderCount = 0 }: ExportModalProps) {
  const [options, setOptions] = useState<ExportOptions>({
    includeMapLinks: true,
    includeWazeLinks: true,
    includeStatus: true,
  });

  const handleExport = () => {
    onExport?.(options);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-export">
        <DialogHeader>
          <DialogTitle>Copiar Pedidos</DialogTitle>
          <DialogDescription>
            Escolha as informações para incluir no texto copiado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">

          <div className="space-y-3">
            <Label>Incluir nas Colunas</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mapLinks"
                  checked={options.includeMapLinks}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeMapLinks: !!checked })
                  }
                  data-testid="checkbox-map-links"
                />
                <Label htmlFor="mapLinks" className="font-normal cursor-pointer">
                  Links do Google Maps
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wazeLinks"
                  checked={options.includeWazeLinks}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeWazeLinks: !!checked })
                  }
                  data-testid="checkbox-waze-links"
                />
                <Label htmlFor="wazeLinks" className="font-normal cursor-pointer">
                  Links do Waze
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={options.includeStatus}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeStatus: !!checked })
                  }
                  data-testid="checkbox-status"
                />
                <Label htmlFor="status" className="font-normal cursor-pointer">
                  Status do Pedido
                </Label>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {orderCount} {orderCount === 1 ? 'pedido será exportado' : 'pedidos serão exportados'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel-export"
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleExport}
              data-testid="button-confirm-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Copiar Texto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
