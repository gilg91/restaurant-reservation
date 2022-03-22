import React, { useState } from 'react';
import ErrorAlert from '../ErrorAlert';
import { useHistory } from 'react-router-dom';
import { createTable } from '../../utils/api';

// create new table
const NewTable = () => {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    table_name: '',
    capacity: 0,
  });
  const history = useHistory();
  
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]:
        target.name === 'capacity' ? Number(target.value) : target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      createTable(
        {
          data: { ...formData },
        },
        abortController.signal
      )
        .then(() => history.push('/dashboard'))
        .catch(setError);
    } catch (error) {
      setError(error.message);
    }
  };
  
  const cancelHandler = () => history.goBack();

  return (
    <div>
      <div>
        <h1>New Table</h1>
        <ErrorAlert error={error} />
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor='table_name'>Table Name</label>
            <input
              type='text'
              name='table_name'
              minLength='2'
              value={formData.table_name}
              onChange={changeHandler}
              required
            />
          </div>
          <div>
            <label htmlFor='capacity'>Capacity</label>
            <input
              type='text'
              name='capacity'
              value={formData.capacity}
              min='1'
              onChange={changeHandler}
              required
            />
          </div>
          <div>
            <button onClick={cancelHandler}>
              Cancel
            </button>
            <button type='submit'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTable;
