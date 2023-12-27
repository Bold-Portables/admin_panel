import React, { useState, useEffect, useRef } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import { Link, useNavigate } from "react-router-dom";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Pagination from "../../Common/Pagination";
import { getFormatedDate, replaceHyphenCapitolize } from "../../Helper";
import SaveLocation from "./SaveLocation";
import UpdateLocation from "./UpdateLocation";
import { CSVLink } from "react-csv";
import ExportConfirmationModal from "../../Common/ConfirmExportModal";
import { saveInvoiceId, saveQuotation } from "../../Redux/Reducers/appSlice";
import { useDispatch } from "react-redux";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  isLoading: boolean;
}

// Export CSV File Headers
const headers = [
  { label: "Customer name", key: "user.name" },
  { label: "Customer Phone number", key: "user.mobile" },
  { label: "Customer Email address", key: "user.email" },
  { label: "Customer address", key: "user.address" },
  { label: "Quotation Type", key: "quotationType" },
  { label: "Status", key: "status" },
  { label: "Created At", key: "createdAt" },
  { label: "Updated At", key: "updatedAt" },
];

function SubscriptionList(props: MyComponentProps) {
  const { setLoading, isLoading } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [saveLocationModal, setSaveLocationModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState("");
  const [statusName, setStatusName] = useState("");
  const [statusLabel, setStatusLabel] = useState("Status");
  const [trackingID, setTrackingID] = useState("");
  const [exportData, setExportData] = useState<any[]>([]);
  const [exportModal, setExportModal] = useState<boolean>(false);
  const csvLink = useRef<any>(null);

  useEffect(() => {
    getSubscriptionListData();
  }, [currentPage, itemsPerPage, statusName]);

  useEffect(() => {
    if (exportData && exportData.length > 0) {
      if (csvLink.current !== null) {
        csvLink.current.link.click();
        toast.success("Data Exported Successfully");
        setExportData([]);
        setExportModal(false);
      }
    }
    dispatch(saveInvoiceId(""));
  }, [exportData]);

  const getSubscriptionListData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `/payment/admin/subscription?status=${statusName}&page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setInvoices(resData.formattedSubscriptions);
            setTotalCount(resData?.totalSubscription);
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.response.data.message);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const getExportingData = async () => {
    let totalRecords: any[] = [];
    for (let i = 1; i <= Math.ceil(totalCount / 10000); i++) {
      setLoading(true);
      await authAxios()
        .get(
          `/payment/admin/subscription?status=${statusName}&page=${i}&limit=${10000}`
        )
        .then(
          (response) => {
            setLoading(false);
            if (response.data.status === 1) {
              const resData = response.data.data?.formattedSubscriptions;
              totalRecords.push(...resData);
            }
          },
          (error) => {
            setLoading(false);
            toast.error(error.response.data?.message);
          }
        )
        .catch((error) => {
          console.log("error", error);
        });
    }
    setExportData(totalRecords);
  };

  const handleSaveLocationModal = (data: string) => {
    setInvoiceData(data);
    setSaveLocationModal(true);
  };

  const handleUpdateLocationModal = (tracking_id: string) => {
    setTrackingID(tracking_id);
    setEditModal(true);
  };

  const handleChangeStatus = (name: string, label: string) => {
    setCurrentPage(1);
    setStatusName(name);
    setStatusLabel(label);
  };

  const handleAutoAssign = async (quoteId: string, quoteType: string) => {
    const payload = {
      quotationId: quoteId,
      quotationType: quoteType,
    };
    setLoading(true);
    await authAxios()
      .post(`/inventory/auto-assign-qrcode-to-quote`, payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data?.message);
          } else {
            toast.error(response.data?.message);
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.response.data?.message);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const viewInvoiceRedirection = (invoiceId: string) => {
    dispatch(saveInvoiceId(invoiceId));
    navigate("/invoice-detail");
  };

  const viewQuotationInventory = (_id: string, type: string) => {
    dispatch(saveQuotation({ _id, type }));
    navigate("/quotation-inventories");
  };

  return (
    <>
      <div className="nk-content">
        <div className="container-fluid">
          <div className="nk-content-inner">
            <div className="nk-content-body">
              <div className="nk-block-head nk-block-head-sm">
                <div className="nk-block-between">
                  <div className="nk-block-head-content">
                    <h3 className="nk-block-title page-title">Contracts</h3>
                  </div>
                  <div className="nk-block-head-content">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <a
                        href="#"
                        className="btn btn-icon btn-trigger toggle-expand me-n1"
                        data-target="more-options"
                      >
                        <em className="icon ni ni-more-v"></em>
                      </a>
                      <div
                        className="toggle-expand-content"
                        data-content="more-options"
                      >
                        <ul className="nk-block-tools g-3">
                          <li>
                            <div className="drodown">
                              <a
                                href="#"
                                className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                                data-bs-toggle="dropdown"
                              >
                                {statusLabel}
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <ul className="link-list-opt no-bdr">
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleChangeStatus("", "Status")
                                      }
                                    >
                                      <span>All</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleChangeStatus("ACTIVE", "Active")
                                      }
                                    >
                                      <span>Active</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleChangeStatus(
                                          "INACTIVE",
                                          "Inactive"
                                        )
                                      }
                                    >
                                      <span>Completed</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li className="nk-block-tools-opt">
                            <button
                              type="button"
                              onClick={() => setExportModal(true)}
                              disabled={isLoading || !totalCount}
                              className="btn btn-primary d-none d-md-inline-flex"
                            >
                              <em className="icon ni ni-download"></em>
                              <span>
                                {" "}
                                {isLoading ? "Loading..." : "Export"}
                              </span>
                            </button>
                            <CSVLink
                              className="csv-link"
                              target="_blank"
                              ref={csvLink}
                              headers={headers}
                              data={exportData}
                              filename="Subscriptions"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nk-block">
                <div className="nk-tb-list is-separate mb-3">
                  <div className="nk-tb-item nk-tb-head">
                    <div className="nk-tb-col">
                      <span className="sub-text">ID</span>
                    </div>
                    <div className="nk-tb-col">
                      <span className="sub-text">Customer</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Phone</span>
                    </div>

                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Email</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Assigned</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Quotation Type</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Date</span>
                    </div>
                    {/* <div className="nk-tb-col">
                      <span className="sub-text">QR Code</span>
                    </div> */}
                    <div className="nk-tb-col ">
                      <span className="sub-text">Status</span>
                    </div>
                    <div className="nk-tb-col">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {invoices &&
                    invoices.length > 0 &&
                    invoices.map((item: any, index) => (
                      <div key={index + 1} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <a onClick={() => viewInvoiceRedirection(item._id)}>
                            <span className="tb-status text-primary">
                              {item.subscription?.slice(-8)?.toUpperCase()}
                            </span>
                          </a>
                        </div>
                        <div className="nk-tb-col capitalize">
                          <span>{item.user && item.user?.name}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{item?.user.mobile}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span>{item?.user.email}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span
                            className={`tb-status ${
                              item?.assignedInventoriesCount > 0
                                ? "text-success"
                                : "text-warning"
                            }`}
                          >
                            {item?.assignedInventoriesCount > 0 ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span>
                            {replaceHyphenCapitolize(item?.quotationType)}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span>{getFormatedDate(item.createdAt)}</span>
                        </div>
                        {/* <div className="nk-tb-col">
                          <img
                            style={{ width: "40%" }}
                            src={item?.qrCode}
                            alt="QR Code"
                          />
                        </div> */}
                        <div className="nk-tb-col">
                          <span className="tb-odr-status">
                            <span
                              className={`badge badge-dot ${
                                item.status === "ACTIVE"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {item.status === "ACTIVE"
                                ? item.status
                                : "Completed"}
                            </span>
                          </span>
                        </div>
                        <div className="nk-tb-col nk-tb-col-tools">
                          <ul className="gx-1">
                            <li>
                              <div className="drodown">
                                <a
                                  className="dropdown-toggle btn btn-icon btn-trigger"
                                  data-bs-toggle="dropdown"
                                >
                                  <em className="icon ni ni-more-h"></em>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <ul className="link-list-opt no-bdr">
                                    {item.status === "ACTIVE" ? (
                                      item.trackingId ? (
                                        <li>
                                          <a
                                            onClick={() =>
                                              handleUpdateLocationModal(
                                                item.trackingId
                                              )
                                            }
                                          >
                                            <em className="icon ni ni-edit"></em>
                                            <span>Update Location</span>
                                          </a>
                                        </li>
                                      ) : (
                                        <li>
                                          <a
                                            onClick={() =>
                                              handleSaveLocationModal(item)
                                            }
                                          >
                                            <em className="icon ni ni-plus-circle"></em>
                                            <span>Save Location</span>
                                          </a>
                                        </li>
                                      )
                                    ) : null}
                                    {item.status === "ACTIVE" &&
                                      item?.assignedInventoriesCount < 1 && (
                                        <li>
                                          <Link
                                            to={`/assign-qr-code?quoteId=${item.quotationId}&quoteType=${item?.quotationType}`}
                                          >
                                            <em className="icon ni ni-move"></em>
                                            <span>Assign Inventory</span>
                                          </Link>
                                        </li>
                                      )}

                                    {/* {item.status === "ACTIVE" && (
                                      <li>
                                        <a
                                          onClick={() =>
                                            handleAutoAssign(
                                              item.quotationId,
                                              item.quotationType
                                            )
                                          }
                                        >
                                          <em className="icon ni ni-move"></em>
                                          <span>Auto Assign</span>
                                        </a>
                                      </li>
                                    )} */}

                                    <li>
                                      <a
                                        onClick={() =>
                                          viewInvoiceRedirection(item._id)
                                        }
                                      >
                                        <em className="icon ni ni-eye"></em>
                                        <span>View Invoice</span>
                                      </a>
                                    </li>
                                    {item?.assignedInventoriesCount > 0 && (
                                      <li>
                                        <a
                                          onClick={() =>
                                            viewQuotationInventory(
                                              item.quotationId,
                                              item.quotationType
                                            )
                                          }
                                        >
                                          <em className="icon ni ni-eye"></em>
                                          <span>View Inventory</span>
                                        </a>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
                {invoices && invoices.length > 0 && totalCount > 0 && (
                  <Pagination
                    totalCount={totalCount}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onChangePageLimit={(page: number) => setItemPerPage(page)}
                    resData={invoices}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {saveLocationModal && (
        <SaveLocation
          invoiceData={invoiceData}
          modal={saveLocationModal}
          getListingData={getSubscriptionListData}
          closeModal={(isModal: boolean) => setSaveLocationModal(isModal)}
        />
      )}
      {editModal && (
        <UpdateLocation
          trackingID={trackingID}
          modal={editModal}
          getListingData={getSubscriptionListData}
          closeModal={(isModal: boolean) => setEditModal(isModal)}
        />
      )}
      <ExportConfirmationModal
        modal={exportModal}
        closeModal={(isModal: boolean) => setExportModal(isModal)}
        handleExportData={getExportingData}
      />
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(SubscriptionList));
