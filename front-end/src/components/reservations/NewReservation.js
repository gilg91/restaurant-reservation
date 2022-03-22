import React from 'react';
import ReservationForm from './ReservationForm';
import { createReservation } from '../../utils/api';

// creates new reservation with reservation form
const NewReservation = () => {
  const initialFormData = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  };

  return (
    <>
      <ReservationForm
        onSubmit={createReservation}
        initialFormState={initialFormData}
      />
    </>
  );
};

export default NewReservation;
