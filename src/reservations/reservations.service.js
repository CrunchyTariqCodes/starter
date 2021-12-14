const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, '*')
    .then(data => data[0]);
}

const read = (reservationId) => {
  return knex('reservations').where({ reservation_id: reservationId }).first();
};

const list = (date) => {
  return knex('reservations')
    .where({ reservation_date: date })
    .where('status', 'booked')
    .orWhere('status', 'seated')
    .orderBy('reservation_time');
};

 function update(reservation) {
  return knex('reservations')
      .where({ 'reservation_id': reservation.reservation_id })
      .update(reservation, '*')
      .then(data => data[0]);
}

const search = (mobile_number) => {
  return knex('reservations')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy('reservation_date');
};

 function status(reservation_id, status) {
  return knex('reservations')
      .where({ 'reservation_id': reservation_id })
      .update({ 'status': status })
      .returning('*')
      .then(data => data[0]);
}

module.exports = {
  create,
  read,
  update,
  list,
  search,
  status,
};