import React from 'react'
import { useParams } from 'react-router-dom'
import ScheduleCreate from './ScheduleCreate';

function ScheduleEdit() {
  const param = useParams();
  return (
    <ScheduleCreate paramId={param?.id} />
  )
}

export default ScheduleEdit