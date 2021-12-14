const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, '*')
    .then(data => data[0]);
}

function read(reservation_id) {
  return knex('reservations')
      .where({'reservation_id': reservation_id})
      .first();
}

function list(date){
  if (date) {
    return knex('reservations')
      .where('reservation_date', date)
      .orderBy('reservation_time');
  }
  return knex('reservations');
}

 function update(reservation) {
  return knex('reservations')
      .where({ 'reservation_id': reservation.reservation_id })
      .update(reservation, '*')
      .then(data => data[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

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