import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { listTables, seatReservation, updateStatus } from '../../utils/api';
import ErrorAlert from '../ErrorAlert';

// seat a reservation
const SeatReservation = () => {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState(0);
  const [error, setError] = useState(null);
  
  const history = useHistory();

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();

    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }
  const cancelHandler = () => history.goBack();
  const changeHandler = ({ target }) => {
    setTableId(Number(target.value));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    if (tableId === 0) {
      return setError({ message: 'Choose a table' });
    }
    seatReservation(tableId, reservation_id, abortController.signal)
      .then(() =>
        updateStatus(
          reservation_id,
          { status: 'seated' },
          abortController.signal
        )
      )
      .then(() => history.push('/dashboard'))
      .catch(setError);
  };

  return (
    <div>
      <div>
        <h1>Seat Reservation</h1>
        <ErrorAlert error={error} />
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor='table_name'>Table Number</label>
            <select
              name='table_id'
              minLength='2'
              onChange={changeHandler}
              required
            >
              <option value=''>Select a Table</option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={table.table_id}
                  disabled={table.reservation_id ? true : false}
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              className='btn btn-dark m-1'
              onClick={cancelHandler}
              type='button'
            >
              Cancel
            </button>
            <button className='btn btn-dark m-1' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeatReservation;
