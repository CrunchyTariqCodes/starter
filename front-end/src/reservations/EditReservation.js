import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [error, setError] = useState(null);
    const initalFormData = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
    };
    const [formData, setFormData] = useState({ ...initalFormData });
    useEffect(() => {
    const getReservation = async () => {
        const ac = new AbortController();
        try {
        const reservation = await listReservation(reservation_id, ac.signal);
        const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = reservation;
        setFormData({
            first_name,
            last_name,
            mobile_number,
            reservation_date,
            reservation_time,
            people
        })
        } catch (error) {
        setError(error);
        }
    }
    getReservation();
    }, [reservation_id])
    const submitHandler = async (event) => {
        event.preventDefault();
        const ac = new AbortController();
        try {
            formData.people = Number(formData.people);
            await updateReservation(reservation_id, formData, ac.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
        } catch (error) {
            setError(error);
        }
    }
    
    return (
        <ReservationForm formData={formData} setFormData={setFormData} error={error} submitHandler={submitHandler} />
    );
}