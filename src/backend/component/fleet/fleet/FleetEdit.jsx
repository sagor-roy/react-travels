import React from 'react'
import { useParams } from 'react-router-dom'
import FleetCreate from './FleetCreate';

function FleetEdit() {
  const param = useParams();
  return (
    <FleetCreate paramId={param?.id} />
  )
}

export default FleetEdit