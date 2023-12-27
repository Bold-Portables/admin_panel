import React, { useState, useEffect } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../Common/IsLoadingHOC";
import { Link } from "react-router-dom";
import IsLoggedinHOC from "../Common/IsLoggedInHOC";
import {
  CapitalizeFirstLetter,
  getStringDate,
  replaceHyphenCapitolize,
} from "../Helper";
import EditQuotation from "./QuotationManage/EditQuotation";
import EditEventQuotation from "./QuotationManage/EditEventQuotation";
import CancelConfirmationModal from "../Common/CancelConfirmation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveQuotation } from "../Redux/Reducers/appSlice";
interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function Dashboard(props: MyComponentProps) {
  const { setLoading } = props;
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalQuotation, setTotalQuotation] = useState<number>(0);
  const [totalSubscriber, setTotalSubscriber] = useState<number>(0);
  const [totalReqServices, setTotalReqServices] = useState<number>(0);
  const [quotationData, setquotationData] = useState<string[]>([]);

  const [currentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [quotationStatus] = useState<string>("all");
  const [statusName] = useState("");
  const [quotationId, setQuotationId] = useState<string>("");
  const [quotationType, setQuotationType] = useState<string>("");

  const [editModal, setEditModal] = useState<boolean>(false);
  const [editEventModal, setEditEventModal] = useState<boolean>(false);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const viewQuotationDetail = (_id: string, type: string) => {
    dispatch(saveQuotation({ _id, type }));
    navigate("/quotation-detail");
  };
  useEffect(() => {
    getQuotationData();
    getCustomerCount();
    getSubscriberCount();
    getUserRequestedServices();
  }, []);

  const getCustomerCount = async () => {
    setLoading(true);
    await authAxios()
      .get(`/auth/get-all-users?page=${currentPage}&limit=${itemsPerPage}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setTotalCustomers(resData?.total);
          }
        },
        (error) => {
          setLoading(false);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const getQuotationData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `quotation/get-quotation-of-user/${quotationStatus}?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setTotalQuotation(resData?.total);
            setquotationData(resData.quotations);
          }
        },
        (error) => {
          setLoading(false);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const getSubscriberCount = async () => {
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
            setTotalSubscriber(resData?.totalSubscription);
          }
        },
        (error) => {
          setLoading(false);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const getUserRequestedServices = async () => {
    setLoading(true);
    await authAxios()
      .get(`/user-service/list?page=${currentPage}&limit=${itemsPerPage}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            if (resData.pagination && resData.pagination.totalDocuments) {
              setTotalReqServices(resData?.pagination.totalDocuments);
            }
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

  const handleSendInvoice = (
    quotation_id: string,
    type: string,
    status: string
  ) => {
    if (status === "active") {
      toast.warning("User is already subscribed for this quotation");
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
    } else if (status === "completed") {
      return "bg-success";
    } else if (status === "cancelled") {
      return "bg-danger";
    } else {
      return "bg-primary";
    }
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
                    <h3 className="nk-block-title page-title">Dashboard</h3>
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
                          <li className="nk-block-tools-opt">
                            <Link to="/quotations" className="btn btn-primary">
                              <em className="icon ni ni-reports"></em>
                              <span>View All Quotations </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nk-block">
                <div className="row g-gs">
                  <div className="col-xxl-3 col-sm-6">
                    <div className="card">
                      <div className="nk-ecwg nk-ecwg6">
                        <div className="card-inner">
                          <div className="card-title-group">
                            <div className="card-title">
                              <h6 className="title">Customers</h6>
                            </div>
                          </div>
                          <div className="data">
                            <div className="data-group">
                              <div className="amount">{totalCustomers}</div>
                              <div className="nk-ecwg6-ck">
                                <canvas
                                  className="ecommerce-line-chart-s3"
                                  id="todayOrders"
                                ></canvas>
                              </div>
                            </div>
                            <div className="info">
                              <Link to="/customers">
                                <span className="change up text-danger">
                                  More info
                                  <em className="icon ni ni-arrow-long-right"></em>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-sm-6">
                    <div className="card">
                      <div className="nk-ecwg nk-ecwg6">
                        <div className="card-inner">
                          <div className="card-title-group">
                            <div className="card-title">
                              <h6 className="title">Quotations</h6>
                            </div>
                          </div>
                          <div className="data">
                            <div className="data-group">
                              <div className="amount">{totalQuotation}</div>
                              <div className="nk-ecwg6-ck">
                                <canvas
                                  className="ecommerce-line-chart-s3"
                                  id="todayCustomers"
                                ></canvas>
                              </div>
                            </div>
                            <div className="info">
                              <Link to="/quotations">
                                <span className="change up text-danger">
                                  More info
                                  <em className="icon ni ni-arrow-long-right"></em>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-sm-6">
                    <div className="card">
                      <div className="nk-ecwg nk-ecwg6">
                        <div className="card-inner">
                          <div className="card-title-group">
                            <div className="card-title">
                              <h6 className="title">Contracts</h6>
                            </div>
                          </div>
                          <div className="data">
                            <div className="data-group">
                              <div className="amount">{totalSubscriber}</div>
                              <div className="nk-ecwg6-ck">
                                <canvas
                                  className="ecommerce-line-chart-s3"
                                  id="todayVisitors"
                                ></canvas>
                              </div>
                            </div>
                            <div className="info">
                              <Link to="/subscriptions">
                                <span className="change up text-danger">
                                  More info
                                  <em className="icon ni ni-arrow-long-right"></em>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-sm-6">
                    <div className="card">
                      <div className="nk-ecwg nk-ecwg6">
                        <div className="card-inner">
                          <div className="card-title-group">
                            <div className="card-title">
                              <h6 className="title">Service Requests</h6>
                            </div>
                          </div>
                          <div className="data">
                            <div className="data-group">
                              <div className="amount">{totalReqServices}</div>
                              <div className="nk-ecwg6-ck">
                                <canvas
                                  className="ecommerce-line-chart-s3"
                                  id="todayVisitors"
                                ></canvas>
                              </div>
                            </div>
                            <div className="info">
                              <Link to="/service-requests">
                                <span className="change up text-danger">
                                  More info
                                  <em className="icon ni ni-arrow-long-right"></em>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-8">
                    <div className="card card-full">
                      <div className="card-inner">
                        <div className="card-title-group">
                          <div className="card-title">
                            <h6 className="title">Recent Quotations</h6>
                          </div>
                        </div>
                      </div>
                      <div className="nk-tb-list mt-n2">
                        <div className="nk-tb-item nk-tb-head">
                          <div className="nk-tb-col">
                            <span>Order No.</span>
                          </div>
                          <div className="nk-tb-col tb-col-sm">
                            <span>Customer</span>
                          </div>
                          <div className="nk-tb-col tb-col-sm">
                            <span>Phone</span>
                          </div>
                          <div className="nk-tb-col tb-col-md">
                            <span></span>
                            <span>Date</span>
                          </div>
                          <div className="nk-tb-col">
                            <span>Distance From Kelowna</span>
                          </div>
                          <div className="nk-tb-col">
                            <span>Type</span>
                          </div>
                          <div className="nk-tb-col">
                            <span className="d-none d-sm-inline">Status</span>
                          </div>
                          <div className="nk-tb-col tb-col-md">
                            <span className="sub-text">Action</span>
                          </div>
                        </div>
                        {quotationData &&
                          quotationData.length > 0 &&
                          quotationData.slice(0, 10).map((item: any) => (
                            <div key={item._id} className="nk-tb-item">
                                <div className="nk-tb-col">
                              <span
                                style={{ cursor: "pointer" }}
                                className="tb-status text-primary"
                                onClick={() =>
                                  viewQuotationDetail(
                                    item._id,
                                    item.type
                                  )
                                }
                              >
                                {item._id?.slice(-8)?.toUpperCase()}
                              </span>
                            </div>
                              <div className="nk-tb-col tb-col-sm">
                                <div className="user-card">
                                  <div className="user-name">
                                    <span className="tb-lead">
                                      {CapitalizeFirstLetter(
                                        item.coordinator.name
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="nk-tb-col tb-col-md">
                                <span className="tb-sub">
                                  {item.coordinator.cellNumber}
                                </span>
                              </div>
                              <div className="nk-tb-col tb-col-md">
                                <span className="tb-sub">
                                  {getStringDate(item.createdAt)}
                                </span>
                              </div>
                              <div className="nk-tb-col">
                                <span className="tb-sub tb-amount">
                                  {item.distanceFromKelowna} km
                                </span>
                              </div>
                              <div className="nk-tb-col">
                                <span className="tb-sub tb-amount">
                                  {replaceHyphenCapitolize(item.type)}
                                </span>
                              </div>
                              <div className="nk-tb-col">
                                <span
                                  className={`badge badge-dot badge-dot-xs ${setBackgroundColor(
                                    item.status
                                  )} `}
                                >
                                  {CapitalizeFirstLetter(item.status)}
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
                                                    item.quotationType,
                                                    item.status
                                                  )
                                                }
                                              >
                                                <em className="icon ni ni-edit"></em>
                                                <span>Send Invoice</span>
                                              </a>
                                            </li>
                                          )}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(Dashboard));
