const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// check request with required data
function hasData(req, res, next) {
    if (!req.body.data) {
        return next({
        status: 400,
        message: `data is missing from request`,
        });
    }
    return next();
}

function hasProperties(...properties) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      try {
        properties.forEach((property) => {
          if (!data[property]) {
            const error = new Error(`A '${property}' property is required.`);
            error.status = 400;
            throw error;
          }
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  }

const hasRequiredProperties = hasProperties(...["table_name", "capacity"]);

// check request has reservation_id
function hasReservationId(req, res, next) {
    if (req.body.data.reservation_id) {
        return next();
    }
    return next({
        status: 400,
        message: `reservation_id is missing from request`,
    });
}

// check if resercation with id from request exists
async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const reservation = await reservationsService.read(reservation_id);
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    return next({
        status: 404,
        message: `Reservation_id: ${reservation_id} was not found`,
    });
}

// check table id exists
async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(Number(table_id));
    if (table) {
        res.locals.table = table;
        return next();
    }
    return next({
        status: 404,
        message: `Table id: ${table_id} was not found`,
    });
}

// check seat status
async function isSeated(req, res, next) {
    const reservation = res.locals.reservation;
    if (reservation.status !== "seated") {
        return next();
    }
    return next({
        status: 400,
        message: `Reservation is already 'seated'`,
    });
}

// check capacity large enough
function capacityLargeEnough(req, res, next) {
    const tableCapacity = res.locals.table.capacity;
    const guests = res.locals.reservation.people;
    if (tableCapacity < guests) {
        return next({
        status: 400,
        message: `Too many guests ( ${guests} ) for table size. Please choose table with capacity.`,
        });
    } else {
        return next();
    }
}

// check if table occupied
function tableIsFree(req, res, next) {
    if (res.locals.table.reservation_id) {
        return next({
        status: 400,
        message: `Table is already occupied: ${res.locals.table.table_id}`,
        });
    } else {
        return next();
    }
}

// assign table to a reservation
function occupyTable(req, res, next) {
    const { table } = res.locals;
    const { reservation_id } = req.body.data;
    table.reservation_id = reservation_id;
    res.locals.resId = reservation_id;
    res.locals.resStatus = "seated";
    if (table.reservation_id) {
        return next();
    }
    return next({
        status: 400,
        message: `table ${table.table_id} unable to assign with reservation ${table.reservation_id}`,
    });
}

// unassign a table from reservation
function deOccupyTable(req, res, next) {
    const { table } = res.locals;
    res.locals.resId = table.reservation_id;
    table.reservation_id = null;
    res.locals.resStatus = "finished";
    if (!table.reservation_id) {
        return next();
    }
    return next({
        status: 400,
        message: `Table ${table.table_id} unable to remove from reservation ${table.reservation_id}`,
    });
}

function tableIsOccupied(req, res, next) {
    const { table } = res.locals;
    if (table.reservation_id) {
        return next();
    }
    return next({
        status: 400,
        message: `Table with id: ${table.table_id} is not occupied`,
    });
}

// check capacity value
function capacityIsValid(capacity) {
    return Number.isInteger(capacity) && capacity >= 1;
}

// check table name length
function tableNameIsValid(tableName) {
    return tableName.length > 1;
}

// table name and capacity validation
function hasValidValues(req, res, next) {
    const { table_name, capacity } = req.body.data;
    
    if (!capacityIsValid(capacity)) {
        return next({
        status: 400,
        message: "capacity must be an Integer and greater than 0",
        });
    }

    if (!tableNameIsValid(table_name)) {
        return next({
        status: 400,
        message: "table_name must be at least two characters",
        });
    }
    return next();
}

const VALID_PROPERTIES = ["table_name", "reservation_id", "capacity"];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if (invalidFields.length) {
        return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
        });
    }
    return next();
}

// list tables
async function list(req, res) {
    const tables = await service.list();
    res.locals.data = tables;
    const { data } = res.locals;
    res.json({ data: data });
}

// reads a table
async function read(req, res) {
    const { table } = res.locals;
    res.json({ data: table });
}

// creates a table
async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
}

// updates reservation status
async function update(req, res) {
    const { table, resId, resStatus } = res.locals;
    const updatedTable = { ...table };
    const data = await service.update(updatedTable, resId, resStatus);
    res.status(200).json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(read),
    ],
    create: [
        hasOnlyValidProperties,
        hasRequiredProperties,
        hasValidValues,
        asyncErrorBoundary(create),
    ],
    put: [
        hasData,
        hasReservationId,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(isSeated),
        asyncErrorBoundary(tableExists),
        tableIsFree,
        capacityLargeEnough,
        occupyTable,
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(tableExists),
        tableIsOccupied,
        deOccupyTable,
        asyncErrorBoundary(update),
    ],
};