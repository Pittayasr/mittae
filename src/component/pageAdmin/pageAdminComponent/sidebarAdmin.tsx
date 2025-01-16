import React, { useState } from "react";
// import { useMediaQuery } from "react-responsive";
// import { IoMdClose } from "react-icons/io";
import {
  FaSortAmountDownAlt,
  FaSortAmountUp,
  FaSearch,
  FaCaretDown,
  FaCaretRight,
  FaBars,
} from "react-icons/fa";
import TextSelect from "../../textFillComponent/textSelect";
import DateInput from "../../textFillComponent/dateInput";
import {
  Row,
  Col,
  Button,
  ToggleButton,
  CloseButton,
  Overlay,
  Popover,
} from "react-bootstrap";
import { Dayjs } from "dayjs";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (value: string) => void;
  onFilterStatus: (value: string) => void;
  onFilterProvince: (value: string) => void;
  onFilterExtra: (value: string) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onMultiSelect: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  isMultiSelectMode: boolean;
  onLogout: () => void;
  filterType: string;
  filterStatus: string;
  filterProvince: string;
  filterExtra: string;
  filterOptions: { value: string; label: string }[];
  filterProvinceOptions: { value: string; label: string }[];
  filterExtraOptions: { value: string; label: string }[];
  filterLabel: string;
  filterProvinceLabel: string;
  filterExtraLabel: string;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDateRangeFilter: () => void;
  formType: "insuranceAdmin" | "deliveryAdmin" | "transportAdmin" | "other"; // เพิ่ม prop นี้
}

