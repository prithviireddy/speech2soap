import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.appointment import Appointment
from src.schemas.doctor import (
    DoctorAppointmentDetails,
    DoctorAppointmentListItem,
)


class DoctorService:
    def __init__(self, db: Session):
        self.db = db

    def list_appointments(
        self,
        doctor_id: uuid.UUID,
    ) -> list[DoctorAppointmentListItem]:

        appointments = (
            self.db.execute(
                select(Appointment)
                .where(Appointment.doctor_id == doctor_id)
                .order_by(Appointment.scheduled_at)
            )
            .scalars()
            .all()
        )

        return [
            DoctorAppointmentListItem.model_validate(appointment)
            for appointment in appointments
        ]

    def get_appointment(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
    ) -> DoctorAppointmentDetails:

        appointment = self.db.get(
            Appointment,
            appointment_id,
        )

        if appointment is None:
            raise ValueError("Appointment not found.")

        if appointment.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to access this appointment.")

        return DoctorAppointmentDetails.model_validate(appointment)
