import RouteSummary from '../RouteSummary';

export default function RouteSummaryExample() {
  return (
    <div className="max-w-sm">
      <RouteSummary
        totalOrders={12}
        totalDistance={24.5}
        estimatedTime={65}
        onExport={() => console.log('Export route')}
      />
    </div>
  );
}
