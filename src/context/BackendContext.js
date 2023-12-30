// DataContext.js
import React, { createContext, useCallback, useContext, useState } from 'react';

const BackendContext = createContext();

const BackendProvider = ({ children }) => {
    const [activePage, setActivePage] = useState(1);
    const [perPageLimit, setPerPageLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [pending, setPending] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [file, setFile] = useState(null);
    const [modal, setModal] = useState(false);

    // modal open
    const modalOpen = () => {
        setModal(pre => !pre)
    }
    // modal open
    const pendingHandler = (status) => {
        setPending(status);
    }
    // Pagination current page number handler
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }
    // every page data limit handler
    const perPageLimitHandler = (e) => {
        setPerPageLimit(e.target.value)
    }
    // search handler
    const searchHandler = (e) => {
        setSearch(e.target.value)
    }
    // File Handler
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    // selected row handler
    const handleChange = useCallback(state => {
        setSelectedRows(state?.selectedRows?.map(item => item?.id));
        
    }, []);

    console.log(selectedRows);


    const state = {
        activePage,
        perPageLimit,
        search,
        pending,
        selectedRows,
        file,
        modal
    }

    const dispatch = {
        modalOpen,
        handlePageChange,
        perPageLimitHandler,
        searchHandler,
        pendingHandler,
        handleFileChange,
        handleChange
    }

    return (
        <BackendContext.Provider value={{ state, dispatch }}>
            {children}
        </BackendContext.Provider>
    );
};

const useBackendConext = () => {
    return useContext(BackendContext);
};

export { BackendProvider, useBackendConext };
