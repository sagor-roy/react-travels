import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DestinationCreate = () => {
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { destination, description, status });
  };

  return (
    <>
      <section className="content-header">
        <h1>
          Destination
          <small>Control Panel</small>
        </h1>
        <ol className="breadcrumb">
          <li><Link to="/admin"><i className="fa fa-dashboard"></i> Dashboard</Link></li>
          <li className="active">Destination</li>
        </ol>
      </section>

      <section className="content container-fluid">
        <div className="box box-primary">
          <div className="box-header with-border text-right">
            <a href="" className="btn btn-sm btn-primary"><i className="fa fa-list"></i> List</a>
          </div>

          <form role="form" onSubmit={handleSubmit}>
            <div className="box-body">
              <div className="form-group">
                <div className="row">
                  <div className="col-md-2">
                    <label>Destination Name<sup className="text-danger">*</sup> :</label>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      required
                      name="destination"
                      className="form-control"
                      placeholder="Destination Name"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-md-2">
                    <label>Description<sup className="text-danger">*</sup> :</label>
                  </div>
                  <div className="col-md-10">
                    <textarea
                      name="description"
                      placeholder="Description"
                      rows="5"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-md-2">
                    <label>Status<sup className="text-danger">*</sup> :</label>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="radio"
                      name="status"
                      value="1"
                      id="active"
                      checked={status === '1'}
                      onChange={() => setStatus('1')}
                    />
                    <label htmlFor="active" style={{ marginRight: '10px' }}>Active</label>

                    <input
                      type="radio"
                      name="status"
                      value="0"
                      id="inactive"
                      checked={status === '0'}
                      onChange={() => setStatus('0')}
                    />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="box-footer text-right">
              <button type="submit" className="btn btn-sm btn-success">Save</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default DestinationCreate;