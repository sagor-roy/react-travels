import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../partials/_Page';
import toast from 'react-hot-toast';
import config from '../../../../config/config';
import { useEffect } from 'react';

const RouteCreate = ({ paramId }) => {
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [map, setMap] = useState('');
  const [status, setStatus] = useState('');
  const [routes, setRoutes] = useState([]);


  const navigate = useNavigate();

  // fetch data
  const fetchEditData = async () => {
    if (paramId !== undefined) {
      try {
        const response = await fetch(`${config.endpoint}/route/${paramId}/edit`);
        const result = await response.json();
        if (result?.status === 'success') {
          const { data: route } = result || {};
          setName(route?.name);
          setFrom(route?.from);
          setTo(route?.to);
          setDistance(route?.distance);
          setDuration(route?.duration);
          setMap(route?.map);
          setStatus(route?.status);
        } else {
          toast.error(result?.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchRouteList = async () => {
    try {
      const response = await fetch(`${config.endpoint}/route/create`);
      const result = await response.json();
      if (result?.status === 'success') {
        setRoutes(result?.data);
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRouteList();
    fetchEditData();
  }, []);

  // Update name whenever from or to changes
  useEffect(() => {
    if (routes && routes.length > 0) {
      const selectFrom = routes.find(item => item?.id == from);
      const selectTo = routes.find(item => item?.id == to);
      if (selectFrom || selectTo) {
        const fromDestination = selectFrom?.destination || '';
        const toDestination = selectTo?.destination || '';
        setName(`${fromDestination}-${toDestination}`);
      }
    }
  }, [from, to, routes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = paramId == undefined ? await fetch(`${config.endpoint}/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, from, to, distance, duration, map, status }),
      }) : await fetch(`${config.endpoint}/route/${paramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, from, to, distance, duration, map, status }),
      });
      const result = await response.json();
      console.log(result);
      if (result?.status === 'success') {
        if (paramId == undefined) {
          setName("");
          setFrom("");
          setTo("");
          setDistance("");
          setDuration("");
          setMap("");
          setStatus("");
          toast.success("Data Store Successfully!!");
          navigate('/admin/route/list');
        } else {
          toast.success("Data Update Successfully!!")
        }
      } else if (result?.status === 'error') {
        for (const property in result?.data) {
          if (Object.hasOwnProperty.call(result?.data, property)) {
            const errors = result?.data[property];
            toast.error(errors[0]);
          }
        }
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Page pageTitle={`Route`} url={`/admin/route/list`} status="list">
        <form role="form" onSubmit={handleSubmit}>
          <div className="box-body">
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Name<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="name"
                    readOnly
                    className="form-control"
                    placeholder="Route Name"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>From<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <select
                    name="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="form-control"
                  >
                    <option hidden >Select location</option>
                    {routes?.map((item, index) => (
                      <option key={index} value={item?.id}>{item?.destination}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>To<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    name="to"
                    className="form-control"
                  >
                    <option hidden >Select location</option>
                    {routes?.map((item, index) => (
                      <option key={index} value={item?.id}>{item?.destination}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Distance<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input value={distance} onChange={(e) => setDistance(e.target.value)} type="text" name="distance" className="form-control" placeholder="Distance" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Duration<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input value={duration} onChange={(e) => setDuration(e.target.value)} type="text" name="duration" className="form-control" placeholder="Duration" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Google Map<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <textarea value={map} onChange={(e) => setMap(e.target.value)} name="map" placeholder="Google map link" rows="5" className="form-control"></textarea>
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
            <button type="submit" className="btn btn-sm btn-success">{paramId !== undefined ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Page>
    </>
  );
};

export default RouteCreate;
