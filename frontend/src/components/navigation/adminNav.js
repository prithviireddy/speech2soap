import {
    Home,
    Users,
    UserPlus,
    UsersRound,
    ClipboardPlus
} from "lucide-react";

export const adminNav = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
        path: "/admin/dashboard"
    },
    {
        id: "doctors",
        label: "Doctors",
        icon: Users,
        path: "/admin/doctors"
    },
    {
        id: "patients",
        label: "Patients",
        icon: UsersRound,
        path: "/admin/patients"
    },
    {
        id:"appointments",
        label: "Appointments",
        icon: ClipboardPlus,
        path: "/admin/appointments"
    }


];
