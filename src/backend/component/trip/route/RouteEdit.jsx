import React from 'react'
import { useParams } from 'react-router-dom'
import RouteCreate from './RouteCreate';

function RouteEdit() {
  const param = useParams();
  return (
    <RouteCreate paramId={param?.id} />
  )
}

export default RouteEdit