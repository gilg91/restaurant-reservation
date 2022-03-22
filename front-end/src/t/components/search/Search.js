import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { searchReservations } from '../../utils/api';
import ErrorAlert from '../ErrorAlert';
import SearchResults from './SearchResults';

// search box by phone number
const Search = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [display, setDisplay] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    setRefresh(true);
    setPhone(mobileNumber);
    search();
  };
  
  const changeHandler = ({ target }) => {
    setMobileNumber(target.value);
  };

  const cancelHandler = () => history.goBack();

  const search = () => {
    const abortController = new AbortController();

    if (phone) {
      searchReservations(phone, abortController.signal)
        .then(setResults)
        .then(() => setRefresh(false))
        .then(() => setDisplay(true))
        .catch(setError);
    }
  };

  useEffect(search, [refresh, phone]);

  const searchResult = results?.length ? (
    <div className='search__results'>
      {results.map((reservation) => (
        <SearchResults
          key={reservation.reservation_id}
          reservation={reservation}
          setError={setError}
          setRefresh={setRefresh}
        />
      ))}
    </div>
  ) : (
    <p className='search_resultsNotFound'>{`No reservations found for mobile number ${mobileNumber}`}</p>
  );

  return (
    <div>
      <div>
        <h1>Search for Reservation</h1>
        <ErrorAlert error={error} />
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor='mobile_number'>Mobile Number</label>
            <input
              type='text'
              name='mobile_number'
              placeholder="Enter a customer's phone number"
              value={mobileNumber}
              onChange={changeHandler}
            />
          </div>
          <div>
            <button
              className='btn btn-dark m-1'
              onClick={cancelHandler}
              type='button'
            >
              Cancel
            </button>
            <button 
              className='btn btn-dark m-1'
              type='submit'>
              Find
            </button>
          </div>
        </form>
        {display && searchResult}
      </div>
    </div>
  );
};

export default Search;
