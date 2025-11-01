import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import type { Order } from "@shared/schema";

interface MapViewProps {
  orders: Order[];
  selectedOrder?: string | null;
}

export default function MapView({ orders, selectedOrder }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined' || !(window as any).L) return;

    if (!mapInstanceRef.current) {
      const map = (window as any).L.map(mapRef.current).setView([-23.550520, -46.633308], 12);
      
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const validOrders = orders.filter(order => order.latitude && order.longitude);

    if (validOrders.length > 0) {
      const bounds: any[] = [];

      validOrders.forEach((order, index) => {
        const customIcon = (window as any).L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 32px;
            height: 32px;
            background: ${order.id === selectedOrder ? '#16a34a' : '#ea580c'};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">${index + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = (window as any).L.marker([order.latitude, order.longitude], { icon: customIcon })
          .bindPopup(`
            <div style="font-family: Inter, sans-serif;">
              <strong style="font-size: 14px;">${order.customerName}</strong><br/>
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #666;">#${order.orderNumber}</span><br/>
              <span style="font-size: 12px; color: #666;">${order.address}</span>
            </div>
          `)
          .addTo(mapInstanceRef.current);

        markersRef.current.push(marker);
        bounds.push([order.latitude, order.longitude]);
      });

      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [orders, selectedOrder]);

  const hasValidOrders = orders.some(order => order.latitude && order.longitude);

  return (
    <div className="h-full min-h-96 rounded-lg overflow-hidden border border-border relative">
      {!hasValidOrders && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum pedido com coordenadas disponível
            </p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-96" data-testid="map-view" />
    </div>
  );
}
