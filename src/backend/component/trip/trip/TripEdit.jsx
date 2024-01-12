import React from 'react'
import { useParams } from 'react-router-dom'
import TripCreate from './TripCreate';

function TripEdit() {
  const param = useParams();
  return (
    <TripCreate paramId={param?.id} />
  )
}

export default TripEdit