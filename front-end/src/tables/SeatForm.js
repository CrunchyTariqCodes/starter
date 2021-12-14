import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom"
import { listTables, updateStatus, seatReservation } from "../utils/api";
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
            await updateStatus(reservation_id, 'seated', ac.signal);
            history.push(`/dashboard`);
        } catch (error) {
            setError(error);
        }
    }

    return (
        <>
            <div>   
                Seat Form
            </div>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>
              <div className='tablesNew_formGroup'>
                <select className="form-select" 
                    name='table_id'
                    required
                    onChange={handleChange}
                >
                    <option value=''>Select a Table</option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={table.table_id}
                  disabled={table.reservation_id ? true : false}
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
                </select>
                </div>
                <div className='tablesNew_formBtns'>
                <button
                    type="submit"
                    className="btn btn-info mr-2"
                >Submit</button>
                <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={cancelHandler}
                >Cancel</button>
                </div>
            </form>
            
        </>
    )
}