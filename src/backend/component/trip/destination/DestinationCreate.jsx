import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../partials/_Page';
import toast from 'react-hot-toast';
import config from '../../../../config/config';
import { useEffect } from 'react';

const DestinationCreate = ({ paramId }) => {
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // fetch data
  const fetchData = async () => {
    if (paramId !== undefined) {
      try {
        const response = await fetch(`${config.endpoint}/destination/${paramId}/edit`);
        const result = await response.json();
        if (result?.status === 'success') {
          setDestination(result?.data?.destination)
          setDescription(result?.data?.description)
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
      const response = paramId == undefined ? await fetch(`${config.endpoint}/destination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, description, status }),
      }) : await fetch(`${config.endpoint}/destination/${paramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, description, status }),
      });
      const result = await response.json();
      if (result?.status === 'success') {
        if (paramId == undefined) {
          setDestination("");
          setDescription("");
          setStatus("");
          toast.success("Data Store Successfully!!");
          navigate('/admin/destination/list');
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
      <Page pageTitle={`Destination`} url={`/admin/destination/list`} status="list">
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
                  <label>Description:</label>
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
            <button type="submit" className="btn btn-sm btn-success">{paramId !== undefined ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Page>
    </>
  );
};

export default DestinationCreate;
