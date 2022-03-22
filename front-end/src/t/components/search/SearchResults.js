import React from 'react';
import { Link } from 'react-router-dom';
import { updateStatus } from '../../utils/api';

// displays search results
const SearchResults = ({ reservation, setError, setRefresh }) => {
  
  const cancelHandler = ({ target }) => {
    const abortController = new AbortController();

    const reservation_id = target.dataset.reservationIdCancel;
    const confirm = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    );
    if (confirm) {
      updateStatus(
        reservation_id,
        { status: 'cancelled' },
        abortController.signal
      )
        .then(() => setRefresh(true))
        .catch(setError);
    }
  };

  return (
    <div key={reservation.reservation_id}>
      <div>
        <p>Name: {reservation.first_name} {reservation.last_name}</p>
        <p>Date: {reservation.reservation_date.slice(0, 10)}</p>
        <p>Time: {reservation.reservation_time}</p>
        <p>Size: {reservation.people}</p>
        <p>Status:{' '} {reservation.status}</p>
        <div>
          <button
            onClick={cancelHandler}
            data-reservation-id-cancel={reservation.reservation_id}
            className="btn btn-dark m-1"
            disabled={
              reservation.status === 'finished' || reservation.status === 'cancelled' ? true : false
            }
          >
            Cancel
          </button>
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button
              className="btn btn-dark m-1"
              disabled={
                reservation.status === 'finished' || reservation.status === 'cancelled' ? true : false
              }
            >
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
