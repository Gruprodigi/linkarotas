import AddOrderForm from '../AddOrderForm';

export default function AddOrderFormExample() {
  return (
    <div className="max-w-2xl">
      <AddOrderForm onAdd={(order) => console.log('Order added:', order)} />
    </div>
  );
}
