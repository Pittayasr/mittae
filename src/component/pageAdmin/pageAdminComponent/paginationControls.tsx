import React from "react";
import { Pagination } from "react-bootstrap";

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5; // จำนวนหน้าที่จะแสดง (รวมหน้าปัจจุบัน)

    if (totalPages <= maxVisiblePages) {
      // ถ้าจำนวนหน้าน้อยกว่าหรือเท่ากับ maxVisiblePages ให้แสดงทุกหน้า
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      // แสดงหน้าต้น, ... , ปัจจุบัน, ... , หน้าสุดท้าย
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

      if (currentPage < totalPages - 2) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <Pagination className="custom-pagination justify-content-center">
      <Pagination.First
        onClick={() => onPageChange(1)} // ไปหน้าสุด
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      />
      {getPageNumbers().map((page, index) => (
        <Pagination.Item
          key={index}
          active={page === currentPage}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page === "string"}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)} // ไปหน้าหลังสุด
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default PaginationControls;
