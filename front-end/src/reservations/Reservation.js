import { useHistory } from "react-router-dom";

export default function Reservation({ reservation, cancel }) {
    const history = useHistory();
    let color = '';
    if (reservation.status === 'finished') {
        color = 'table-danger';
    } else if (reservation.status === 'seated'){
        color = 'table-success';
    }

    const handleCancel = async (event) => {
        const result = window.confirm('Do you want to cancel this reservation? This cannot be undone.');
        if (result) {
            await cancel(reservation);
            history.push('/');
        }
    }

    return (
        <tr className={color}>
            <th scope='row'>{reservation.reservation_id}</th>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            <td>
            {reservation.status === 'booked' ?
                ( <a className="btn btn-info" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a> ) : ( '' )}
            </td>
            <td>
            {reservation.status === 'booked' ?
                ( <a className="btn btn-secondary"href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a> ) : ( '' )}
            </td>
            <td>
            {reservation.status === 'booked' ?
                ( <button className="btn btn-secondary" data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel}>Cancel</button> ) : ( '' )}
            </td>
        </tr>
    )
}