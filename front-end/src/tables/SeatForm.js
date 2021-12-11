import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useHistory } from "react-router";
import { listTables, changeReservationStatus, seatReservation } from "../utils/api";
import TablesDropDown from "./TablesDropDown";
import ErrorAlert from '../layout/ErrorAlert';

export default function SeatForm() {
    const history = useHistory();
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const [tableId, setTableId] = useState('');
    const { reservation_id } = useParams();
    
    useEffect(() => {
        const ac = new AbortController();
        const getTables = async () => {
            try {
                const tables = await listTables(ac.signal);
                setTables(tables)
            } catch (error) {
                setError(error)
            }
        }
        getTables();
    }, [])
    
    const cancelHandler = () => {
        history.goBack();
    }
    
    const handleChange = ({ target: { value } }) => {
        setTableId(value);
    }
    
    const submitHandler = async (event) => {
        event.preventDefault();
        const ac = new AbortController();
        try {
            await seatReservation(tableId, reservation_id, ac.signal);
            await changeReservationStatus(reservation_id, 'seated', ac.signal);
            history.push(`/dashboard`);
        } catch (error) {
            setError(error);
        }
    }
    
    const list = tables.map((obj) => <TablesDropDown key={obj.table_id} table={obj} />);

    return (
        <>
            <div>   
                Seat Form
            </div>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>
                <select className="form-select" 
                    aria-label="Default select example"
                    name='table_id'
                    required
                    onChange={handleChange}
                >
                    <option value=''>Select a table</option>
                    {list}
                </select>
                <button
                    type="submit"
                    className="btn btn-primary mr-2"
                >Submit</button>
                <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={cancelHandler}
                >Cancel</button>
            </form>
            
        </>
    )
}