import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaSortAmountDownAlt, FaSortAmountUp, FaSearch } from "react-icons/fa";
import TextSelect from "../../textFillComponent/textSelect";
import DateInput from "../../textFillComponent/dateInput";
import { Row, Col, Button, ToggleButton } from "react-bootstrap";
import { Dayjs } from "dayjs";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (value: string) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onMultiSelect: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  isMultiSelectMode: boolean;
  onLogout: () => void;
  filterType: string;
  filterOptions: { value: string; label: string }[];
  filterLabel: string;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDateRangeFilter: () => void;
}

const SidebarAdmin: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onFilter,
  onSort,
  sortField,
  sortOrder,
  onMultiSelect,
  onSelectAll,
  isAllSelected,
  isMultiSelectMode,
  onLogout,
  filterType,
  filterOptions,
  filterLabel,
  onStartDateChange,
  onEndDateChange,
  startDate,
  endDate,
  onDateRangeFilter,
}) => {
  return (
    <div className={`sidebar-admin ${isOpen ? "open" : ""}`}>
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary h-100">
        {/* Header */}
        <div className="d-flex justify-content-between mb-0">
          <p className="text-success mb-0" style={{ fontSize: "24px" }}>
            เมนู
          </p>
          <IoMdClose
            onClick={onClose}
            size={28}
            style={{ cursor: "pointer" }}
          />
        </div>
        <hr />

        {/* Filter */}
        <div className="mb-3">
          <TextSelect
            label={filterLabel}
            id="filterSelect"
            options={filterOptions}
            value={filterType || ""}
            onChange={(value) => onFilter(value || "")}
          />
        </div>

        <div className="mb-3">
          <TextSelect
            label="กรองตามสถานะ"
            id="filterByStatus"
            options={[
              { value: "", label: "ทั้งหมด" },
              { value: "อยู่ระหว่างดำเนินการ", label: "อยู่ระหว่างดำเนินการ" },
              { value: "สำเร็จแล้ว", label: "สำเร็จแล้ว" },
              { value: "รอเอกสารเพิ่มเติม", label: "รอเอกสารเพิ่มเติม" },
            ]}
            value={filterType}
            onChange={(value) => onFilter(value || "")}
          />
        </div>

        {/* Date Filters */}
        <div className="mb-3 ">
          <Col className="mb-3">
            <DateInput
              labelText="วันที่เริ่มต้น"
              onDateChange={onStartDateChange}
              value={startDate}
            />
          </Col>

          <Col className="mb-3">
            <DateInput
              labelText="วันที่สิ้นสุด"
              onDateChange={onEndDateChange}
              value={endDate}
            />
          </Col>
          <Col className="mt-3 d-flex justify-content-start">
            <Button variant="success" onClick={onDateRangeFilter}>
              <FaSearch /> ค้นหา
            </Button>
            <Button
              className="mx-2"
              variant="secondary"
              onClick={() => {
                onStartDateChange(null);
                onEndDateChange(null);
              }}
            >
              ล้างค่า
            </Button>
          </Col>
        </div>

        {/* Sort Buttons */}
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Row>
              <Col>
                <ToggleButton
                  type="radio"
                  name="sort-options"
                  id="sort-uploadTime"
                  value="uploadTime"
                  variant="outline-success"
                  className="responsive-label mb-3 w-100"
                  onClick={() => onSort("uploadTime")}
                  checked={sortField === "uploadTime"}
                >
                  เรียงตามเวลาส่งข้อมูล{" "}
                  {sortField === "uploadTime" &&
                    (sortOrder === "asc" ? (
                      <FaSortAmountDownAlt />
                    ) : (
                      <FaSortAmountUp />
                    ))}
                </ToggleButton>
              </Col>
              <Col>
                <ToggleButton
                  type="radio"
                  name="sort-options"
                  id="sort-totalCost"
                  value="totalCost"
                  variant="outline-success"
                  className="responsive-label mb-3 w-100"
                  onClick={() => onSort("totalCost")}
                  checked={sortField === "totalCost"}
                >
                  เรียงตามยอดชำระ{" "}
                  {sortField === "totalCost" &&
                    (sortOrder === "asc" ? (
                      <FaSortAmountDownAlt />
                    ) : (
                      <FaSortAmountUp />
                    ))}
                </ToggleButton>
              </Col>
            </Row>
          </li>
          <li>
            <Button
              variant={isMultiSelectMode ? "secondary" : "outline-success"}
              className="responsive-label mb-2 w-100"
              onClick={onMultiSelect}
            >
              {isMultiSelectMode ? "ยกเลิกเลือกหลายรายการ" : "เลือกหลายรายการ"}
            </Button>
          </li>
          {isMultiSelectMode && (
            <li>
              <Button
                variant="outline-success"
                className="responsive-label mb-2 w-100"
                onClick={onSelectAll}
              >
                {isAllSelected ? "ยกเลิกการเลือกทั้งหมด" : "เลือกทั้งหมด"}
              </Button>
            </li>
          )}
        </ul>

        {/* Logout */}
        <div className="mt-auto">
          <Button
            variant="outline-danger"
            className="responsive-label w-100"
            onClick={onLogout}
          >
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
