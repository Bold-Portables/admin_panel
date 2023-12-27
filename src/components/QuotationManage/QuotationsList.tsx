import React, { useState, useEffect } from "react";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import EditQuotation from "./EditQuotation";
import EditEventQuotation from "./EditEventQuotation";
import Pagination from "../../Common/Pagination";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFormatedDate, replaceHyphenCapitolize } from "../../Helper";
import CancelConfirmationModal from "../../Common/CancelConfirmation";
import { saveQuotation } from "../../Redux/Reducers/appSlice";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

const QuotationsList = (props: MyComponentProps) => {
  const { setLoading } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [quotationData, setquotationData] = useState<any[]>([]);
  const [quotationId, setQuotationId] = useState<string>("");
  const [quotationType, setQuotationType] = useState<string>("");

  const [editModal, setEditModal] = useState<boolean>(false);
  const [editEventModal, setEditEventModal] = useState<boolean>(false);
  const [cancelModal, setCancelModal] = useState<boolean>(false);

  const [quotationLabel, setQuotationLabel] = useState<string>("All");
  const [quotationCategory, setQuotationCategory] = useState<string>("all");

  useEffect(() => {
    getQuotationData();
  }, [currentPage, quotationCategory, itemsPerPage]);

  const getQuotationData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `quotation/get-quotation-of-user/${quotationCategory}?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setTotalCount(resData?.total);
            setquotationData(resData.quotations);
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

  const handleCancelQuotation = async () => {
    const payload = { quotationId, quotationType };
    setLoading(true);
    await authAxios()
      .post("quotation/cancel-quotation", payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data.message);
            setCancelModal(false);
            getQuotationData();
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.response.data.message);
        }
      )
      .catch((error) => {
        setLoading(false);
      });
  };

  const onChangeQuotationType = (status: string, label: string) => {
    setQuotationCategory(status);
    setQuotationLabel(label);
  };

  const handleSendInvoice = (
    quotation_id: string,
    type: string,
    status: string
  ) => {
    if (status === "active") {
      toast.warning("User has subscribed this quotation");
    } else if (status === "completed") {
      toast.warning("This quotation is completed");
    } else {
      setQuotationId(quotation_id);
      setQuotationType(type);
      if (type === "event") {
        setEditEventModal(true);
      } else {
        setEditModal(true);
      }
    }
  };

  const handleCancelModal = (_id: string, quoteType: string) => {
    setQuotationId(_id);
    setQuotationType(quoteType);
    setCancelModal(true);
  };

  const setBackgroundColor = (status: string) => {
    if (status === "pending") {
      return "bg-warning";
    } else if (status === "active") {
      return "bg-success";
    } else if (status === "cancelled") {
      return "bg-danger";
    } else if (status === "completed") {
      return "bg-success";
    } else {
      return "bg-primary";
    }
  };

  const viewQuotationDetail = (_id: string, type: string) => {
    dispatch(saveQuotation({ _id, type }));
    navigate("/quotation-detail");
  };

  return (
    <div className="nk-content">
      <div className="container-fluid">
        <div className="nk-content-inner">
          <div className="nk-content-body">
            <div className="nk-block-head nk-block-head-sm">
              <div className="nk-block-between">
                <div className="nk-block-head-content">
                  <h3 className="nk-block-title page-title">Quotations</h3>
                </div>
                <div className="nk-block-head-content">
                  <div className="toggle-wrap nk-block-tools-toggle">
                    <a
                      href="#"
                      className="btn btn-icon btn-trigger toggle-expand me-n1"
                      data-target="pageMenu"
                    >
                      <em className="icon ni ni-more-v"></em>
                    </a>
                    <div
                      className="toggle-expand-content"
                      data-content="pageMenu"
                    >
                      <ul className="nk-block-tools g-3">
                        <li>
                          <div className="drodown">
                            <a
                              href="#"
                              className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                              data-bs-toggle="dropdown"
                            >
                              {quotationLabel}
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType("all", "All")
                                    }
                                  >
                                    <span>All</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType(
                                        "construction",
                                        "Construction"
                                      )
                                    }
                                  >
                                    <span>Construction</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType(
                                        "farm-orchard-winery",
                                        "Farm Orchard Winery"
                                      )
                                    }
                                  >
                                    <span>Farm Orchard Winery</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType(
                                        "recreational-site",
                                        "Recreational Site"
                                      )
                                    }
                                  >
                                    <span>Recreational Site</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType(
                                        "personal-or-business",
                                        "Personal Or Business"
                                      )
                                    }
                                  >
                                    <span>Personal Or Business</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType(
                                        "event",
                                        "Special Events"
                                      )
                                    }
                                  >
                                    <span>Special Events</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      onChangeQuotationType(
                                        "disaster-relief",
                                        "Disaster Relief"
                                      )
                                    }
                                  >
                                    <span>Disaster Relief</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nk-block">
              <div className="nk-tb-list is-separate is-medium mb-3">
                <div className="nk-tb-item nk-tb-head">
                  <div className="nk-tb-col">
                    <span className="sub-text">ID</span>
                  </div>
                  <div className="nk-tb-col">
                    <span>Customer Name</span>
                  </div>
                  <div className="nk-tb-col tb-col-md">
                    <span>Customer Email</span>
                  </div>
                  <div className="nk-tb-col tb-col-md">
                    <span>Distance</span>
                  </div>
                  <div className="nk-tb-col tb-col-md">
                    <span>Total Workers</span>
                  </div>
                  <div className="nk-tb-col tb-col-md">
                    <span>Quotation Type</span>
                  </div>
                  <div className="nk-tb-col">
                    <span>Status</span>
                  </div>
                  <div className="nk-tb-col tb-col-md">
                    <span>Created At</span>
                  </div>
                  <div className="nk-tb-col">
                    <span className="sub-text">Action</span>
                  </div>
                </div>
                {quotationData &&
                  quotationData.length > 0 &&
                  quotationData
                    .filter(
                      (item) =>
                        item.status === "pending" || item.status === "cancelled"
                    )
                    .map((item: any, index: number) => (
                      <div key={item._id} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <a
                            onClick={() =>
                              viewQuotationDetail(item._id, item.type)
                            }
                          >
                            <span className="tb-status text-primary">
                              {item._id?.slice(-8)?.toUpperCase()}
                            </span>
                          </a>
                        </div>
                        <div className="nk-tb-col capitalize">
                          <span className="tb-sub">
                            {item.coordinator && item.coordinator?.name}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-sub">
                            {item.coordinator?.email}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-sub">
                            {item?.distanceFromKelowna} km
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-sub">{item?.totalWorkers}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md capitalize">
                          <span className="tb-sub">
                            {item.quotationType &&
                              replaceHyphenCapitolize(item.quotationType)}
                          </span>
                        </div>
                        <div className="nk-tb-col capitalize">
                          <span className="tb-odr-status">
                            <span
                              className={`badge badge-dot ${setBackgroundColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-sub">
                            {getFormatedDate(item.createdAt)}
                          </span>
                        </div>
                        <div className="nk-tb-col nk-tb-col-tools">
                          <ul className="gx-1">
                            <li>
                              <div className="drodown me-n1">
                                <a
                                  href="#"
                                  className="dropdown-toggle btn btn-icon btn-trigger"
                                  data-bs-toggle="dropdown"
                                >
                                  <em className="icon ni ni-more-h"></em>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <ul className="link-list-opt no-bdr">
                                    {item.status === "pending" && (
                                      <li>
                                        <a
                                          onClick={() =>
                                            handleSendInvoice(
                                              item._id,
                                              item.type,
                                              item.status
                                            )
                                          }
                                        >
                                          <em className="icon ni ni-edit"></em>
                                          <span>Send Invoice</span>
                                        </a>
                                      </li>
                                    )}
                                    <li>
                                      <a
                                        onClick={() =>
                                          viewQuotationDetail(
                                            item._id,
                                            item.type
                                          )
                                        }
                                      >
                                        <em className="icon ni ni-eye"></em>
                                        <span>View Quotation</span>
                                      </a>
                                    </li>

                                    {item.status === "pending" && (
                                      <li>
                                        <a
                                          onClick={() =>
                                            handleCancelModal(
                                              item._id,
                                              item.type
                                            )
                                          }
                                        >
                                          <em className="icon ni ni-cross-circle"></em>
                                          <span>Cancel</span>
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
              {quotationData && quotationData.length > 0 && totalCount > 0 && (
                <Pagination
                  totalCount={totalCount}
                  onPageChange={(page: number) => setCurrentPage(page)}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onChangePageLimit={(page: number) => setItemPerPage(page)}
                  resData={quotationData}
                />
              )}
              {editModal && (
                <EditQuotation
                  quotationId={quotationId}
                  quotationType={quotationType}
                  modal={editModal}
                  getListingData={getQuotationData}
                  closeModal={(isModal: boolean) => setEditModal(isModal)}
                />
              )}
              {editEventModal && (
                <EditEventQuotation
                  quotationId={quotationId}
                  quotationType={quotationType}
                  modal={editEventModal}
                  getListingData={getQuotationData}
                  closeModal={(isModal: boolean) => setEditEventModal(isModal)}
                />
              )}
              {cancelModal && (
                <CancelConfirmationModal
                  modal={cancelModal}
                  closeModal={(isModal: boolean) => setCancelModal(isModal)}
                  handleSubmit={handleCancelQuotation}
                  actionType="Quotation"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsLoadingHOC(IsLoggedinHOC(QuotationsList));
