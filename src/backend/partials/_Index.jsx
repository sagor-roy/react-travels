import React from 'react'
import { Link } from 'react-router-dom'

function _Index({children, pageTitle}) {
  return (
    <>
    <section className="content-header">
        <h1>
          {pageTitle}
          <small>Control Panel</small>
        </h1>
        <ol className="breadcrumb">
          <li><Link to="/admin"><i className="fa fa-dashboard"></i> Dashboard</Link></li>
          <li className="active">{pageTitle}</li>
        </ol>
      </section>

      <section className="content container-fluid">
        <div className="box box-primary">
          <div className="box-header with-border text-right">
            <a href="" className="btn btn-sm btn-primary"><i className="fa fa-list"></i> List</a>
          </div>
          {children}
        </div>
      </section>
    </>
  )
}

export default _Index