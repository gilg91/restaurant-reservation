const knex = require('../db/connection')

function list(reservationDate){
    return knex('reservations')
        .select('*')
        .where({ reservation_date: reservationDate })
        .orderBy('reservation_time') 
}
function read(reservationId) {
    return knex('reservations')
        .select('*')
        .where({ reservation_id: reservationId })
        .first()
}
function create(newReservation) {
    return knex('reservations')
        .insert(newReservation)
        .returning('*')
}
function update(reservationId, updatedStatus) {
    return knex('reservations')
      .select('status')
      .where({ reservation_id: reservationId })
      .update(updatedStatus, '*')
}


function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

module.exports = {
  list,
  read,
  create,
  update,
  search,
}