import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Pagination from "../../Common/Pagination";
import { getFormatedDate, replaceHyphenCapitolize } from "../../Helper";
import CreateFormModal from "./Create";
import EditFormModal from "./Edit";
import DeleteConfirmationModal from "../../Common/DeleteConfirmation";
import { Link, useNavigate } from "react-router-dom";
import { saveInventory } from "../../Redux/Reducers/appSlice";
import { useDispatch } from "react-redux";
import { handleDownloadQRCode } from "../../utils";
import MoveConfirmationModal from "../../Common/MoveConfirmation";
interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function InventoryList(props: MyComponentProps) {
  const { setLoading } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [listData, setListData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [moveModal, setMoveModal] = useState(false);
  const [elementData, setElementData] = useState(null);
  const [elementID, setElementID] = useState<string>("");
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterName, setFilterName] = useState("productName");

  useEffect(() => {
    getInventoryListData();
  }, [currentPage, itemsPerPage, status]);

  useEffect(() => {
    dispatch(saveInventory(null));
  }, []);

  const getInventoryListData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `/inventory/get-qr-code-details-status?status=${status}&page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setListData(resData.qrCodes);
            setTotalCount(resData?.totalCount);
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

  const handleCreateModal = () => {
    setAddModal(true);
  };

  const handleEditModal = (data: any) => {
    setElementData(data);
    setEditModal(true);
  };

  const handleDeleteModal = (_id: string) => {
    setElementID(_id);
    setDeleteModal(true);
  };

  const handleMoveModal = (_id: string) => {
    setElementID(_id);
    setMoveModal(true);
  };

  function getSVGContentFromDataURL(dataUrl:string) {
    const prefix = "data:image/svg+xml;utf8,";
    return dataUrl.startsWith(prefix)
      ? decodeURIComponent(dataUrl.slice(prefix.length))
      : null;
  }

  const handleDeleteItem = async () => {
    setLoading(true);
    await authAxios()
      .delete(`/inventory/delete-inventory-details/${elementID}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data?.message);
            setDeleteModal(false);
            getInventoryListData();
            setListData(response.data?.inventories);
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
            getInventoryListData();
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

  const changeStatus = (name: string) => {
    setCurrentPage(1);
    setStatus(name);
  };

  const changeFilter = (name: string) => {
    setCurrentPage(1);
    setFilterName(name);
  };

  const getStatusName = (status: string) => {
    if (status === "pending") {
      return "Unassigned ";
    } else if (status === "active") {
      return "Assigned";
    } else if (status === "completed") {
      return "Under Maintance";
    } else {
      return status;
    }
  };

  const getQuotationTypeByLink = (qrCodeValue: string, status: string) => {
    if (qrCodeValue && status === "active") {
      const str = qrCodeValue;
      const quoteIdRegex = /quotationType=([^&]+)/;
      const match = str.match(quoteIdRegex);
      const quotationType = match ? match[1] : null;
      return quotationType;
    }
  };

  const handleViewInventoryDetails = (item: any) => {
    if (item.status !== "pending") {
      dispatch(saveInventory(item));
      navigate(`/inventory-detail`);
    }
  };


