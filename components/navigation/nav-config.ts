import { Home, LucideProps, Users } from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

export type NavItemIcon = NavItem & {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

export interface NavConfig {
  appNavigation: NavItemIcon[];
}

export const navConfig: NavConfig = {
  appNavigation: [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Artists",
      href: "/artists",
      icon: Users,
    },
  ],
};
