import { cn } from '@/shared/lib/cn';
import React from 'react';

interface FieldMessageProps {
  message?: string;
  className?: string;
  type?: 'error' | 'success' | 'warning';
}

const typeClassMap: Record<NonNullable<FieldMessageProps['type']>, string> = {
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
};

const FieldMessage: React.FC<FieldMessageProps> = ({
  message,
  className = '',
  type = 'error',
}) => {
  if (!message) return null;
  return (
    <span className={cn('text-xs', typeClassMap[type], className)}>
      {message}
    </span>
  );
};

export default FieldMessage;
