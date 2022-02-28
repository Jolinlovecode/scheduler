import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days, value, onChange } = props;
  //console.log(props);
  const dayList = days.map((eachDay) => {
    return <DayListItem 
            key={eachDay.id} 
            name={eachDay.name}
            spots={eachDay.spots} 
            selected={eachDay.name === value}
            setDay={onChange}   
          />
  })
 
  return (
    <ul>{dayList}</ul> 
  ); 
};