const SidebarAdmin: React.FC<SidebarProps> = ({
  onFilter,
  onFilterStatus,
  onFilterProvince,
  onFilterExtra,
  onSort,
  sortField,
  sortOrder,
  onMultiSelect,
  onSelectAll,
  isAllSelected,
  isMultiSelectMode,
  onLogout,
  filterType,
  filterStatus,
  filterProvince,
  filterExtra,
  filterOptions,
  filterProvinceOptions,
  filterExtraOptions,
  filterLabel,
  filterProvinceLabel,
  filterExtraLabel,
  onStartDateChange,
  onEndDateChange,
  startDate,
  endDate,
  onDateRangeFilter,
  formType,
}) => {
  // const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  const togglePopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setTarget(event.currentTarget as HTMLDivElement);
    setIsOpen(!isOpen);
  };

  const [showMoreDashboards, setShowMoreDashboards] = useState(true);
  const [showMoreFunctions, setShowMoreFunctions] = useState(false);

  const popoverContent = (
    <Popover id="popover-sidebar-admin" className="popover-sidebar">
      <Popover.Body className="p-1">
        <div>
          <div>
            {/* Header */}
            <div className="d-flex justify-content-between mb-0">
              <p className="text-success mb-0" style={{ fontSize: "24px" }}>
                เมนู
              </p>
              <CloseButton
                onClick={() => setIsOpen(false)}
                className="d-flex align-item-center"
                style={{ cursor: "pointer", margin: "5px 0px 0px 0px" }}
              ></CloseButton>
            </div>
            <hr />
            <div className="mb-3">
              <Button
                variant={showMoreDashboards ? "success" : "outline-success"}
                onClick={() => setShowMoreDashboards((prev) => !prev)}
                className="responsive-label text-start w-100"
              >
                แดชบอร์ดอื่นๆ{" "}
                {showMoreDashboards ? <FaCaretDown /> : <FaCaretRight />}
              </Button>
            </div>

            <div
              key={`dashboard-${showMoreDashboards ? "show" : "hide"}`}
              className={`dashboard-list-dashboards ${
                showMoreDashboards ? "show" : "hide"
              }`}
            >
              <ul className="nav nav-pills flex-column  mb-auto">
                <li>
                  <Button
                    variant="outline-success"
                    className="responsive-label text-start mb-3 w-100"
                    onClick={() =>
                      window.location.assign("/delivery_admin_2[sru)x3X[SD")
                    }
                  >
                    Drop off Flash + SPX + ไปรษณีย์ไทย
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline-success"
                    className="responsive-label text-start mb-3 w-100"
                    onClick={() =>
                      window.location.assign("/form_admin_hc{SlU(.'rhA")
                    }
                  >
                    พรบ. ต่อภาษีรถ
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline-success"
                    className="responsive-label text-start mb-3 w-100"
                    onClick={() => window.location.assign("/transport")}
                  >
                    ส่งรถส่งของกลับบ้าน หมา แมว ฯลฯ
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline-success"
                    className="responsive-label text-start mb-3 w-100"
                    onClick={() => window.location.assign("/print")}
                  >
                    ติดต่อลูกค้า
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline-success"
                    className="responsive-label text-start mb-5 w-100"
                    onClick={() =>
                      window.location.assign("/insurance_admin_yKLwO~{WoOL(")
                    }
                  >
                    ประกันภัย ป1 ป2 ป3 ป4 ป5
                  </Button>
                </li>
              </ul>
            </div>

            {/* More Functions for Mobile */}

            <div>
              <Button
                variant={showMoreFunctions ? "success" : "outline-success"}
                onClick={() => setShowMoreFunctions((prev) => !prev)}
                className="responsive-label text-start mb-3 w-100"
              >
                ฟังก์ชันกรองข้อมูลอื่นๆ{" "}
                {showMoreFunctions ? <FaCaretDown /> : <FaCaretRight />}
              </Button>
            </div>

            {/* Filter */}

            <div
              className={`dashboard-list-functions ${
                showMoreFunctions ? "show" : "hide"
              }`}
            >
              {showMoreFunctions && (
                <div>
                  <div className="mb-3">
                    <TextSelect
                      label={filterLabel}
                      id="filterSelect"
                      placeholder="เลือก..."
                      options={filterOptions}
                      value={filterType || ""}
                      onChange={(value) => onFilter(value || "")}
                    />
                  </div>
                  <div className="mb-3">
                    <TextSelect
                      label={filterProvinceLabel}
                      id="filterSelect"
                      placeholder="เลือก..."
                      options={filterProvinceOptions}
                      value={filterProvince || ""}
                      onChange={(value) => onFilterProvince(value || "")}
                    />
                  </div>
                  {/* ช่อง textSelect เฉพาะ insuranceAdmin และ deliveryAdmin */}
                  {(formType === "insuranceAdmin" ||
                    formType === "deliveryAdmin" ||
                    formType === "transportAdmin") && (
                    <div className="mb-3">
                      <TextSelect
                        label={filterExtraLabel}
                        id="extraFilter"
                        placeholder="เลือก..."
                        options={filterExtraOptions}
                        value={filterExtra || ""}
                        onChange={(value) => onFilterExtra(value || "")}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <TextSelect
                      label="กรองตามสถานะ"
                      id="filterByStatus"
                      placeholder="เลือก..."
                      options={[
                        { value: "", label: "ทั้งหมด" },
                        {
                          value: "อยู่ระหว่างดำเนินการ",
                          label: "อยู่ระหว่างดำเนินการ",
                        },
                        { value: "สำเร็จแล้ว", label: "สำเร็จแล้ว" },
                        {
                          value: "รอเอกสารเพิ่มเติม",
                          label: "รอเอกสารเพิ่มเติม",
                        },
                      ]}
                      value={filterStatus || ""}
                      onChange={(value) => onFilterStatus(value || "")}
                    />
                  </div>
                  {/* Date Filters */}
                  <div className="mb-3 ">
                    <Col className="mb-3">
                      <DateInput
                        imgPath=""
                        // placement="bottom"
                        label="วันที่เริ่มต้น"
                        onDateChange={onStartDateChange}
                        value={startDate}
                      />
                    </Col>

                    <Col className="mb-3">
                      <DateInput
                        imgPath=""
                        // placement="bottom"
                        label="วันที่สิ้นสุด"
                        onDateChange={onEndDateChange}
                        value={endDate}
                      />
                    </Col>
                    <Col className="mt-3 d-flex justify-content-start ">
                      <Button
                        variant="success"
                        onClick={onDateRangeFilter}
                        className="responsive-label"
                      >
                        <FaSearch />
                      </Button>
                      <Button
                        className="mx-2 responsive-label"
                        variant="secondary"
                        onClick={() => {
                          onStartDateChange(null);
                          onEndDateChange(null);
                          onFilter("");
                          onFilterProvince("");
                          onFilterStatus("");
                          onFilterExtra("");
                        }}
                      >
                        ล้างค่า
                      </Button>
                    </Col>
                  </div>
                  <div>
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
                          variant={
                            isMultiSelectMode ? "secondary" : "outline-success"
                          }
                          className="responsive-label mb-3 w-100"
                          onClick={onMultiSelect}
                        >
                          {isMultiSelectMode
                            ? "ยกเลิกเลือกหลายรายการ"
                            : "เลือกหลายรายการ"}
                        </Button>
                      </li>
                      {isMultiSelectMode && (
                        <li>
                          <Button
                            variant="outline-success"
                            className="responsive-label mb-3 w-100"
                            onClick={onSelectAll}
                          >
                            {isAllSelected
                              ? "ยกเลิกการเลือกทั้งหมด"
                              : "เลือกทั้งหมด"}
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="mt-5">
              <Button
                variant="outline-danger"
                className="responsive-label w-100 mb-3"
                onClick={onLogout}
              >
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div
      className="sidebar-admin-popover-container"
      style={{ position: "relative" }}
    >
      <div
        className="menu-icon-container"
        onClick={togglePopover}
        style={{ cursor: "pointer" }}
      >
        <FaBars size={24} />
      </div>

      {/* Overlay สำหรับควบคุมการเปิด/ปิด Popover */}
      <Overlay
        target={target}
        show={isOpen}
        placement="bottom"
        containerPadding={10}
      >
        {popoverContent}
      </Overlay>
    </div>
  );
};

export default SidebarAdmin;
