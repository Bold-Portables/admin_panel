import { useEffect, useState } from "react";
import IsLoadingHOC from "../Common/IsLoadingHOC";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoggedinHOC from "../Common/IsLoggedInHOC";
import { useDispatch } from "react-redux";
import { saveAllNotification } from "../Redux/Reducers/notificationSlice";
import { CapitalizeFirstLetter, replaceHyphenCapitolize } from "../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/rootReducer";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

const NotificationDetails = (props: MyComponentProps) => {
  const [notification, setNotifaction] = useState<any>({});
  const [coordinator, setCoordinator] = useState<any>({});
  const [quotation, setQuotation] = useState<any>({});
  const { notificationId } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const { setLoading } = props;

  useEffect(() => {
    if(notificationId){
      getSpecificNotification();
    }
  }, [notificationId]);

  const markSpecificNotificationSeen = async (_id: any) => {
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

  const getSpecificNotification = async () => {
    setLoading(true);
    await authAxios()
      .get(`/notification/get-specific-unseen-notfications/${notificationId}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            console.log(response.data);
            const resData = response.data.data;
            setNotifaction(response.data.data);
            if (
              resData.type === "CREATE_QUOTE" ||
              resData.type === "SERVICE_REQUEST"
            ) {
              setCoordinator(resData?.quote_id?.coordinator);
              setQuotation(resData?.quote_id);
              markSpecificNotificationSeen(notificationId);
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

  return (
    <div className="nk-content">
      <div className="container-fluid">
        <div className="nk-content-inner">
          <div className="nk-content-body">
            <div className="nk-block">
              <div className="card">
                <div className="card-aside-wrap">
                  <div className="card-inner card-inner-lg">
                    <div className="nk-block-head">
                      <div className="nk-block-between d-flex justify-content-between">
                        <div className="nk-block-head-content">
                          <h4 className="nk-block-title">
                            Notification Details
                          </h4>
                          <div className="nk-block-des"></div>
                        </div>
                        <div className="d-flex align-center">
                          <div className="nk-tab-actions me-n1"></div>
                          <div className="nk-block-head-content align-self-start d-lg-none">
                            <a
                              className="toggle btn btn-icon btn-trigger"
                              data-target="userAside"
                            >
                              <em className="icon ni ni-menu-alt-r"></em>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="nk-block">
                      <div className="nk-data data-list">
                        <div className="data-head">
                          <h6 className="overline-title">User Details</h6>
                        </div>
                        <div className="data-item">
                          <div className="data-col">
                            <span className="data-label">Name</span>
                            <span className="data-value">
                              {notification &&
                                notification.user &&
                                CapitalizeFirstLetter(notification.user?.name)}
                            </span>
                          </div>
                        </div>
                        <div className="data-item">
                          <div className="data-col">
                            <span className="data-label">Phone</span>
                            <span className="data-value">
                              {notification?.user?.mobile}
                            </span>
                          </div>
                        </div>
                      </div>
                      {(notification.type === "CREATE_QUOTE" ||
                        notification.type === "SERVICE_REQUEST") && (
                        <div className="nk-data">
                          <div className="data-head">
                            <h6 className="overline-title">
                              Project Manager details
                            </h6>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">
                                Project Manager name
                              </span>
                              <span className="data-value">
                                {coordinator?.name}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">
                                Project Manager email
                              </span>
                              <span className="data-value">
                                {coordinator?.email}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">
                                Project Manager cell number
                              </span>
                              <span className="data-value">
                                {coordinator?.cellNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {(notification.type === "CREATE_QUOTE" ||
                        notification.type === "SERVICE_REQUEST") && (
                        <div className="nk-data">
                          <div className="data-head">
                            <h6 className="overline-title">
                              Quotation details
                            </h6>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Quotation type</span>
                              <span className="data-value">
                                {replaceHyphenCapitolize(
                                  notification?.quote_type
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Max workers</span>
                              <span className="data-value">
                                {quotation?.maxWorkers}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Weekly hours</span>
                              <span className="data-value">
                                {quotation?.weeklyHours}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">
                                Distance from kelowna
                              </span>
                              <span className="data-value">
                                {quotation?.distanceFromKelowna}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Units number</span>
                              <span className="data-value">
                                {quotation?.numUnits}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">
                                special requirements
                              </span>
                              <span className="data-value">
                                {quotation?.special_requirements}
                              </span>
                            </div>
                          </div>

                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Use at night</span>
                              <span className="data-value">
                                {quotation?.useAtNight ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>

                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">use in winter</span>
                              <span className="data-value">
                                {quotation?.useInWinter ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsLoadingHOC(IsLoggedinHOC(NotificationDetails));
