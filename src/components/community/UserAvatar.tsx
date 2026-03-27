import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChefHat } from 'lucide-react';

interface Props {
  url?: string;
  name: string;
  className?: string;
}

export function UserAvatar({ url, name, className = "w-10 h-10" }: Props) {
  const initials = name ? name.substring(0, 2).toUpperCase() : '??';

  return (
    <Avatar className={className}>
      <AvatarImage src={url} alt={name} />
      <AvatarFallback className="bg-[var(--color-brand)]/10 text-[var(--color-brand)] border border-[var(--color-brand)]/20 font-bold shadow-sm">
        {!url ? <ChefHat className="w-1/2 h-1/2" /> : initials}
      </AvatarFallback>
    </Avatar>
  );
}
