import {
    Home,
    Users,
    UserPlus,
    UsersRound
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
    }
];
