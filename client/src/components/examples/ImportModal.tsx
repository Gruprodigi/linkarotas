import { useState } from 'react';
import ImportModal from '../ImportModal';
import { Button } from '@/components/ui/button';

export default function ImportModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Abrir Modal de Importação</Button>
      <ImportModal 
        open={open} 
        onClose={() => setOpen(false)}
        onImport={(file) => console.log('File imported:', file.name)}
      />
    </div>
  );
}
