import {
  LayoutDashboard,
  FileText,
  Bot,
  Settings,
} from "lucide-react";

export const patientNav = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/patient/dashboard",
  },
  {
    icon: FileText,
    label: "Reports",
    id: "reports",
    path: "/patient/reports",
  },
  {
    icon: Bot,
    label: "AI Assistant",
    id: "assistant",
    path: "/patient/assistant",
  },
  {
    icon: Settings,
    label: "Settings",
    id: "settings",
    path: "/patient/settings",
  },
];
