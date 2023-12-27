import { useEffect, useState, useRef } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "./IsLoadingHOC";
import io, { Socket } from "socket.io-client";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { saveAllNotification } from "../Redux/Reducers/notificationSlice";
import { RootState } from "../Redux/rootReducer";
import { saveNotificationId } from "../Redux/Reducers/appSlice";
import { useSelector } from "react-redux";
dayjs.extend(relativeTime);

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

const Notification = (props: MyComponentProps) => {
  const { setLoading } = props;
  const { allNotification } = useSelector(
    (state: RootState) => state.notification
  );
  console.log("allNotification", allNotification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useRef<Socket>();
  socket.current = io(`${process.env.REACT_APP_SOCKET}`);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("new_order_recieved", (recieved_order) => {
        console.log("recieved_order", recieved_order);
        getAllNotifications();
      });
      socket.current.on("new_quote_recieved", (quote_recieved) => {
        console.log("quote_recieved", quote_recieved);
        getAllNotifications();
      });
      socket.current.on("request_service_received", (request_service) => {
        console.log("request_service_received", request_service);
        getAllNotifications();
      });
    }
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    getAllNotifications();
  }, []);

  const getAllNotifications = async () => {
    await authAxios()
      .get(`/notification/get-all-unseen-notfications`)
      .then(
        (response) => {
          if (response.data.status === 1) {
            const resData = response.data.data;
            dispatch(saveAllNotification(resData));
          }
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const markAllNotificationsSeen = async () => {
    setLoading(true);
    await authAxios()
      .put(`/notification/mark-all-notfications-true`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            getAllNotifications();
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

  const markSpecificNotificationSeen = async (_id: string) => {
    setLoading(true);
    await authAxios()
      .patch(`/notification/${_id}/mark-specific-notification-as-seen`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            getAllNotifications();
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

  const viewNotificationDetail = (_id: string) => {
    dispatch(saveNotificationId(_id));
    navigate("/notification-details");
  };

  return (
    <li className="dropdown notification-dropdown">
      <a
        href="#"
        className="dropdown-toggle nk-quick-nav-icon"
        data-bs-toggle="dropdown"
      >
        <div
          className={
            allNotification && allNotification?.length > 0
              ? "icon-status icon-status-info"
              : ""
          }
        >
          <em className="icon ni ni-bell"></em>
        </div>
      </a>
      <div className="dropdown-menu dropdown-menu-xl dropdown-menu-end">
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">Notifications</span>
          <a href="#" onClick={markAllNotificationsSeen}>
            {allNotification &&
              allNotification?.length > 0 &&
              "Mark All as Read"}
          </a>
        </div>
        <div className="dropdown-body">
          <div className="nk-notification">
            {allNotification &&
              allNotification?.length > 0 &&
              allNotification.map((item: any, index: number) => {
                if (!item.status_seen) {
                  return (
                    <div
                      key={item._id}
                      className="nk-notification-item dropdown-inner"
                      style={{ padding: "20px 10px 20px" }}
                    >
                      <a onClick={() => viewNotificationDetail(item._id)}>
                        <div className="nk-notification-icon">
                          <em className="icon icon-circle  ni bg-warning-dim ni-file-docs "></em>
                        </div>
                      </a>
                      <a onClick={() => viewNotificationDetail(item._id)}>
                        <div className="nk-notification-content">
                          <div className="nk-notification-text">
                            {" "}
                            {item.type === "CREATE_QUOTE" &&
                              `${item?.user?.name} has requested a quotation`}
                            {item.type === "SERVICE_REQUEST" &&
                              `${item?.user?.name} has requested a quotation service`}
                          </div>
                          <div className="nk-notification-time">
                            <span>{dayjs(item.createdAt).fromNow()}</span>
                          </div>
                        </div>
                      </a>
                      <a
                        style={{ marginLeft: "auto" }}
                        onClick={() => markSpecificNotificationSeen(item._id)}
                      >
                        <div className="nk-notification-icon">
                          <em className="icon icon-circle bg-success-dim ni ni-check-circle"></em>
                        </div>
                      </a>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        </div>
        {/* <div className="dropdown-foot center">
          <a href="#">View All</a>
        </div> */}
      </div>
    </li>
  );
};

export default IsLoadingHOC(Notification);
