import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Pagination from "../../Common/Pagination";
import { getFormatedDate, replaceHyphenCapitolize } from "../../Helper";
import AddService from "./AddService";
import EditService from "./EditService";
import DeleteConfirmationModal from "../../Common/DeleteConfirmation";
import { limitDesc } from "../../Helper/constants";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function ServicesList(props: MyComponentProps) {
  const { setLoading } = props;
  const [services, setServices] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [addServiceModal, setAddServiceModal] = useState<boolean>(false);
  const [editServiceModal, setEditServiceModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [serviceItem, setServiceItem] = useState(null);
  const [serviceID, setServiceID] = useState<string>("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getServicesListData();
    getCategoryData();
  }, [currentPage, itemsPerPage]);



  const getCategoryData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `/service-category/list?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            console.log(resData.serviceCategories,"Nihaihih")
            setCategories(resData);
          } else {
            toast.error(response.data.message);
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

  const getServicesListData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/service/list?page=${currentPage}&limit=${itemsPerPage}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setServices(resData.services);
            setTotalCount(resData?.totalCount);
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

  const handleAddServiceModal = () => {
    setAddServiceModal(true);
  };

  const handleUpdateServiceModal = (data: any) => {
    setServiceItem(data);
    setEditServiceModal(true);
  };

  const handleDeleteModal = (_id: string) => {
    setServiceID(_id);
    setDeleteModal(true);
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    await authAxios()
      .delete(`/service/delete/${serviceID}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data?.message);
            setDeleteModal(false);
            getServicesListData();
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

  return (
    <>
      <div className="nk-content">
        <div className="container-fluid">
          <div className="nk-content-inner">
            <div className="nk-content-body">
              <div className="nk-block-head nk-block-head-sm">
                <div className="nk-block-between">
                  <div className="nk-block-head-content">
                    <h3 className="nk-block-title page-title">Service Management</h3>
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
                        {services && services.length < 6 &&  <ul className="nk-block-tools g-3">
                          <li className="nk-block-tools-opt">
                            <a
                              data-target="addProduct"
                              className="toggle btn btn-icon btn-primary d-md-none"
                            >
                              <em className="icon ni ni-plus"></em>
                            </a>
                            <a
                              onClick={handleAddServiceModal}
                              data-target="addProduct"
                              className="toggle btn btn-primary d-none d-md-inline-flex"
                            >
                              <em className="icon ni ni-plus"></em>
                              <span>Add Service</span>
                            </a>
                          </li>
                        </ul>}
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
                      <span className="sub-text">Service Name</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Service Requirement</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Description</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Created At</span>
                    </div>
                    <div className="nk-tb-col">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {services &&
                    services.length > 0 &&
                    services.map((item: any, index) => (
                      <div key={index + 1} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-status text-primary">
                            {item._id?.slice(-8)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="nk-tb-col">
                          <div className="user-card">
                            <div className="user-info">
                              <span className="tb-lead">
                                {replaceHyphenCapitolize(item?.name)}
                                <span className="dot dot-success d-md-none ms-1"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          {item.categories &&
                            item.categories.length > 0 &&
                            item.categories.map((element: string , index2 : number) => (
                              <React.Fragment key={index2}>
                                <span>{element}</span>
                                <br />
                              </React.Fragment>
                            ))}
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>
                            {` ${
                              item.description
                                ? item.description?.substring(0, limitDesc)
                                : ""
                            } ${
                              item.description &&
                              item.description.length > limitDesc
                                ? "..."
                                : ""
                            }  `}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{getFormatedDate(item.createdAt)}</span>
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
                                    <li>
                                      <a
                                        onClick={() =>
                                          handleUpdateServiceModal(item)
                                        }
                                      >
                                        <em className="icon ni ni-edit"></em>
                                        <span>Edit Service</span>
                                      </a>
                                    </li>
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
                                  </ul>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
                {services && services.length > 0 && (
                  <Pagination
                    totalCount={totalCount}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onChangePageLimit={(page: number) => setItemPerPage(page)}
                    resData={services}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {addServiceModal && (
        <AddService
          modal={addServiceModal}
          getListingData={getServicesListData}
          closeModal={(isModal: boolean) => setAddServiceModal(isModal)}
        />
      )}
      {editServiceModal && (
        <EditService
          itemData={serviceItem}
          modal={editServiceModal}
          getListingData={getServicesListData}
          closeModal={(isModal: boolean) => setEditServiceModal(isModal)}
        />
      )}
      {deleteModal && (
        <DeleteConfirmationModal
          modal={deleteModal}
          closeModal={(isModal: boolean) => setDeleteModal(isModal)}
          confirmedDelete={handleDeleteItem}
          actionType="service"
        />
      )}
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(ServicesList));
