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

  // update state when we book an interview 
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

  //find the possible booked day by appoint id
  const clickDay = state.days.find((day)=> day.appointments.includes(id));
  //update day state according to interview.If it's null, the spots will be decreased by 1 when booking.Otherwise keep same.
  const days = state.days.map((day) => {
    if (day.name === clickDay.name && state.appointments[id].interview === null) {
      return {...day, spots:day.spots - 1 }
    }
    else {
      return day;
    }
  })
  
  return axios
  .put(`/api/appointments/${id}`, appointments[id])   
  .then(() => {
    //set update state
    setState({...state, appointments, days})
    console.log("days",days);
  })
  .catch(() => console.error("got a error!"))
}

  // update state when we cancel an interview 
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const clickDay = state.days.find(day => day.appointments.includes(id));
    // console.log("click", clickDay);
    // console.log("days",state.days);
    //return the day 
    const days = state.days.map((day) => {
      if (day.name === clickDay.name ) {
        return {...day, spots:day.spots + 1 }
      }
      else {
        return day;
      }
    })

    return axios
    .delete(`/api/appointments/${id}`)
    //set update state
    .then(() => {
      setState({...state, appointments, days})
    })
    .catch(() => console.error("got a error!"))
  }

  return { state, setDay, bookInterview, cancelInterview };
}