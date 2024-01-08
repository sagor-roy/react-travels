import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../partials/_Page';
import toast from 'react-hot-toast';
import config from '../../../../config/config';
import { useEffect } from 'react';

const ScheduleCreate = ({ paramId }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const navigate = useNavigate();

  // fetch data
  const fetchData = async () => {
    if (paramId !== undefined) {
      try {
        const response = await fetch(`${config.endpoint}/schedule/${paramId}/edit`);
        const result = await response.json();
        if (result?.status === 'success') {
          setStart(result?.data?.start)
          setEnd(result?.data?.end)
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
      const response = paramId == undefined ? await fetch(`${config.endpoint}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end }),
      }) : await fetch(`${config.endpoint}/schedule/${paramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end, }),
      });
      const result = await response.json();
      if (result?.status === 'success') {
        if (paramId == undefined) {
          setStart("");
          setEnd("");
          toast.success("Data Store Successfully!!");
          navigate('/admin/schedule/list');
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
      <Page pageTitle={`Schedule`} url={`/admin/schedule/list`} status="list">
        <form role="form" onSubmit={handleSubmit}>
          <div className="box-body">
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>Start<sup className="text-danger">*</sup> :</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="time"
                    name="start"
                    className="form-control"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label>End:</label>
                </div>
                <div className="col-md-10">
                <input
                    type="time"
                    name="end"
                    className="form-control"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
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

export default ScheduleCreate;
