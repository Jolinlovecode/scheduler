import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  //use axios to get data from API server for setting application data, when first load
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({...prev, days: days.data, appointments:appointments.data, interviewers:interviewers.data }));
    });
  },[]);
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

  //put a new interview to API database, and set state
  return axios
  .put(`/api/appointments/${id}`, appointments[id])   
  .then((response) => {
    if(response.status === 204)  { 
    setState(prev => ({...prev, appointments}));
  }})
  .catch(() => console.error("got a error!"))
}

  // cancel a interview
  function cancelInterview(id) {
    return axios
    .delete(`/api/appointments/${id}`)
    //set interview into null
    .then(() => setState(prev => ({...prev, id: { id, interview:null} })))
    .catch(() => console.error("got a error!"))
  }

  return { state, setDay, bookInterview, cancelInterview };

}