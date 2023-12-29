import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import { downloadExcel } from 'react-export-table-to-excel';
import ExampleFile from './file/example.xlsx';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Modal from '../../../partials/_Modal';

const columns = [
  {
    name: 'Title',
    selector: row => row.title,
    sortable: true,
  },
  {
    name: 'Year',
    selector: row => row.year,
    sortable: true
  },
  {
    name: 'Action',
    cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin`}>Edit</Link><Link className='btn btn-xs btn-danger' to={`/admin`}>Edit</Link></>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const DestinationList = () => {

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [perPageLimit, setPerPageLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [file, setFile] = useState(null);
  // api endpoint
  const endpoint = process.env.REACT_APP_API_ENDPOINT;

  // Excel export
  const header = ["title", "year"];
  const body = data?.data?.map(({ id, created_at, updated_at, ...rest }) => rest);
  const excelDownload = () => {
    downloadExcel({
      fileName: "name of file",
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
      const response = await fetch(`${endpoint}/test?page=${activePage}&limit=${perPageLimit}&search=${search}`);
      const resData = await response.json();
      setPending(false);
      setData(resData);
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
      await fetch(`${endpoint}/excel-store`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      fetchData();
      setPending(false)
      toast.success("Data Successfully Import")
      setModal(false);
      setFile(null)
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
          await fetch(`${endpoint}/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedRows }),
          });

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });

          fetchData();
          setSelectedRows([]);
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // every page data limit handler
  const perPageHandler = (e) => {
    setPerPageLimit(e.target.value)
  }

  // search handler
  const searchHandler = (e) => {
    setSearch(e.target.value)
  }


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

        </div>
      </section>

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
