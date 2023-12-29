import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import { downloadExcel } from 'react-export-table-to-excel';
import ExampleFile from './file/example.xlsx';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Modal from '../../../partials/_Modal';
import Page from '../../../partials/_Page';

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
      selector: row => row.status,
      sortable: true
    },
    {
      name: 'Action',
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin`}>Edit</Link><Link className='btn btn-xs btn-danger' to={`/admin`}>Delete</Link></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);
  // api endpoint
  const endpoint = process.env.REACT_APP_API_ENDPOINT;

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
      const response = await fetch(`${endpoint}/destination?page=${activePage}&limit=${perPageLimit}&search=${search}`);
      const resData = await response.json();
      setData(resData?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setPending(false);
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
      const response = await fetch(`${endpoint}/destination/excel-store`, {
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
          await fetch(`${endpoint}/destination/1`, {
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
