import React from 'react';
import { Link } from 'react-router-dom';
import { updateStatus } from '../../utils/api';

// loads reservation information
const ReservationInfo = ({
  reservation,
  loadDashboard,
  setReservationsError,
}) => {
  const cancelHandler = () => {
    const abortController = new AbortController();
    
    const confirm = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    );
    if (confirm) {
      updateStatus(
        reservation.reservation_id,
        { status: 'cancelled' },
        abortController.signal
      )
        .then(loadDashboard)
        .catch(setReservationsError);
    }
  };



  
  return (
    <div>
      <div>
        <div>
          <p>Name: {reservation.first_name} {reservation.last_name}</p>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p>Time: {reservation.reservation_time}</p>
          <p>Size: {reservation.people}</p>
          <p data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
        </div>

        <div>
          {reservation.status === 'booked' && (
            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
              <button className='btn btn-dark m-1'>Seat</button>
            </Link>
          )}
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button className='btn btn-dark m-1'>Edit</button>
          </Link>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            className='btn btn-dark m-1'
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationInfo;
