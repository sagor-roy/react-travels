// useRouteOperations.js
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import config from '../config/config';
import { useBackendConext } from '../context/BackendContext';

const useBackendApi = () => {
    const { state, dispatch } = useBackendConext();
    const { activePage, perPageLimit, search } = state;
    const { pendingHandler } = dispatch;
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
    }, []);

    return { data, fetchData, deleteHandler };
};

export default useBackendApi;
