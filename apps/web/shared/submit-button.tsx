'use client';

import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, pendingText, secondary = false, fullWidth = false }: {
  children: ReactNode;
  pendingText: string;
  secondary?: boolean;
  fullWidth?: boolean;
}) {
  const { pending } = useFormStatus();
  const variant = secondary ? 'control-secondary' : 'control-primary';

  return (
    <button
      type="submit"
      className={`control ${variant} ${fullWidth ? 'w-full' : ''}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending && <LoaderCircle size={17} className="motion-safe:animate-spin" aria-hidden="true" />}
      {pending ? pendingText : children}
    </button>
  );
}
