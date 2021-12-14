const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

async function createTableRequirements(request, response, next) {
    const { data: { table_name, capacity } = {} } = request.body;
    if (!table_name || table_name.length < 2) {
        next({ status: 400, message: `To submit a table, input a table_name.` });
    } else if (!capacity || typeof(capacity) !== typeof(0) || !Number.isInteger(capacity) || capacity === 0) {
        next({ status: 400, message: `To submit a table, input a valid capacity.` });
    }
    const table = {
        table_name,
        capacity,
    };
    response.locals.table = table;
    next();
}

async function tableExists(request, response, next) {   
    const table = await tablesService.read(request.params.table_id);
    if (table) {
        response.locals.table = table;
        return next();
    }
    next({ status: 404, message: `Table ${request.params.table_id} cannot be found.` });
}

async function validateUpdate(request, response, next) {
    if (!request.body.data) {
        next({ status: 400, message: `data is missing.` });
    }
    const { reservation_id } = request.body.data;
    if (!reservation_id || reservation_id === '') {
        next({ status: 400, message: `reservation_id is missing.` });
    }
    const table = response.locals.table;
    const reservation = await reservationsService.read(reservation_id);
    if (!reservation) {
        next({ status: 404, message: `No reservation matches ${reservation_id}.` });
    } else if (reservation.people > table.capacity) {
        next({ status: 400, message: 'Table does not have the capacity for the party.' });
    } else if (reservation.status === 'seated') {
        next({ status: 400, message: `Reservation is already seated.` });
    } else if (table.reservation_id){
        next({ status: 400, message: 'Table is occupied.' });
    }

    next();
}

async function isNotOccupied(request, response, next) {
    const table = response.locals.table;
    if (!table.reservation_id) {
        next({ status: 400, message: `Table is not occupied.` });
    }
    next();
}

//CRUDL

async function create(request, response) {
    const table = await tablesService.create(request.body.data);
    response.status(201).json({ data: table });
}

async function read(request, response) {
    const table = response.locals.table;
    response.status(200).json({ table })
}

async function update(request, response) {
    const { table_id } = response.locals.table;
    const { reservation_id } = request.body.data;
    const data = await tablesService.update(table_id, reservation_id);
    await reservationsService.status(reservation_id, 'seated');
    response.status(200).json({ data });
}

 async function destroy(request, response) {
    const { table_id, reservation_id } = response.locals.table;
    await tablesService.delete(table_id);
    await reservationsService.status(reservation_id, 'finished');
    response.sendStatus(200);
}

async function list(request, response) {
    const data = await tablesService.list();
    response.status(200).json({ data });
}
  
module.exports = {
    create: [createTableRequirements, asyncErrorBoundary(create)],
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)],
    finish: [asyncErrorBoundary(tableExists), asyncErrorBoundary(isNotOccupied), asyncErrorBoundary(destroy)],
    list: [asyncErrorBoundary(list)],
};