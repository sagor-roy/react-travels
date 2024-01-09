import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../partials/_Page';
import toast from 'react-hot-toast';
import config from '../../../../config/config';
import { useEffect } from 'react';

const FleetCreate = ({ paramId }) => {
  const [type, setType] = useState('');
  const [layout, setLayout] = useState('');
  const [seat, setSeat] = useState('');
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // fetch data
  const fetchData = async () => {
    if (paramId !== undefined) {
      try {
        const response = await fetch(`${config.endpoint}/fleet/${paramId}/edit`);
        const result = await response.json();
        if (result?.status === 'success') {
          setType(result?.data?.type)
          setLayout(result?.data?.layout)
          setSeat(result?.data?.seat)
          setTotal(result?.data?.total)
          setStatus(result?.data?.status)
        } else {
          toast.error(result?.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = paramId == undefined ? await fetch(`${config.endpoint}/fleet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, layout, seat, total, status }),
      }) : await fetch(`${config.endpoint}/fleet/${paramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, layout, seat, total, status }),
      });
      const result = await response.json();
      if (result?.status === 'success') {
        if (paramId == undefined) {
          toast.success("Data Store Successfully!!");
          navigate('/admin/fleet/list');
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

  const handleSeatChange = (e) => {
    const newSeatValue = e.target.value;
    setSeat(newSeatValue);
    setTotal(newSeatValue.split(" ").filter((element) => element.trim() !== '').length);
  };

  return (
    <>
      <Page pageTitle={`Fleet`} url={`/admin/fleet/list`} status="list">
        <form role="form" onSubmit={handleSubmit}>
          <div className="box-body">
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Fleet Type<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="type"
                    placeholder='Fleet Type'
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Layouts<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <select value={layout} onChange={(e) => setLayout(e.target.value)} name="layout" className="form-control">
                    <option hidden>Select layouts</option>
                    <option value="1-1">1-1</option>
                    <option value="2-2">2-2</option>
                    <option value="3-3">3-3</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Seat Number<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <textarea
                    name="seat"
                    placeholder="Example:A1 A2 B1 B2"
                    rows="5"
                    className="form-control"
                    defaultValue={seat}
                    onChange={handleSeatChange}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Total Seat<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    readOnly
                    name="total"
                    className="form-control"
                    value={total}
                  />
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

export default FleetCreate;
