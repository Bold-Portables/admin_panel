import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import moment from "moment";
import { socketService } from "../../config/socketService";

// Represents price per month. Standard price is the default, upgraded price is added based on service reqs
interface Subscription {
  _id: string;
  user: any;
  quotationId: any;
  quotationType: any;
  subscription: string;
  status: string;
}

interface SubscriptionPrice {
    upgradeAmount: number;
    standardPrice: number;
    upgradedPrice: number;
}

interface MyComponentProps {
//   setLoading: (isComponentLoading: boolean) => void;
  subscription: Subscription;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
}

function EditSubscription(props: MyComponentProps) {
  const {
    // setLoading,
    subscription,
    modal,
    closeModal,
  } = props;


  // const [subscription, setSubscription] = useState({
  //   quotationType: "",
  //   quotationId: "",
  //   subscription: "",
  //   status: "",
  // });

  const [subscriptionPrice, setSubscriptionPrice] = useState<SubscriptionPrice>({
    upgradeAmount: 0,
    standardPrice: 0,
    upgradedPrice: 0,
  });

  useEffect(() => {
    // getSubscriptionData();
  }, []);

  const subscriptionFields = [
    "upgradeAmount",
    "standardPrice",
    "upgradedPrice",
  ];

  // const getSubscriptionData = async () => {
  //   // setLoading(true);
  //   // const payload = { subscription_id: subscription._id };
  //   await authAxios()
  //     .get(`/payment/subscription/${subscrip}`)
  //     .then(
  //       (response) => {
  //       //   setLoading(false);
  //         if (response.data.status === 1) {
  //           console.log(response)
  //           // const resCoordinateData = response.data.data.quotation?.coordinator;
  //           // const resData = response.data.data.quotation;
  //           // const costDetails = response.data.data.quotation?.costDetails;
        
  //           // update input fields with data
  //           subscriptionFields.forEach((field) => {
  //               setSubscriptionPrice((prev) => ({
  //               ...prev,
  //               [field]: 0
  //             }));
  //           });
  //         }
  //       },
  //       (error) => {
  //       //   setLoading(false);
  //         toast.error(error.response.data.message);
  //       }
  //     )
  //     .catch((error) => {
  //       console.log("errorrrr", error);
  //     });
  // };

  const handleChangeSubscription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubscriptionPrice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (requestType: string) => {
    console.log('submit called')
    // let payload: any = { costDetails: servicesPrice };
    // if (requestType === "save") {
    //   payload["type"] = "save";
    // }
    // let endPoint: string = "quotation/update-quotation-for-construction";
    // if (quotationType === "construction") {
    //   endPoint = "quotation/update-quotation-for-construction";
    // } else if (quotationType === "disaster-relief") {
    //   endPoint = "quotation/update-quotation-for-disaster-relief";
    // } else if (quotationType === "farm-orchard-winery") {
    //   endPoint = "quotation/update-quotation-for-farm-orchard-winery";
    // } else if (quotationType === "personal-or-business") {
    //   endPoint = "quotation/update-quotation-for-personal-business-site";
    // } else if (quotationType === "recreational-site") {
    //   endPoint = "quotation/update-quotation-for-recreational-site";
    // }
    // setLoading(true);
    // await authAxios()
    //   .put(`/${endPoint}/${quotationId}`, payload)
    //   .then(
    //     (response) => {
    //       setLoading(false);
    //       if (response.data.status === 1) {
    //         socketService.connect().then((socket: any) => {
    //           socket.emit("update_quote", response.data.data);
    //         });
    //         toast.success(response.data.message);
    //         closeModal(false);
    //         // getListingData();
    //       } else {
    //         toast.error(response.data.message);
    //       }
    //     },
    //     (error) => {
    //       setLoading(false);
    //       toast.error(error.response.data.message);
    //       console.log(error);
    //     }
    //   )
    //   .catch((error) => {
    //     setLoading(false);
    //     console.log("errorrrr", error);
    //   });
  };

 // Function to calculate the total price
//  const calculateAnObjValues = (obj: ServicesPrice) => {
//   const total = Object.values(obj).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//   return total;
// };

 
  return (
    <div
      className={`modal max-modal-size fade ${modal ? "show" : "hide"}`}
      style={{ display: modal ? "block" : "none" }}
      role="dialog"
    >
      <div className="modal-dialog modal-md modal-dialog-top" role="document">
        <div className="modal-content">
          <a
            onClick={() => closeModal(false)}
            className="close cursor_ponter"
            data-bs-dismiss="modal"
          >
            <em className="icon ni ni-cross-sm"></em>
          </a>
          <div className="modal-body modal-body-md">
            <h5 className="title">Edit Subscription</h5>
            <hr></hr>
         
            <div className="tab-content">
              {(
                <div className="tab-pane active">
                  <form>
                    <div className="row gy-4">
                    <div className="col-md-5">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Price per month
                          </label>
                          <input
                            disabled
                            value={subscriptionPrice.standardPrice}
                            onChange={handleChangeSubscription}
                            type="text"
                            name="distanceFromKelowna"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Distance"
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Upgrade amount
                          </label>
                          <input
                            min={0}
                            value={subscriptionPrice.upgradeAmount}
                            onChange={handleChangeSubscription}
                            type="number"
                            name="workersCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="col-md-5 total-price">
                            <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="Delivery Fee"
                            >
                                Next invoice <span>${0}</span>
                            </label>
                            </div>
                        </div>
                      </div>


                      <div className="col-12">
                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                          <li>
                            <button
                              type="button"
                              onClick={() => handleSubmit("save")}
                              className="btn btn-success"
                            >
                              Update
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => closeModal(false)}
                              type="button"
                              data-bs-dismiss="modal"
                              className="link link-light"
                            >
                              Cancel
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(EditSubscription));