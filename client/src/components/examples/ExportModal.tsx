import { useState } from 'react';
import ExportModal from '../ExportModal';
import { Button } from '@/components/ui/button';

export default function ExportModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Abrir Modal de Exportação</Button>
      <ExportModal 
        open={open} 
        onClose={() => setOpen(false)}
        onExport={(options) => console.log('Export:', options)}
        orderCount={5}
      />
    </div>
  );
}
