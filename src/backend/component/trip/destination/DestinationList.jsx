import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import { downloadExcel } from 'react-export-table-to-excel';
import ExampleFile from './file/example.xlsx';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Modal from '../../../partials/_Modal';
import Page from '../../../partials/_Page';
import config from '../../../../config/config';

const DestinationList = () => {

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [perPageLimit, setPerPageLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([
    {
      name: 'Destination',
      selector: row => row.destination,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true
    },
    {
      name: 'Status',
      cell: (row) => (
        <label className="switch">
          <input type="checkbox"
            onChange={(e) => statusHandler(row.id, e)}
            checked={row?.status == 1 ? true : false}
          />
          <span className="slider round"></span>
        </label>),
      button: true,
      allowOverflow: true
    },
    {
      name: 'Action',
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/destination/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => singleItemDeleteHandler(row?.id)} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel export
  const header = ["Destination", "Description", "Status"];
  const body = data?.data?.map(({ id, created_at, updated_at, ...rest }) => rest);
  const excelDownload = () => {
    downloadExcel({
      fileName: "Destination Excel File",
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header,
        body: body,
      },
    });
  }
  // Excel export end

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${config.endpoint}/destination?page=${activePage}&limit=${perPageLimit}&search=${search}`);
      const result = await response.json();
      if (result?.status === 'success') {
        setData(result?.data);
        setPending(false);
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [activePage, perPageLimit, search]);
  // Fetch data end

  // Hooks
  useEffect(() => {
    fetchData();
    setPending(true)
  }, [fetchData]);
  // Hooks end

  // Pagination current page number handler
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }

  // modal
  const modalOpen = () => {
    setModal(pre => !pre)
  }
  // modal end 

  // Excel import
  const handleUpload = async (e) => {
    e.preventDefault();
    setPending(true)
    if (!file) {
      setPending(false)
      toast.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${config.endpoint}/destination/excel-store`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setPending(false)
      fetchData();
      if (result?.status === 'success') {
        toast.success("Data Successfully Import")
        setModal(false);
        setFile(null)
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
      console.log('Upload error:', error);
    }
  };
  // Excel import end

  // File Handler
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // selected row handler
  const handleChange = useCallback(state => {
    setSelectedRows(state?.selectedRows?.map(item => item?.id));
  }, []);


  // multi select data delete handler
  const multiSelectDelete = async () => {
    await deleteHandler(selectedRows.join(','))
    setSelectedRows([]);
  };

  const singleItemDeleteHandler = async (id) => {
    await deleteHandler(id);
  }

  // delete handler
  const deleteHandler = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${config.endpoint}/destination/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const result = await response.json();

          if (result?.status === 'success') {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            fetchData();
          } else {
            toast.error(result?.message)
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // every page data limit handler
  const perPageHandler = (e) => {
    setPerPageLimit(e.target.value)
  }

  // search handler
  const searchHandler = (e) => {
    setSearch(e.target.value)
  }

  // status handler
  const statusHandler = useCallback(async (id, e) => {
    try {
      const response = await fetch(`${config.endpoint}/destination/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: e.target.checked ? "1" : "0" }),
      });
      const result = await response.json();

      if (result?.status === 'success') {
        // Update the data state immutably
        setData(prevData => ({
          ...prevData,
          data: prevData?.data?.map(item =>
            item.id === id ? { ...item, status: e.target.checked ? 0 : 1 } : item
          ),
        }));
        toast.success('Status Updated');
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.log(error);
    }
  }, []);



  return (
    <>
      <Page pageTitle={`Destination`} url={`/admin/destination/create`} status="create">
        <DataTable
          columns={columns}
          data={data}
          handleChange={handleChange}
          pending={pending}
          handlePageChange={handlePageChange}
          multiSelectDelete={multiSelectDelete}
          modalOpen={modalOpen}
          excelDownload={excelDownload}
          perPageLimitHandler={perPageHandler}
          searchHandler={searchHandler}
          perPageLimit={perPageLimit}
          selectedRows={selectedRows}
        />
      </Page>

      {/* import excel */}
      {modal && <Modal modalOpen={modalOpen} headerText={`Import`}>
        <form style={{ marginTop: '10px' }} onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} className='form-control is-invalid' accept='.xlsx' />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button disabled={pending} className='btn btn-primary btn-sm' type="submit">{!pending ? 'Import' : 'Loading...'}</button>
            <a href={ExampleFile}>
              <i className='fa fa-download'></i> Example Excel
            </a>
          </div>
        </form>
      </Modal>}
    </>
  );
};

export default DestinationList;
