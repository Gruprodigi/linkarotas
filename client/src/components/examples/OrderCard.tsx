import OrderCard from '../OrderCard';

export default function OrderCardExample() {
  const mockOrder = {
    id: '1',
    orderNumber: 'IF-12345',
    customerName: 'João Silva',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    latitude: -23.550520,
    longitude: -46.633308,
    status: 'pending',
    groupId: null,
  };

  return (
    <OrderCard 
      order={mockOrder} 
      distance={2.5}
      selected={false}
      onSelectChange={(selected) => console.log('Selected:', selected)}
      sequenceNumber={1}
      onStatusChange={(orderId, status) => console.log('Status changed:', orderId, status)}
    />
  );
}
