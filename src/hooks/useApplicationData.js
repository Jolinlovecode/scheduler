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

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({...prev, days: days.data, appointments:appointments.data, interviewers:interviewers.data }));
      //console.log(days); 
      //console.log(all);
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
  
  return axios
  .put(`/api/appointments/${id}`, appointments[id])   
  .then((response) => {
    if(response.status === 204)  { 
    setState(prev => ({...prev, appointments}));
  }})
  .catch(() => console.error("got a error!"))
}


  function cancelInterview(id) {
    return axios
    .delete(`/api/appointments/${id}`)
    .then(() => setState(prev => ({...prev, id: { id, interview:null} })))
    .catch(() => console.error("got a error!"))
  }

  return { state, setDay, bookInterview, cancelInterview };

}