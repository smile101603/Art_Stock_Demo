import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, Wrench } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-center space-y-4 max-w-md">
        {/* Icon */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Wrench className="h-8 w-8 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 rounded-full bg-status-expiring/10 px-4 py-2 text-sm text-status-expiring">
          <Clock className="h-4 w-4" />
          En desarrollo
        </div>

        {/* Actions */}
        <div className="pt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
