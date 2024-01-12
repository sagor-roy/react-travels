import React from 'react'
import { useParams } from 'react-router-dom';
import VehicleCreate from './VehicleCreate';

function VehicleEdit() {
  const param = useParams();
  return (
    <VehicleCreate paramId={param?.id} />
  )
}

export default VehicleEdit