const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");

//middleware 
 function statusIsValid(req, res, next){
  const { status } = req.body.data;
  const valid = ['booked', 'seated', 'finished', 'cancelled'];
  if (!valid.includes(status)){
    return next({ status: 400, message: "unknown status" });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservation_id} not found.` });
}


 function reservationFinished(req, res, next){
  const { status } = res.locals.reservation;
  if (status === 'finished'){
    next({ status: 400, message: "Reservation is finished." });
  }
  next();
}

function reservationRequirements(req, res, next){
  const { data: { reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status } = {} } = req.body;
  const time = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  if (!first_name || first_name.trim() === '') {
    next({ status: 400, message: "Must input a first name." });
  } else if (!last_name || last_name.trim() === "") {
    next({ status: 400, message: "Must input a last name." });
  } else if (!mobile_number || typeof(mobile_number) !== 'string') {
    next({ status: 400, message: "Must input a mobile number" });
  } else if (!reservation_date || !Date.parse(reservation_date)) {
    next({ status: 400, message: "Must input a date." });
  } else if (!reservation_time || !reservation_time.match(time)) {
    next({ status: 400, message: "Must input a time." });
  } else if (!people || typeof(people) !== typeof(0) || !Number.isInteger(people) || people === 0) {
    next({ status: 400, message: "Must input the amount of people in the party." });
  } else if (status === 'seated' || status === 'finished') {
    next({ status: 400, message: "Status cannot be seated or finished" });
  }

  const reservation = {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  res.locals.reservation = reservation;
  next();
}

 function tuesdayAndFutureDate(req, res, next){
  const { reservation_date, reservation_time } = res.locals.reservation;
  if (Date.now() < new Date(reservation_date + ' ' + reservation_time)) {
    const tuesday = new Date(reservation_date).getUTCDay();
    if (tuesday === 2){
      next({ status: 400, message: `Cannot make a reservation on Tuesdays.` });
    }
    return next();
  } else {
    next({ status: 400, message: `Reservations must be made in the future.` });
  }
  next();
}

function checkTime(req, res, next){
  const { reservation_time } = res.locals.reservation;
  const time = reservation_time.split(':').join('');
  if ((time <= 1030) || (time > 2130)){
    next({ status: 400, message: "You cannot make a reservation before 10:30AM or after 9:30PM." });
  }
  next();
}

//CRUDL

async function create(req, res){
  const reservation = await reservationsService.create(res.locals.reservation);
  res.status(201).json({ data: reservation });
}

const read = (req, res) => {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
};


async function status(request, response) {
  const { reservation_id } = response.locals.reservation;
  const { status } = request.body.data;
  const reservation = await reservationsService.status(reservation_id, status);
  response.status(200).json({ data: reservation });
}

async function update(req, res) {
  const { reservation_id } = req.params;
  const reservation = {
    ...req.body.data,
    reservation_id: reservation_id
  };
  const updated = await reservationsService.update(reservation);
  res.status(200).json({ data: updated });
}

async function list(req, res) {
  const filter = ['finished', 'cancelled'];
  const date = req.query.date;
  const mobile = req.query.mobile_number;
  if (date) {
    const reservations = await reservationsService.list(date);
    const filtered = reservations.filter((reservation) => !filter.includes(reservation.status) );
    res.json({ data: filtered });
  } else if (mobile) {
    const reservations = await reservationsService.search(mobile);
    res.json({ data: reservations });
  } else {
    const anchor = await reservationsService.list(date);
    res.json({ data: anchor });
  }
}

module.exports = {
  create: [reservationRequirements, tuesdayAndFutureDate, checkTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(reservationExists), reservationRequirements, asyncErrorBoundary(update)],
  list: [asyncErrorBoundary(list)],
  status: [statusIsValid, asyncErrorBoundary(reservationExists), reservationFinished, asyncErrorBoundary(status)],
};