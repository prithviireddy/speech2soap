import {
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    FileText,
    Bot,
    Settings,

} from "lucide-react";


export const doctorNav = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        id: "dashboard",
        path: "/doctor/dashboard",
    },
    {
        icon: CalendarDays,
        label: "Appointments",
        id: "appointments",
        path: "/doctor/appointments",
    },
    {
        icon: Stethoscope,
        label: "Consultations",
        id: "consultations",
        path: "/doctor/consultations",
    },
    {
        icon: FileText,
        label: "Reports",
        id: "reports",
        path: "/doctor/reports",
    },

    // Optional
    {
        icon: Bot,
        label: "AI Assistant",
        id: "assistant",
        path: "/doctor/assistant",
    },

    // Future
    {
        icon: Settings,
        label: "Settings",
        id: "settings",
        path: "/doctor/settings",
    },
];
