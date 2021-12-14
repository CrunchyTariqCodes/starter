import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { listReservations, listTables, freeTable, updateStatus } from "../utils/api";
import { next, previous, today } from '../utils/date-time'
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from '../reservations/ReservationList';
import TableList from '../tables/TableList'


export default function Dashboard({ date }) {

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const ac = new AbortController();
    const getReservations = async () => {
      try {
        const reservations = await listReservations({ date }, ac.signal);
        const tables = await listTables(ac.signal);
        setReservations(reservations);
        setTables(tables);
      } catch (error) {
        setError(error);
      }

    }
    getReservations();
  }, [date])
 
  const finish = async (table) => {
    const ac = new AbortController();
    try {
      await freeTable(table.table_id, ac.signal);
    } catch(error) {
      setError(error);
    }
  }

  const cancel = async (reservation) => {
    const ac = new AbortController();
    try {
      await updateStatus(reservation.reservation_id, 'cancelled', ac.signal)
    } catch (error) {
      setError(error);
    }
  }

  return (
    <main>
      <h1>Reservations by date</h1>
      <ErrorAlert error={error} />
      <nav className='btn-group mb-2'>
        <Link to={`/dashboard?date=${previous(date)}`}>
          <button className='btn btn-secondary'>Previous</button>
        </Link>
        <Link to={`/dashboard?date=${today()}`}>
          <button className='btn btn-info ml-2'>Today</button>
        </Link>
        <Link to={`/dashboard?date=${next(date)}`}>
          <button className='btn btn-secondary ml-2'>Next</button>
        </Link>
      </nav>
      <ReservationList reservations={reservations} date={date} cancel={cancel}/>
      <TableList tables={tables} finish={finish} />
    </main>
  );
}