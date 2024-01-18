import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../partials/_Page';
import toast from 'react-hot-toast';
import config from '../../../../config/config';
import { useEffect } from 'react';

const VehicleCreate = ({ paramId }) => {
  const navigate = useNavigate();
  const [regis, setRegis] = useState("");
  const [type, setType] = useState("");
  const [engine_no, setEngineNo] = useState("");
  const [model_no, setModelNo] = useState("");
  const [chasis_no, setChasisNo] = useState("");
  const [owner, setOwner] = useState("");
  const [owner_phone, setOwnerPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");

  // fetch data
  const fetchData = async () => {
    if (paramId !== undefined) {
      try {
        const response = await fetch(`${config.endpoint}/vehicle/${paramId}/edit`);
        const result = await response.json();
        if (result?.status === 'success') {
          console.log(response);
          setRegis(result?.data?.regis)
          setType(result?.data?.type)
          setEngineNo(result?.data?.engine_no)
          setModelNo(result?.data?.model_no)
          setChasisNo(result?.data?.chasis_no)
          setOwner(result?.data?.owner)
          setOwnerPhone(result?.data?.owner_phone)
          setBrand(result?.data?.brand)
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
      const response = paramId == undefined ? await fetch(`${config.endpoint}/vehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regis, type, engine_no, model_no, chasis_no, owner, owner_phone, brand, status }),
      }) : await fetch(`${config.endpoint}/vehicle/${paramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regis, type, engine_no, model_no, chasis_no, owner, owner_phone, brand, status }),
      });
      const result = await response.json();
      if (result?.status === 'success') {
        if (paramId == undefined) {
          setRegis("")
          setType("")
          setEngineNo("")
          setModelNo("")
          setChasisNo("")
          setOwner("")
          setOwnerPhone("")
          setBrand("")
          setStatus("")
          toast.success("Data Store Successfully!!");
          navigate('/admin/vehicle/list');
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
      <Page pageTitle={`Vehicle`} url={`/admin/vehicle/list`} status="list">
        <form role="form" onSubmit={handleSubmit}>
          <div className="box-body">
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Registration No<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" onChange={(e) => setRegis(e.target.value)} value={regis} className="form-control" placeholder="Registration No" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Fleet Type<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="form-control">
                    <option value="1">AC (16)</option>
                    <option value="2">NON-AC (16)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Engine No<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" value={engine_no} onChange={(e) => setEngineNo(e.target.value)} name="engine_no" className="form-control" placeholder="Engine No" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Model No<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" value={model_no} onChange={(e) => setModelNo(e.target.value)} name="model_no" className="form-control" placeholder="Model No" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Chasis No<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" value={chasis_no} onChange={(e) => setChasisNo(e.target.value)} name="chasis_no" className="form-control" placeholder="Chasis No" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Owner<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} name="owner" className="form-control" placeholder="Owner name" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Owner Phone<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" value={owner_phone} onChange={(e) => setOwnerPhone(e.target.value)} name="owner_phone" className="form-control" placeholder="Phone No" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Brand Name<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} name="brand" className="form-control" placeholder="Brand Name" />
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

export default VehicleCreate;
