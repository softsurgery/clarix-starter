export type SidebarNavItem = {
  id: string;
  href?: string;
  title: string;
  icon?: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  disabled?: boolean;
  external?: boolean;
  description?: string;
};

export type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};
