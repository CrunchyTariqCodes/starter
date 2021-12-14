import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";


export default function NewReservation() {
    const history = useHistory();
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
    const submitHandler = async (event) => {
        event.preventDefault();
        const ac = new AbortController();
        try {
            formData.people = Number(formData.people);
            await createReservation(formData, ac.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
        } catch (error) {
            setError(error);
        }
    }
    
    return (
        <ReservationForm formData={formData} setFormData={setFormData} error={error} submitHandler={submitHandler} />
    );
}