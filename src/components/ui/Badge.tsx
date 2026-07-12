import { getStatusColor, getStatusLabel } from '@/lib/utils';

interface BadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export default function Badge({ status, label, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${getStatusColor(status)} ${className}`}>
      {label || getStatusLabel(status)}
    </span>
  );
}

export function CustomBadge({ children, variant = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  className?: string;
}) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
