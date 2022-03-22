import React from 'react';
import ErrorAlert from '../ErrorAlert';

// loads table information
const TablesInfo = ({ tables = [], finished, tablesError }) => {
  const finishHandler = ({ target }) => {
    const tableId = target.dataset.tableIdFinish;
    const confirm = window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    );
    if (confirm) {
      finished(tableId);
    }
  };

  return (
    <div className="card my-3 mr-3 w-25">
      <ErrorAlert error={tablesError} />
      <h4>Tables</h4>
      <div>
        {tables.map((table) => (
          <div key={table.table_id}>
            <h4 className="card-header">{table.table_name}</h4>
            <div className="card-body">
            {table.reservation_id ? (
              <p style={{ color: 'red' }} data-table-id-status={table.table_id}>
                occupied
              </p>
            ) : (
              <p data-table-id-status={table.table_id}>free</p>
            )}
            {table.reservation_id && (
              <button
                className='btn btn-dark m-1'
                data-table-id-finish={table.table_id}
                onClick={finishHandler}
                type='button'
              >
                Finish
              </button>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesInfo;
