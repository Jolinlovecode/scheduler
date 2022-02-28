export function getAppointmentsForDay(state, day) {
 
  const findDay = state.days.find(d => d.name === day);

  if (state.days.length === 0) return [];
  if (!findDay) return [];
  return findDay.appointments.map(id => state.appointments[id])
}

export function  getInterviewersForDay(state, day) {
  const findDay = state.days.find(d => d.name === day);

  if (state.days.length === 0) return [];
  if (!findDay) return [];
  return findDay.interviewers.map(id => state.interviewers[id])

}


export function getInterview(state, interview) {
  if (interview === null) return null;
  for (let interviewId in state.interviewers) {
    if (state.interviewers[interviewId].id === interview.interviewer) {
      return {
        "student": interview.student,
        "interviewer": state.interviewers[interviewId]
      }
    }

  }
 
}


