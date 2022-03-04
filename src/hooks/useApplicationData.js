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

  //calculate the number of day spots
  const spotUpdate = (weekday, day, variable) => {
    let spot = day.spots;
    if (weekday === day.name && variable === "REMOVE_SPOT") {
      return spot - 1;
    } else if (weekday === day.name && variable === "ADD_SPOT") {
      return spot + 1;
    } else {
      return spot;
    }
  };

 //set update day state because of spots change
  const updateSpots = (weekday, days, variable) => {
    if (variable === "REMOVE_SPOT") {
      const updatedStateDayArray = days.map(day => {
        return {
          ...day,
          spots: spotUpdate(weekday, day, variable)
        };
      });
      return updatedStateDayArray;
    }
    if (variable === "ADD_SPOT") {
      const updatedStateDayArray = days.map(day => {
        return {
          ...day,
          spots: spotUpdate(weekday, day, variable)
        };
      });
      return updatedStateDayArray;
    }
  };

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

  //put a new interview to API database, and set update state
  return axios
  .put(`/api/appointments/${id}`, appointments[id])   
  .then(() => {
    const spotUpdate = updateSpots(state.day, state.days, "REMOVE_SPOT");
        setState({
          ...state,
          days: spotUpdate,
          appointments
        });
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

    return axios
    .delete(`/api/appointments/${id}`)
    //set interview into null, and set update state
    .then(() => {
      const spotUpdate = updateSpots(state.day, state.days, "REMOVE_SPOT");
        setState({
          ...state,
          days: spotUpdate,
          appointments
        });
    })
    .catch(() => console.error("got a error!"))
  }

  return { state, setDay, bookInterview, cancelInterview };
}