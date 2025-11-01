import { useState } from "react";
import { Upload, Plus, Filter, List, Map, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ThemeToggle from "@/components/ThemeToggle";
import OrderCard from "@/components/OrderCard";
import MapView from "@/components/MapView";
import RouteSummary from "@/components/RouteSummary";
import ImportModal from "@/components/ImportModal";
import ExportModal from "@/components/ExportModal";
import AddOrderForm from "@/components/AddOrderForm";
import type { Order, InsertOrder } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Pedido adicionado!",
        description: "O pedido foi adicionado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar pedido",
        description: "Não foi possível adicionar o pedido. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const bulkCreateOrdersMutation = useMutation({
    mutationFn: async (ordersData: InsertOrder[]) => {
      const res = await apiRequest("POST", "/api/orders/bulk", ordersData);
      return await res.json();
    },
    onSuccess: (data: Order[]) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Pedidos importados!",
        description: `${data.length} ${data.length === 1 ? 'pedido foi importado' : 'pedidos foram importados'} com sucesso.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao importar pedidos",
        description: "Não foi possível importar os pedidos. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Status atualizado!",
        description: "O pedido foi marcado como Em Rota.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleAddOrder = (orderData: InsertOrder) => {
    createOrderMutation.mutate(orderData);
    setShowAddForm(false);
  };

  const handleImport = (importedOrders: InsertOrder[]) => {
    bulkCreateOrdersMutation.mutate(importedOrders);
    setImportModalOpen(false);
  };

  const handleExport = async (options: any) => {
    const ordersToExport = selectedOrders.size > 0 
      ? orders.filter(order => selectedOrders.has(order.id))
      : orders;

    let textContent = "=== PEDIDOS DO IFOOD - ROTEIRO DE ENTREGA ===\n\n";
    
    if (selectedOrders.size > 0) {
      textContent += `AGRUPAMENTO DE ${selectedOrders.size} PEDIDOS SELECIONADOS\n\n`;
    }
    
    ordersToExport.forEach((order, index) => {
      textContent += `${index + 1}. PEDIDO #${order.orderNumber}\n`;
      textContent += `   Cliente: ${order.customerName}\n`;
      textContent += `   Endereço: ${order.address}\n`;
      
      if (options.includeStatus) {
        const statusText = {
          pending: "Pendente",
          in_route: "Em Rota",
          delivered: "Entregue",
          cancelled: "Cancelado",
        }[order.status] || "Pendente";
        textContent += `   Status: ${statusText}\n`;
      }
      
      if (options.includeWazeLinks) {
        const wazeUrl = order.latitude && order.longitude
          ? `https://waze.com/ul?ll=${order.latitude},${order.longitude}&navigate=yes`
          : `https://waze.com/ul?q=${encodeURIComponent(order.address)}`;
        textContent += `   Waze: ${wazeUrl}\n`;
      }
      
      if (options.includeMapLinks) {
        const mapsUrl = order.latitude && order.longitude
          ? `https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`
          : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;
        textContent += `   Google Maps: ${mapsUrl}\n`;
      }
      
      textContent += "\n";
    });
    
    textContent += `\nTotal de entregas: ${ordersToExport.length}\n`;
    textContent += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n`;

    try {
      await navigator.clipboard.writeText(textContent);
      toast({
        title: "Texto copiado!",
        description: `${ordersToExport.length} ${ordersToExport.length === 1 ? 'pedido copiado' : 'pedidos copiados'} para a área de transferência.`,
      });
      console.log('Copied', ordersToExport.length, 'orders to clipboard');
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto. Tente novamente.",
        variant: "destructive",
      });
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSelectOrder = (orderId: string, selected: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (selected) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const totalDistance = orders.length * 3.2;
  const estimatedTime = Math.ceil(totalDistance * 2.5);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Map className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">iFood Rotas</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="hidden md:flex"
              data-testid="button-import"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setImportModalOpen(true)}
              className="md:hidden"
              data-testid="button-import-mobile"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Pedidos</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedOrders.size > 0 
                    ? `${selectedOrders.size} pedido(s) selecionado(s) para agrupamento`
                    : "Gerencie e organize suas entregas"
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {orders.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    data-testid="button-select-all"
                  >
                    {selectedOrders.size === orders.length ? "Desmarcar Todos" : "Marcar Todos"}
                  </Button>
                )}
                <Button
                  variant={showAddForm ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex-1 sm:flex-none"
                  data-testid="button-toggle-add-form"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Pedido
                </Button>
              </div>
            </div>

            {showAddForm && (
              <AddOrderForm onAdd={handleAddOrder} />
            )}

            <div className="lg:hidden">
              <Tabs value={view} onValueChange={(v) => setView(v as "list" | "map")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list" data-testid="tab-list">
                    <List className="w-4 h-4 mr-2" />
                    Lista
                  </TabsTrigger>
                  <TabsTrigger value="map" data-testid="tab-map">
                    <Map className="w-4 h-4 mr-2" />
                    Mapa
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="space-y-4 mt-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                      <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Nenhum pedido cadastrado
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(true)}
                        data-testid="button-add-first-order"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeiro Pedido
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((order, idx) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          distance={2.5 + idx * 0.8}
                          selected={selectedOrders.has(order.id)}
                          onSelectChange={(selected) => handleSelectOrder(order.id, selected)}
                          sequenceNumber={idx + 1}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="map" className="mt-6">
                  <div className="h-96">
                    <MapView orders={orders} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="hidden lg:block">
              {orders.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <List className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">Nenhum pedido cadastrado</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comece importando um arquivo ou adicione manualmente
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setImportModalOpen(true)}
                      data-testid="button-import-empty"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar
                    </Button>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      data-testid="button-add-empty"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order, idx) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      distance={2.5 + idx * 0.8}
                      selected={selectedOrders.has(order.id)}
                      onSelectChange={(selected) => handleSelectOrder(order.id, selected)}
                      sequenceNumber={idx + 1}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <RouteSummary
              totalOrders={orders.length}
              totalDistance={totalDistance}
              estimatedTime={estimatedTime}
              selectedCount={selectedOrders.size}
              onExport={() => setExportModalOpen(true)}
            />

            <div className="hidden lg:block">
              <div className="h-96">
                <MapView orders={orders} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        orderCount={orders.length}
      />
    </div>
  );
}
