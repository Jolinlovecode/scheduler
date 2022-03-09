import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  //toggle mode between SHOW and EMPTY in accordance to interview available
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //save a interview, pass it to Appointment component
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    //show saving status while updating in progress
    transition(SAVING);

    // after save the new interview, transite to SHOW mode
    // transition(SHOW) must wait until the bookInterview executed successfully, or transition(SHOW) will run before new state setted.
    props.bookInterview(props.id, interview)
    .then(()=> transition(SHOW) )
    // switch to ERROR_SAVE mode, and replace the last mode which is SAVING, so if go back, we will be into CREATE mode
    .catch(() => transition(ERROR_SAVE, true))
  }
    // after confirm to delete an interview, transite to Empty mode.
  function deleteInterview() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(() =>(transition(EMPTY)))
    // switch to ERROR_DELETE mode, and replace the last mode which is DELETE.If go back, we can go back to CREATE(<Form />)
    .catch(() => transition(ERROR_DELETE,true))
  }
    
  return (
    <article data-testid="appointment" className="appointment">
      <Header time={props.time}/>
    
      {mode === EMPTY && <Empty onAdd={ () => transition(CREATE) } />}
      {mode === SHOW && 
        <Show 
          student={ props.interview.student } 
          interviewer={props.interview.interviewer}
          onDelete={()=> transition(CONFIRM)}
          onEdit={()=> transition(EDIT)} 
        />
      }
      {mode === CREATE &&
        <Form 
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        /> 
      } 
      {mode === SAVING && <Status message={"Saving"}/>}
      {mode === DELETING && <Status message={"Deleting"}/>}
      {mode === CONFIRM && <Confirm onConfirm={deleteInterview} onCancel={back} message={"Are you sure you would like to delete?"}/>}
      {mode === EDIT && 
      <Form 
        student={props.interview.student} 
        interviewer={props.interview.interviewer.id} 
        interviewers={props.interviewers}
        onSave={save} 
        onCancel={back}
      />
      }
      {mode === ERROR_DELETE && <Error message={"Error"} onClose={back}/>}
      {mode === ERROR_SAVE && <Error message={"Error"} onClose={back}/>}
    </article>
  )

}