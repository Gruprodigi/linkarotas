import { useState } from "react";
import { Upload, X, FileSpreadsheet, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { InsertOrder } from "@shared/schema";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport?: (orders: InsertOrder[]) => void;
}

export default function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const parseCSV = async (file: File): Promise<InsertOrder[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('Arquivo vazio ou sem dados');
    }

    const orders: InsertOrder[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      if (values.length >= 3 && values[0] && values[1] && values[2]) {
        orders.push({
          orderNumber: values[0],
          customerName: values[1],
          address: values[2],
          latitude: values[3] ? parseFloat(values[3]) : undefined,
          longitude: values[4] ? parseFloat(values[4]) : undefined,
          status: values[5] || 'pending',
        });
      }
    }
    
    return orders;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const orders = await parseCSV(selectedFile);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        onImport?.(orders);
        onClose();
        setUploading(false);
        setProgress(0);
        setSelectedFile(null);
      }, 300);
    } catch (error) {
      setUploading(false);
      setProgress(0);
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Não foi possível processar o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-import">
        <DialogHeader>
          <DialogTitle>Importar Pedidos</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV ou Excel com os pedidos do iFood
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg min-h-40 flex flex-col items-center justify-center p-6 transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p className="text-sm font-medium mb-1">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-3"
                  onClick={() => setSelectedFile(null)}
                  data-testid="button-clear-file"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  ou clique para selecionar
                </p>
                <Button size="sm" variant="secondary" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer" data-testid="button-select-file">
                    Selecionar Arquivo
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Formatos aceitos:</p>
              <p>CSV, Excel (.xlsx, .xls)</p>
              <p className="mt-2">Colunas necessárias: Número do Pedido, Nome do Cliente, Endereço</p>
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} data-testid="progress-upload" />
              <p className="text-xs text-center text-muted-foreground">
                Importando... {progress}%
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={uploading}
              data-testid="button-cancel-import"
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              data-testid="button-confirm-import"
            >
              Importar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
