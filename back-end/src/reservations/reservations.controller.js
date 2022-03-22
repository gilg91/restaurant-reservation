const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

// check if reservation id exists
async function reservationExists(request, response, next) {
    const { reservation_id } = request.params;
    let reservation = await service.read(reservation_id);
    const error = {
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    };
    if (reservation) {
      response.locals.reservation = reservation;
      return next();
    }
    next(error);
}

// date and time validation
async function ValidDateTime(request, _, next) {
  const { reservation_date, reservation_time } = request.body.data;
  const date = new Date(reservation_date);
  let today = new Date();
  const resDate = new Date(reservation_date).toUTCString();

  if (resDate.includes('Tue')) {
    return next({
      status: 400,
      message: 'Tuesday as the restaurant is closed on Tuesdays',
    });
  }

  if (
    date.valueOf() < today.valueOf() &&
    date.toUTCString().slice(0, 16) !== today.toUTCString().slice(0, 16)
  )
    return next({
      status: 400,
      message: 'Reservations must be in the future',
    });

  if (reservation_time < '10:30' || reservation_time > '21:30') {
    return next({
      status: 400,
      message: 'the reservation time you choose is not during the open hours',
    });
  }
  next();
}

// reservation validation
async function validateReservation(request, response, next) {
    if (!request.body.data)
      return next({ status: 400, message: 'Data Missing!' });
    const {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
      status,
    } = request.body.data;
    let updatedStatus = status;
    if (
      !first_name ||
      !last_name ||
      !mobile_number ||
      !people ||
      !reservation_date ||
      !reservation_time
    )
      return next({
        status: 400,
        message:
          'Please complete the following information: first_name, last_name, mobile_number, people, reservation_date, and reservation_time.',
      });
    if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
      return next({ status: 400, message: 'reservation_date is invalid' });
    if (!reservation_time.match(/\d{2}:\d{2}/))
      return next({ status: 400, message: 'reservation_time is invalid' });
    if (typeof people !== 'number')
      return next({ status: 400, message: 'people is not a number' });
    if (!status) updatedStatus = 'booked';
    if (status === 'seated')
      return next({ status: 400, message: 'reservation is already seated' });
    if (status === 'finished')
      return next({ status: 400, message: 'reservation is already finished' });
    response.locals.newReservation = {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
      status: updatedStatus,
    };
    next();
}

// lists handler for reservation resources
async function list(request, response) {
  const { date, mobile_number } = request.query;
  let results = null;

  !date
    ? (results = await service.search(mobile_number))
    : (results = await service.list(date));

  results = results.filter((result) => {
    return result.status !== 'finished';
  });

  response.json({ data: results });
}

// create reservation
async function create(_, response) {
    const data = await service.create(response.locals.newReservation);
    response.status(201).json({
      data: data[0],
    });
}

// read a reservation
async function read(_, response) {
    response.json({
      data: response.locals.reservation,
    });
}

// Update a reservation
const update = async (request, response) => {
    const { reservation } = response.locals;
    const updatedReservation = { ...reservation, ...request.body.data };
    const { reservation_id } = reservation;
    const data = await service.update(reservation_id, updatedReservation);
    response.json({ data: data[0] });
};

// Update Status
async function updateStatus(request, response, next) {
    const newStatus = request.body.data.status;
    const validStatus = ['seated', 'booked', 'finished', 'cancelled'];
    const { reservation } = response.locals;
    const { reservation_id } = reservation;
    let { status } = reservation;
    if (!validStatus.includes(newStatus)) {
      return next({
        status: 400,
        message: 'Cannot accept unknown status',
      });
    }
    if (status === 'finished') {
      return next({
        status: 400,
        message: 'Cthe reservation is finished',
      });
    }
    const updatedReservation = { ...reservation, ...request.body.data };
    const data = await service.update(reservation_id, updatedReservation);
    response.json({ data: { status: newStatus } });
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [
      asyncErrorBoundary(reservationExists),
      asyncErrorBoundary(read),
    ],
    create: [
      asyncErrorBoundary(validateReservation),
      asyncErrorBoundary(ValidDateTime),
      asyncErrorBoundary(create),
    ],
    update: [
      asyncErrorBoundary(reservationExists),
      asyncErrorBoundary(validateReservation),
      asyncErrorBoundary(update),
    ],
    updateStatus: [
      asyncErrorBoundary(reservationExists),
      asyncErrorBoundary(updateStatus),
    ],
};