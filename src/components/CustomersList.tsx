import React, { useState, useEffect, useRef } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../Common/IsLoadingHOC";
import { Link, useNavigate } from "react-router-dom";
import IsLoggedinHOC from "../Common/IsLoggedInHOC";
import Pagination from "../Common/Pagination";
import { getDateWithoutTime } from "../Helper";
import { CSVLink } from "react-csv";
import ExportConfirmationModal from "../Common/ConfirmExportModal";
import { saveCustomerId } from "../Redux/Reducers/appSlice";
import { useDispatch } from "react-redux";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  isLoading: boolean;
}

// Export CSV File Headers
const headers = [
  { label: "Customer name", key: "name" },
  { label: "Phone number", key: "mobile" },
  { label: "Email address ", key: "email" },
  { label: "Customer Address", key: "address" },
  { label: "Created At", key: "createdAt" },
  { label: "Updated At", key: "updatedAt" },
];

function CustomersList(props: MyComponentProps) {
  const { setLoading, isLoading } = props;
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [exportData, setExportData] = useState<any[]>([]);
  const [exportModal, setExportModal] = useState<boolean>(false);
  const [inputvalue, setinputvalue] = useState("")

  const csvLink = useRef<any>(null);

  useEffect(() => {
    getCustomerListData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (exportData && exportData.length > 0) {
      if (csvLink.current !== null) {
        csvLink.current.link.click();
        toast.success("Data Exported Successfully");
        setExportData([]);
        setExportModal(false);
      }
    }
  }, [exportData]);

  const getCustomerListData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/auth/get-all-users?page=${currentPage}&limit=${itemsPerPage}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setCustomers(resData.users);
            setTotalCount(resData?.total);
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
        .get(`/auth/get-all-users?page=${i}&limit=${10000}`)
        .then(
          (response) => {
            setLoading(false);
            if (response.data.status === 1) {
              const resData = response.data.data?.users;
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

  const viewCustomerDetail = (customerId: string) => {
    dispatch(saveCustomerId(customerId));
    navigate("/view-user");
  };
  const handleKeyDown = (event:any) => {
    if (event.keyCode === 13) {
      handleSearch();
    }
  };
  const handleSearch = async()=>{
    setLoading(true);
    await authAxios()
    .get(`/user/find-user?query=${inputvalue}`)
    .then(
      (response) => {
        setLoading(false);
        if (response.data.status === 1) {
          const resData = response.data;
          setCustomers(resData.data);
          setTotalCount(resData?.count);
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
  return (
    <>
      <div className="nk-content">
        <div className="container-fluid">
          <div className="nk-content-inner">
            <div className="nk-content-body">
              <div className="nk-block-head nk-block-head-sm">
                <div className="nk-block-between">
                  <div className="nk-block-head-content">
                    <h3 className="nk-block-title page-title">Customers</h3>
                    <div className="search--customer">
                    <input type="text" value={inputvalue}  ref={inputRef} onChange={e=>setinputvalue(e.target.value)} onKeyDown={handleKeyDown}/>
                    <button onClick={handleSearch} className="btn">Search</button>
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
                              filename="Customers"
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
                      <span className="sub-text">User Name</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Phone</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Email</span>
                    </div>
                    <div className="nk-tb-col tb-col-lg">
                      <span className="sub-text">Address</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Created At</span>
                    </div>
                    <div className="nk-tb-col">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {customers &&
                    customers.length > 0 &&
                    customers.map((item: any, index) => (
                      <div key={index + 1} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <a onClick={() => viewCustomerDetail(item._id)}>
                            <span className="tb-status text-primary">
                              {item._id?.slice(-8)?.toUpperCase()}
                            </span>
                          </a>
                        </div>
                        <div className="nk-tb-col capitalize ">
                          <span>{item?.name}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{item.mobile}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span>{item.email}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>
                            {item.address ? item.address : "Not Available"}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span>{getDateWithoutTime(item?.createdAt)}</span>
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
                                          viewCustomerDetail(item._id)
                                        }
                                      >
                                        <em className="icon ni ni-eye"></em>
                                        <span>View Details</span>
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
                {customers && customers.length > 0 && totalCount > 0 && (
                  <Pagination
                    totalCount={totalCount}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onChangePageLimit={(page: number) => setItemPerPage(page)}
                    resData={customers}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExportConfirmationModal
        modal={exportModal}
        closeModal={(isModal: boolean) => setExportModal(isModal)}
        handleExportData={getExportingData}
      />
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(CustomersList));
