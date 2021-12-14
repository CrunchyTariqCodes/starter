const knex = require("../db/connection");
const reservationsService = require('../reservations/reservations.service');

function create(newTable) {
    return knex("tables")
        .insert(newTable, '*')
        .then(data => data[0]);
}

const read = (table_id) => {
    return knex('tables').where({ table_id }).first();
  };

function update(table_id, reservation_id) {
    return knex('tables')
        .select('*')
        .where({'table_id': table_id })
        .update({'reservation_id': reservation_id })
        .then(data => data[0]);
}

function destroy(table_id){
    return knex('tables')
        .where({ 'table_id': table_id })
        .update({ 'reservation_id': null });
}
const list = () => {
    return knex('tables').orderBy('table_name');
  };

module.exports = {
    create,
    read,
    update,
    delete: destroy,
    list,
};