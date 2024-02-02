import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import moment from "moment";
import { socketService } from "../../config/socketService";

interface Subscription {
  _id: string;
  user: any;
  monthlyCost: number;
  upgradedCost: number;
  deliveryCost: number;
  subscription: string;
  status: string;
}

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  subscription: Subscription;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
}

function EditSubscription(props: MyComponentProps) {
  const {
    setLoading,
    subscription,
    modal,
    closeModal,
  } = props;

  const [upgradeAmount, setUpgradeAmount] = useState<string>('0');

  const handleUpgradeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if(value === "") setUpgradeAmount('0');

    setUpgradeAmount(value);
  };

  const handleSubmit = async () => {
    let payload: any = { upgradeAmount: upgradeAmount };
  
    setLoading(true);
    
    await authAxios()
      .post(`payment/admin/subscription/${subscription._id}`, payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            // socketService.connect().then((socket: any) => {
            //   socket.emit("update_quote", response.data.data);
            // });
            toast.success(response.data.message);
            closeModal(false);
            // getListingData();
          } else {
            toast.error(response.data.message);
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.response.data.message);
          console.log(error);
        }
      )
      .catch((error) => {
        setLoading(false);
        console.log("errorrrr", error);
      });
  };
 
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
                            value={subscription.monthlyCost || ''}
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
                            value={upgradeAmount}
                            onChange={handleUpgradeAmount}
                            type="number"
                            name="upgradeAmount"
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
                                Next invoice <span>${(subscription.monthlyCost + parseInt(upgradeAmount) || subscription.monthlyCost)}</span>
                            </label>
                            </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                          <li>
                            <button
                              type="button"
                              onClick={() => handleSubmit()}
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