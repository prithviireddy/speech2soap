import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card } from "../../shared";

export const AdminDashboard = () => {
  return (
   <DashboardLayout>
    <h1 className="
        text-5xl
        font-bold
        mb-12
    ">
        Welcome back, Reception
    </h1>

    <div className="
        grid
        md:grid-cols-3
        gap-8
    ">
        <Card>
        <p className="text-gray-500">
            Today's Appointments
        </p>

        <h2 className="
            text-5xl
            font-bold
            mt-3
        ">
            18
        </h2>
        </Card>

        <Card>
        <p className="text-gray-500">
            Checked In
        </p>

        <h2 className="
            text-5xl
            font-bold
            mt-3
        ">
            12
        </h2>
        </Card>

        <Card>
        <p className="text-gray-500">
            No Shows
        </p>

        <h2 className="
            text-5xl
            font-bold
            mt-3
        ">
            2
        </h2>
        </Card>
    </div>
    </DashboardLayout>
  );
};
