import React, { useState, useEffect } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../Common/IsLoadingHOC";
import IsLoggedinHOC from "../Common/IsLoggedInHOC";
import Pagination from "../Common/Pagination";
import { getFormatedDate, replaceHyphenCapitolize } from "../Helper";
import { addressLimit } from "../Helper/constants";
import { socketService } from "../config/socketService";
import {saveServiceId} from "../Redux/Reducers/appSlice"
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function ServiceRequests(props: MyComponentProps) {
  const { setLoading } = props;
  const dispatch= useDispatch();
  const navigate= useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [images, setImages] = useState<any>([]);

  const openLightbox = (index: number, imagesPath: any) => {
    const allImagesPath: any[] = [];
    imagesPath.forEach((item: any) => {
      allImagesPath.push(`${process.env.REACT_APP_BASEURL}/${item.image_path}`);
    });
    setImages(allImagesPath);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    getServicesListData();
  }, [currentPage, itemsPerPage]);

const viewServiceRequestDetails=(id:any)=>{
  dispatch(saveServiceId(id))
  navigate("/request-service-details")
}

  
  const getServicesListData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/user-service/list?page=${currentPage}&limit=${itemsPerPage}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setServices(resData.userServices);
            if (resData.pagination && resData.pagination.totalDocuments) {
              setTotalCount(resData?.pagination.totalDocuments);
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

  const handleResolveService = async (item: any) => {
    if (item.status === "resolved") {
      toast.error("This service is already resolved!");
    } else {
      const payload = {
        user_name: item.name,
        user_email: item.email,
        service_id: item._id,
      };
      setLoading(true);
      await authAxios()
        .post(`/service/mail-acknowledgement`, payload)
        .then(
          (response) => {
            setLoading(false);
            if (response.data.status === 1) {
              toast.success(response.data?.message);
              socketService.connect().then((socket: any) => {
                socket.emit("resolved_service", response.data);
              });
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
    }
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
    } else if (status === "resolved") {
      return "bg-success";
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
                    <h3 className="nk-block-title page-title">
                      Service Requests
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
                      ></div>
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
                      <span className="sub-text">User Name</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">User Phone</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">User Email</span>
                    </div>
                    {/* <div className="nk-tb-col">
                      <span className="sub-text">Location</span>
                    </div> */}
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Service Requirement</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Images</span>
                    </div>
                    <div className="nk-tb-col tb-col-md">
                      <span className="sub-text">Created At</span>
                    </div>
                    <div className="nk-tb-col">
                      <span className="sub-text">Status</span>
                    </div>
                    <div className="nk-tb-col">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {services &&
                    services.length > 0 &&
                    services.map((item: any, index: number) => (
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
                                {replaceHyphenCapitolize(item?.service)}
                                <span className="dot dot-success d-md-none ms-1"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-md capitalize">
                          <span>{item?.name}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{item?.phone}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{item?.email}</span>
                        </div>
                        {/* <div className="nk-tb-col tb-col-md">
                          <span>
                            {`${
                              item.address
                                ? item.address.substring(0, addressLimit)
                                : ""
                            }  ${
                              item.address && item.address.length > addressLimit
                                ? "..."
                                : ""
                            } `}
                          </span>
                        </div> */}
                        <div className="nk-tb-col tb-col-md">
                          {item.serviceTypes &&
                            item.serviceTypes.length > 0 &&
                            item.serviceTypes.map(
                              (item: string, index: number) => (
                                <React.Fragment key={index + 1}>
                                  <span>{item}</span>
                                  <br />
                                </React.Fragment>
                              )
                            )}
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          {item.images &&
                            item.images.length > 0 &&
                            item.images.map((element: any, index: number) => (
                              <img
                                key={element.image_path}
                                onClick={() => openLightbox(index, item.images)}
                                src={`${process.env.REACT_APP_BASEURL}/${element.image_path}`}
                                alt="quotation"
                                style={{ width: "50px", height: "50px" }}
                              />
                            ))}
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{getFormatedDate(item.createdAt)}</span>
                        </div>
                        <div className="nk-tb-col capitalize">
                          <span
                            className={`badge badge-dot ${setBackgroundColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
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
                                          handleResolveService(item)
                                        }
                                      >
                                        <em className="icon ni ni-thumbs-up"></em>
                                        <span>Resolve</span>
                                      </a>
                                    </li>
                                     <li>
                                      <a
                                        onClick={() =>
                                          viewServiceRequestDetails(item._id)
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
                {isOpen && (
                  <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={
                      images[(photoIndex + images.length - 1) % images.length]
                    }
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() =>
                      setPhotoIndex(
                        (photoIndex + images.length - 1) % images.length
                      )
                    }
                    onMoveNextRequest={() =>
                      setPhotoIndex((photoIndex + 1) % images.length)
                    }
                  />
                )}
                <div></div>
                {services && services.length > 0 && totalCount > 0 && (
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
    </>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(ServiceRequests));
