// DataContext.js
import React, { createContext, useCallback, useContext, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';

const BackendContext = createContext();

const BackendProvider = ({ children }) => {
    const [activePage, setActivePage] = useState(1);
    const [perPageLimit, setPerPageLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [pending, setPending] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [file, setFile] = useState(null);

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

    // excel download
    const excelDownload = (obj) => {
        const { fileName, header, body } = obj;
        downloadExcel({
            fileName,
            sheet: "react-export-table-to-excel",
            tablePayload: { header, body, }
        });
    }

    const state = {
        activePage,
        perPageLimit,
        search,
        pending,
        selectedRows,
        modal,
        file
    }

    const dispatch = {
        modalOpen,
        handlePageChange,
        perPageLimitHandler,
        searchHandler,
        pendingHandler,
        handleChange,
        excelDownload,
        handleFileChange
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
