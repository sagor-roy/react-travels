import React from 'react'
import DestinationCreate from './DestinationCreate'
import { useParams } from 'react-router-dom'

function DestinationEdit() {
  const param = useParams();
  return (
    <DestinationCreate paramId={param?.id} />
  )
}

export default DestinationEdit