import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    const handleLimitChange = useCallback((newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    }, []);

    const updatePaginationData = useCallback(({ total, totalPages: pages }) => {
        setTotalItems(total);
        setTotalPages(pages);
    }, []);

    return {
        page,
        limit,
        totalPages,
        totalItems,
        handlePageChange,
        handleLimitChange,
        updatePaginationData
    };
}; 