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

  //book an interview 
  function bookInterview(id, interview) {
    //define appointment 
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    //define appointments
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

  //find the booked day by appointment id
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
  //put the new interview to API databsae, and set state.
  //make bookInterview a promise
  return axios
  .put(`/api/appointments/${id}`, appointments[id])   
  .then(() => {
    //set update state when we book an interview 
    setState({...state, appointments, days})
  })
}

  //delete an interview 
  function cancelInterview(id) {
    //define appointment
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    //define appointments
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //find the day to delete the interview by appointment id
    const clickDay = state.days.find(day => day.appointments.includes(id));
    //update day state as its spots value changes when delete an interview
    const days = state.days.map((day) => {
      if (day.name === clickDay.name ) {
        return {...day, spots:day.spots + 1 }
      }
      else {
        return day;
      }
    })
  //delete an interview to API databsae
    return axios
    .delete(`/api/appointments/${id}`)
    //set update state when delete an interview
    .then(() => {
      setState({...state, appointments, days})
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}