import React, { useEffect, useState } from 'react';
import { listReservations, listTables, deleteSeat} from '../utils/api';
import ErrorAlert from './ErrorAlert';
import { useHistory } from 'react-router-dom';
import TablesInfo from './tables/TablesInfo';
import ReservationInfo from './reservations/ReservationInfo';
import { previous, next } from '../utils/date-time';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  
  const history = useHistory();
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const finished = (tableId) => {
    const abortController = new AbortController();
    deleteSeat(tableId, abortController.signal)
      .then(loadDashboard)
      .catch(setReservationsError);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className='d-md-flex mb-3'>
        <div>
          <div>
            <button
              onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
              className='btn btn-dark m-1'
            >
              Previous
            </button>
            <button
              onClick={() => history.push(`/dashboard`)}
              className='btn btn-dark m-1'
            >
              Today
            </button>
            <button
              onClick={() => history.push(`/dashboard?date=${next(date)}`)}
              className='btn btn-dark m-1'
            >
              Next
            </button>
          </div>
          <h4 className='mb-0'>Reservations for {date}</h4>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <div>
          {reservations.map((reservation) => (
            <ReservationInfo
              key={reservation.reservation_id}
              reservation={reservation}
              loadDashboard={loadDashboard}
              setReservationsError={setReservationsError}
            />
          ))}
        </div>
        <TablesInfo
          loadDashboard={loadDashboard}
          finished={finished}
          tables={tables}
          tablesError={tablesError}
        />
      </div>
    </main>
  );
}

export default Dashboard;
