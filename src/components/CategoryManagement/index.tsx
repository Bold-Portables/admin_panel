import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Pagination from "../../Common/Pagination";
import { getFormatedDate } from "../../Helper";
import CreateFormModal from "./Create";
import EditFormModal from "./Edit";
import DeleteConfirmationModal from "../../Common/DeleteConfirmation";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function CategoryList(props: MyComponentProps) {
  const { setLoading } = props;
  const [listData, setListData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [elementData, setElementData] = useState(null);
  const [elementID, setElementID] = useState<string>("");

  useEffect(() => {
    getCategoryListData();
  }, [currentPage, itemsPerPage]);

  const getCategoryListData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `/inventory-category/get-category-list?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setListData(resData);
            // setTotalCount(resData?.totalCategories);
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

  const handleDeleteItem = async () => {
    setLoading(true);
    await authAxios()
      .delete(`/inventory-category/delete-category-list/${elementID}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data?.message);
            setDeleteModal(false);
            getCategoryListData();
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
                    <h3 className="nk-block-title page-title">
                      Category Management
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
                    <div className="nk-tb-col">
                      <span className="sub-text">Category Name</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Created at</span>
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
                          <span className="tb-status text-primary">
                            {item._id?.slice(-8)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="nk-tb-col">
                          <div className="user-card">
                            <div className="user-info">
                              <span className="tb-lead">
                                {item?.category}
                                <span className="dot dot-success d-md-none ms-1"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{getFormatedDate(item?.createdAt)}</span>
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
                                      <a onClick={() => handleEditModal(item)}>
                                        <em className="icon ni ni-edit"></em>
                                        <span>Edit</span>
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
          getListingData={getCategoryListData}
          closeModal={(isModal: boolean) => setAddModal(isModal)}
        />
      )}
      {editModal && (
        <EditFormModal
          elementData={elementData}
          modal={editModal}
          getListingData={getCategoryListData}
          closeModal={(isModal: boolean) => setEditModal(isModal)}
        />
      )}
      {deleteModal && (
        <DeleteConfirmationModal
          modal={deleteModal}
          closeModal={(isModal: boolean) => setDeleteModal(isModal)}
          confirmedDelete={handleDeleteItem}
          actionType="category"
        />
      )}
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(CategoryList));
