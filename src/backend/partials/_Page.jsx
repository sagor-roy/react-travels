import React from 'react'
import { Link } from 'react-router-dom'
import { useBackendConext } from '../../context/BackendContext';
import Modal from './_Modal';

function _Page({ children, pageTitle, url, status, excelFile, handleUpload }) {

  const { state, dispatch } = useBackendConext();
  const { modal: modalStatus, pending } = state;
  const { handleFileChange } = dispatch;

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
            <Link to={url} className="btn btn-sm btn-primary"><i className={`fa fa-${status === 'create' ? 'plus' : 'list'}`}></i> {status === 'create' ? 'Add' : 'List'}</Link>
          </div>
          {children}
        </div>
      </section>

      {/* import excel */}
      {modalStatus && <Modal headerText={`Import`}>
        <form style={{ marginTop: '10px' }} onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} className='form-control is-invalid' accept='.xlsx' />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button disabled={pending} className='btn btn-primary btn-sm' type="submit">{!pending ? 'Import' : 'Loading...'}</button>
            <a href={excelFile}>
              <i className='fa fa-download'></i> Example Excel
            </a>
          </div>
        </form>
      </Modal>}
    </>
  )
}

export default _Page