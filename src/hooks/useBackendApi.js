// useRouteOperations.js
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import config from '../config/config';
import { useBackendConext } from '../context/BackendContext';

const useBackendApi = () => {
    const { state, dispatch } = useBackendConext();
    const { activePage, perPageLimit, search, file } = state;
    const { pendingHandler, modalOpen } = dispatch;
    const [data, setData] = useState([]);

    const fetchData = useCallback(async (urlPath) => {
        try {
            pendingHandler(true);
            const response = await fetch(`${config.endpoint}/${urlPath}?page=${activePage}&limit=${perPageLimit}&search=${search}`);
            const result = await response.json();
            if (result?.status === 'success') {
                setData(result?.data);
                pendingHandler(false)
            } else {
                toast.error(result?.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [activePage, perPageLimit, search]);

    const deleteHandler = useCallback(async (id, urlPath) => {
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
                    const response = await fetch(`${config.endpoint}/${urlPath}/${id}`, {
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
                        fetchData(urlPath);
                    } else {
                        toast.error(result?.message);
                    }
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }, [fetchData]);

    const handleUpload = useCallback(async (e, urlPath) => {
        e.preventDefault();
        pendingHandler(true)
        if (!file) {
            pendingHandler(false)
            toast.error('No file selected');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${config.endpoint}/${urlPath}/excel-store`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result?.status === 'success') {
                pendingHandler(false)
                fetchData(urlPath);
                toast.success("Data Successfully Import")
                modalOpen();
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
    }, [modalOpen, fetchData, file]);

    // status handler
    const statusHandler = useCallback(async (urlPath, id, e) => {
        try {
            const response = await fetch(`${config.endpoint}/${urlPath}/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: e.target.checked ? "1" : "0" }),
            });
            const result = await response.json();

            if (result?.status === 'success') {
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

    return { data, fetchData, deleteHandler, handleUpload, statusHandler };
};

export default useBackendApi;
