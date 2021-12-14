import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { today } from "../utils/date-time";
import useQuery from '../utils/useQuery';
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import NotFound from "./NotFound";
import NewTable from "../tables/NewTable";
import SeatForm from "../tables/SeatForm";
import SearchPage from "../search/SearchByMobile";
import EditReservation from "../reservations/EditReservation";

 export default function Routes() {
  const query = useQuery();
  const date = query.get('date');

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route path="/reservations/new">
        <NewReservation />
      </Route>
      <Route path='/reservations/:reservation_id/seat'>
        <SeatForm />
      </Route>
      <Route path='/reservations/:reservation_id/edit'>
        <EditReservation />
      </Route>
      <Route path='/search'>
        <SearchPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}