import MapView from '../MapView';

export default function MapViewExample() {
  const mockOrders = [
    {
      id: '1',
      orderNumber: 'IF-12345',
      customerName: 'João Silva',
      address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      latitude: -23.550520,
      longitude: -46.633308,
      status: 'pending',
      groupId: null,
    },
    {
      id: '2',
      orderNumber: 'IF-12346',
      customerName: 'Maria Santos',
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      latitude: -23.561414,
      longitude: -46.655882,
      status: 'pending',
      groupId: null,
    },
  ];

  return (
    <div className="h-96">
      <MapView orders={mockOrders} />
    </div>
  );
}
