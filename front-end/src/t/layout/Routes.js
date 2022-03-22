import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import NotFound from '../components/NotFound';
import { today } from '../utils/date-time';
import NewReservation from '../components/reservations/NewReservation';
import EditReservation from '../components/reservations/EditReservation';
import SeatReservation from '../components/reservations/SeatReservations';
import NewTable from '../components/tables/NewTable';
import Search from '../components/search/Search';
import useQuery from '../utils/useQuery';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get('date');

  return (
    <Switch>
      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path='/dashboard'>
        <Dashboard date={date || today()} />
      </Route>
      <Route exact={true} path='/search'>
        <Search />
      </Route>
      <Route exact={true} path='/tables/new'>
        <NewTable />
      </Route>
      <Route exact={true} path='/reservations/:reservation_id/seat'>
        <SeatReservation />
      </Route>
      <Route exact={true} path='/reservations/:reservation_id/edit'>
        <EditReservation />
      </Route>
      <Route exact={true} path='/reservations/new'>
        <NewReservation />
      </Route>
      
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;