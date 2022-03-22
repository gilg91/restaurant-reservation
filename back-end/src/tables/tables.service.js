const knex = require("../db/connection");

// lists tables
function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

// creates a new table
function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((newTables) => newTables[0]);
}

// reads by table id
function read(tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .then((result) => result[0]);
}

// updates a table
async function update(updatedTable, resId, updatedResStatus) {
    try {
        await knex.transaction(async (trx) => {
        await trx("tables")
            .where({ table_id: Number(updatedTable.table_id) })
            .update(updatedTable, "*")
            .then((updatedTables) => updatedTables[0]);

        await trx("reservations")
            .where({ reservation_id: Number(resId) })
            .update({ status: updatedResStatus }, "*")
            .then((updatedReservations) => updatedReservations[0]);
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    read,
    update,
    list,
};