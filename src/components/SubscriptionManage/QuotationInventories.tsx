import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Pagination from "../../Common/Pagination";
import MoveConfirmationModal from "../../Common/MoveConfirmation";
import { getFormatedDate, replaceHyphenCapitolize } from "../../Helper";
import { Link} from "react-router-dom";
import { saveInventory } from "../../Redux/Reducers/appSlice";
import { useDispatch } from "react-redux";
import { saveQuotation } from "../../Redux/Reducers/appSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/rootReducer";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function QuotationInventoryList(props: MyComponentProps) {
  const { setLoading } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listData, setListData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [elementID, setElementID] = useState<string>("");
  const [moveModal, setMoveModal] = useState(false);
  const { quotation } = useSelector((state: RootState) => state.app);


  useEffect(() => {
    if (quotation && quotation._id && quotation.type) {
      getInventoryListData(quotation._id, quotation.type);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    dispatch(saveInventory(null));
  }, []);

  const getInventoryListData = async (_id: string, type: string) => {
    const payload = {
      quotationId: _id,
      quotationType: type,
      page: currentPage,
      limit: itemsPerPage,
    };
    setLoading(true);
    await authAxios()
      .post(`/inventory/find-by-qrcodes-quote-type-id`, payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setListData(resData.inventories);
            setTotalCount(resData?.pagination.totalItems);
          } else {
            toast.error(response.data.message);
            setListData([]);
            setTotalCount(0);
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.response.data.message);
          setListData([]);
          setTotalCount(0);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const setBackgroundColor = (status: string) => {
    if (status === "pending") {
      return "bg-success";
    } else if (status === "active") {
      return "bg-warning";
    } else if (status === "cancelled") {
      return "bg-danger";
    } else if (status === "completed") {
      return "bg-success";
    } else {
      return "bg-primary";
    }
  };

  const getStatusName = (status: string) => {
    if (status === "pending") {
      return "Available";
    } else if (status === "active") {
      return "Assigned";
    } else if (status === "completed") {
      return "Under Maintance";
    } else {
      return status;
    }
  };

  const getSeconLastdValueWithStr = (qrCodeValue: string, status: string) => {
    if (qrCodeValue && status === "active") {
      const str = qrCodeValue
      const quoteIdRegex = /quotationType=([^&]+)/;
      const match = str.match(quoteIdRegex);
      const quotationType = match ? match[1] : null;
      return quotationType;
    }
  };

  const viewQuotationDetail = (_id: string, type: string) => {
    dispatch(saveQuotation({ _id, type }));
    navigate("/quotation-detail");
  };

  const handleViewInventoryDetails = (item: any) => {
    if (item.status !== "pending") {
      dispatch(saveInventory(item));
      navigate(`/inventory-detail`);
    }
  };

  const handleViewInventoryServices = (item: any) => {
    if (item.status !== "pending") {
      dispatch(saveInventory(item));
      navigate(`/inventory-service-requests`);
    }
  };

  const handleMoveModal = (_id: string) => {
    setElementID(_id);
    setMoveModal(true);
  };

  const handleMoveeItem = async () => {
    const payload = { inventory_id: elementID };
    setLoading(true);
    await authAxios()
      .post(`/inventory/reinitialize-qr-code-value`, payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data?.message);
            setMoveModal(false);
            getInventoryListData(quotation._id, quotation.type);
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

  function getSVGContentFromDataURL(dataUrl: string) {
    const prefix = "data:image/svg+xml;utf8,";

    const svgContent = dataUrl.startsWith(prefix)
        ? decodeURIComponent(dataUrl.slice(prefix.length))
        : null;

    if (svgContent) {
        const modifiedSVGContent = svgContent.replace(/<text.*?<\/text>/g, '');

        return modifiedSVGContent;
    }

    return null;
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
                    <h3 className="nk-block-title page-title">
                    Inventory Assigned
                    </h3>
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
                        <li className="nk-block-tools-opt">
                            <Link to = "/subscriptions"
                              data-target="Back"
                              className="toggle btn btn-primary d-none d-md-inline-flex"
                            >
                              <em className="icon ni ni-back-arrow"></em>
                              <span>Back</span>
                            </Link>
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
                      <span className="sub-text">Product Name</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Category</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Type</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Gender</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span>Quotation</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Created At</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Service Requests</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span>Status</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">QR code</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {listData &&
                    listData.length > 0 &&
                    listData.map((item: any, index) => (
                      <div key={index + 1} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <a>
                            <span
                              className="tb-status text-primary"
                            >
                              {item._id?.slice(-8)?.toUpperCase()}
                            </span>
                          </a>
                        </div>
                        <div className="nk-tb-col tb-col-lg capitalize">
                          <span>
                            {replaceHyphenCapitolize(item?.productName)}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-lg capitalize">
                          <span>{item?.category}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg capitalize">
                          <span>{item.type}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg capitalize">
                          <span>{item?.gender}</span>
                        </div>
                        {item.status === "active" && (
                          <div className="nk-tb-col tb-col-lg capitalize">
                              <a
                                onClick={() =>
                                  viewQuotationDetail(item.quote_id, item.quote_type)
                                }
                              >
                              <span className="tb-status text-primary">
                                {item.quote_id?.slice(-8)?.toUpperCase()}
                              </span>
                            </a>
                          </div>
                        )}
                        <div className="nk-tb-col tb-col-lg">
                          <span>{getFormatedDate(item.createdAt)}</span>
                        </div>
                        {item.status === "active" &&
                          item.serviceRequestCount ? (
                          <div className="nk-tb-col capitalize text-center">
                            <span className="tb-status text-info">
                              { item.serviceRequestCount }
                            </span>
                          </div>
                        ) : (
                          <div className="nk-tb-col capitalize text-center">
                            <span className="tb-status text-info">
                              0
                            </span>
                          </div>
                        )}
                        <div className="nk-tb-col tb-col-sm">
                          <span className="tb-odr-status">
                            <span
                              className={`badge badge-dot ${setBackgroundColor(
                                item.status
                              )}`}
                            >
                              {getStatusName(item.status)}
                            </span>
                          </span>
                        </div>
                        <div className="nk-tb-col">
                            <div className=" hide-sm-nk">
                              <div className="h-110px w-110px" dangerouslySetInnerHTML={{ __html: getSVGContentFromDataURL(item?.qrCode) || '' }} />
                              { <p className="text-center">{item.qrId}</p> }
                            </div>
                        </div>      

                        <div className="nk-tb-col nk-tb-col-tools">
                          <ul className="gx-1">
                            <li>
                              <div className="drodown">
                                <a
                                  href="#"
                                  className="dropdown-toggle btn btn-icon btn-trigger"
                                  data-bs-toggle="dropdown"
                                >
                                  <em className="icon ni ni-more-h"></em>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <ul className="link-list-opt no-bdr">
                                    {item.status !== "pending" && (
                                      <li>
                                        <a
                                          className="cursor_ponter"
                                          onClick={() =>
                                            handleViewInventoryDetails(item)
                                          }
                                        >
                                          <em className="icon ni ni-eye"></em>
                                          <span>View Detail</span>
                                        </a>
                                      </li>
                                    )}
                                    {item.status === "active" &&
                                      item.serviceRequestCount > 0 && (
                                      <li>
                                        <a
                                          className="cursor_ponter"
                                          onClick={() =>
                                            handleViewInventoryServices(item)
                                          }
                                        >
                                          <em className="icon ni ni-inbox"></em>
                                          <span>Service Requests</span>
                                        </a>
                                      </li>
                                    )}
                                    {item.status === "active" && (
                                      <li>
                                        <a
                                          className="cursor_ponter"
                                          onClick={() =>
                                            handleMoveModal(item._id)
                                          }
                                        >
                                          <em className="icon ni ni-move"></em>
                                          <span>Move</span>
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
                {listData && listData.length > 0 && totalCount > 0 && (
                  <Pagination
                    totalCount={totalCount}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onChangePageLimit={(page: number) => setItemPerPage(page)}
                    resData={listData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {moveModal && (
        <MoveConfirmationModal
          modal={moveModal}
          closeModal={(isModal: boolean) => setMoveModal(isModal)}
          handleSubmit={handleMoveeItem}
          actionType="production"
        />
      )}
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(QuotationInventoryList));
