export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Powersales-tareas",
  description: "Prueba técnica de PowerSales.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Tareas",
      href: "/task",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
  },
};