const getFilterDetails=(filterName:string)=>{
    if (filterName === "productName") {
      return "Name ";
    } else if (filterName === "category") {
      return "Category";
    } else if (filterName === "type") {
      return "Type";
    } else if (filterName === "gender") {
      return "Gender";
    } else if (filterName === "status") {
      return "Status";
    } else if (filterName === "qrId") {
      return "QR ID";
    } else {
      return filterName;
    }
  }
  const handleSearch=async()=>{
    setLoading(true);
    await authAxios().get(`/inventory/list-by-qr-id?${filterName}=${searchText}&page=1&limit=10`)
      .then(
        (response :any) => {
          setLoading(false);
          if (response.data.status === 1) {
            setMoveModal(false);
            if(response?.data?.data?.inventories.length===0){
              toast.error("No record found");
            }else{
              toast.success(response.data?.message);
              setListData(response?.data?.data?.inventories)
            }
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
  }

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
                      Inventory Management
                    </h3>

                    <div data-content="more-options" className="d-flex align-items-center gap-3 h-auto mt-3">
                      <ul className="select--dropdown">
                        <li>
                          <div className="drodown">
                            <a
                              href="#"
                              className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                              data-bs-toggle="dropdown"
                            >
                              {getFilterDetails(filterName) || "Name"}
                            </a>
                            <div className="dropdown-menu dropdown-menu-start">
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <a onClick={() => changeFilter("productName")}>
                                    <span>Name</span>
                                  </a>
                                </li>
                                <li>
                                  <a onClick={() => changeFilter("gender")}>
                                    <span>Gender</span>
                                  </a>
                                </li>
                                <li>
                                  <a onClick={() => changeFilter("type")}>
                                    <span>Type</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() => changeFilter("category")}
                                  >
                                    <span>Category</span>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() => changeFilter("status")}
                                  >
                                    <span>Status</span>
                                  </a>
                                </li>
                                
                                <li>
                                  <a
                                    onClick={() => changeFilter("qrId")}
                                  >
                                    <span>QR ID</span>
                                  </a>
                                </li>

                              </ul>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <div className="search--customer mt-0">
                        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        <button onClick={handleSearch} className="btn">Search</button>
                      </div>
                    </div>


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
                                {getStatusName(status) || "View all"}
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <ul className="link-list-opt no-bdr">
                                  <li>
                                    <a onClick={() => changeStatus("")}>
                                      <span>View all</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a onClick={() => changeStatus("active")}>
                                      <span>Assigned</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a onClick={() => changeStatus("pending")}>
                                      <span>Unassigned</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      onClick={() => changeStatus("completed")}
                                    >
                                      <span>Under Maintance</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li className="nk-block-tools-opt">
                            <a
                              data-target="addProduct"
                              className="toggle btn btn-icon btn-primary d-md-none"
                            >
                              <em className="icon ni ni-plus"></em>
                            </a>
                            <a
                              onClick={handleCreateModal}
                              data-target="addProduct"
                              className="toggle btn btn-primary d-none d-md-inline-flex"
                            >
                              <em className="icon ni ni-plus"></em>
                              <span>Create</span>
                            </a>
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
                    <div className="nk-tb-col hide-sm-nk">
                      <span className="sub-text">Product Name</span>
                    </div>
                    <div className="nk-tb-col hide-sm-nk">
                      <span className="sub-text">Category</span>
                    </div>
                    <div className="nk-tb-col hide-sm-nk">
                      <span className="sub-text">Inventory Type</span>
                    </div>
                    <div className="nk-tb-col hide-sm-nk">
                      <span className="sub-text">Gender</span>
                    </div>
                    <div className="nk-tb-col">
                      <span>Assigned To</span>
                    </div>
                    <div className="nk-tb-col hide-sm-nk">
                      <span className="sub-text">Created At</span>
                    </div>
                    <div className="nk-tb-col">
                      <span>Status</span>
                    </div>
                    <div className="nk-tb-col hide-sm-nk">
                      <span className="sub-text">QR code</span>
                    </div>
                    <div className="nk-tb-col">
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
                              onClick={() => handleViewInventoryDetails(item)}
                              className="tb-status text-primary"
                            >
                              {item.qrId?.slice(-8)?.toUpperCase()}
                            </span>
                          </a>
                        </div>
                        <div className="nk-tb-col capitalize hide-sm-nk">
                          <span>
                            {replaceHyphenCapitolize(item?.productName)}
                          </span>
                        </div>
                        <div className="nk-tb-col capitalize hide-sm-nk">
                          <span>{item?.category}</span>
                        </div>
                        <div className="nk-tb-col capitalize hide-sm-nk">
                          <span>{item.type}</span>
                        </div>
                        <div className="nk-tb-col capitalize hide-sm-nk">
                          <span>{item?.gender}</span>
                        </div>
                        {item.status === "active" ? (
                          <div className="nk-tb-col capitalize">
                            <span className="tb-status text-info">
                              {getQuotationTypeByLink(
                                item?.qrCodeValue,
                                item.status
                              )}
                            </span>
                          </div>
                        ) : (
                          <div className="nk-tb-col capitalize">
                            <span className="tb-status text-warning">N/A</span>
                          </div>
                        )}
                        <div className="nk-tb-col hide-sm-nk">
                          <span>{getFormatedDate(item.createdAt)}</span>
                        </div>
                        <div className="nk-tb-col">
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
                        {
                          item.status === "pending" ? (
                            <div className="nk-tb-col hide-sm-nk" style={{width: '150px'}}>
                              <a
                                href={item?.qrCode}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownloadQRCode(
                                    item?.qrCode,
                                    `qr_code_${item?._id}.svg`
                                  );
                                }}
                                download={`qr_code_${item?._id}.svg`}
                              >
                                <div dangerouslySetInnerHTML={{ __html: getSVGContentFromDataURL(item?.qrCode) || '' }} />
                                {/* <p className="text-center">{item.qrId}</p> */}

                              </a>
                            </div>
                          ) : (
                            <div className="nk-tb-col hide-sm-nk">
                              <div dangerouslySetInnerHTML={{ __html: getSVGContentFromDataURL(item?.qrCode) || '' }} />
                              {/* <p>{item.qrId}</p> */}
                            </div>
                          )
                        }

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
                                    <li>
                                      <a onClick={() => handleEditModal(item)}>
                                        <em className="icon ni ni-edit"></em>
                                        <span>Edit</span>
                                      </a>
                                    </li>
                                    {item.status === "pending" && (
                                      <li>
                                        <a
                                          className="cursor_ponter"
                                          onClick={() =>
                                            handleDeleteModal(item._id)
                                          }
                                        >
                                          <em className="icon ni ni-trash"></em>
                                          <span>Remove</span>
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
      {addModal && (
        <CreateFormModal
          modal={addModal}
          getListingData={getInventoryListData}
          closeModal={(isModal: boolean) => setAddModal(isModal)}
        />
      )}
      {editModal && (
        <EditFormModal
          elementData={elementData}
          modal={editModal}
          getListingData={getInventoryListData}
          closeModal={(isModal: boolean) => setEditModal(isModal)}
        />
      )}
      {deleteModal && (
        <DeleteConfirmationModal
          modal={deleteModal}
          closeModal={(isModal: boolean) => setDeleteModal(isModal)}
          confirmedDelete={handleDeleteItem}
          actionType="production"
        />
      )}
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

export default IsLoadingHOC(IsLoggedinHOC(InventoryList));
