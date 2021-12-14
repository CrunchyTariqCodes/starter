import Reservation from "./Reservation";

export default function ReservationList({ reservations, date, cancel }) {
    let list;
    if (date) {
        const findDate = reservations.filter((obj) => obj.reservation_date === date);
        list = findDate.map((obj) => <Reservation key={obj.reservation_id} reservation={obj} cancel={cancel} />);
    } else {
        list = reservations.map((reservation) => <Reservation key={reservation.reservation_id} reservation={reservation} cancel={cancel} />)
    }
 
    return (
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th scope='col'>ID</th>
                    <th scope='col'>First name</th>
                    <th scope='col'>Last name</th>
                    <th scope='col'>Mobile number</th>
                    <th scope='col'>Reservation Date</th>
                    <th scope='col'>Reservation Time</th>
                    <th scope='col'>People</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Seat</th>
                    <th scope='col'>Edit</th>
                    <th scope='col'>Cancel</th>
                </tr>
            </thead> 
            <tbody>
                {list}
            </tbody>
        </table>
    )
}