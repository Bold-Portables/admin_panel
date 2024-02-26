import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import moment from "moment";
import { socketService } from "../../config/socketService";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  subscriptionId: string;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
}

function EditSubscription(props: MyComponentProps) {
  const {
    setLoading,
    subscriptionId,
    modal,
    closeModal,
  } = props;

  const [upgradeAmount, setUpgradeAmount] = useState<string>('0');
  const [description, setDescription] = useState<string>('');
  const [subscription, setSubscription] = useState({
    monthlyCost: 0,
    upgradedCost: 0,
  });

  useEffect(() => {
    getSubscriptionData();
  }, []);

  const handleUpgradeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUpgradeAmount(value);
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDescription(value);
  };

  const getSubscriptionData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/payment/admin/subscription-detail/${subscriptionId}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            setSubscription(response.data.data.subscription)
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

  const handleSubmit = async () => {
    let payload: any = { 
      upgradeAmount: upgradeAmount, 
      description: description 
    };

    setLoading(true);
    
    await authAxios()
      .post(`payment/admin/subscription/${subscriptionId}`, payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            setUpgradeAmount('0')
            setDescription('')
            toast.success(response.data.message);
            closeModal(false);
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
            <h5 className="title">Charge Service Fee</h5>
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
                            placeholder="Price per month"
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
                      <div className="col-md-10">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Description
                          </label>
                          <input
                            min={0}
                            value={description}
                            onChange={handleDescription}
                            type="text"
                            name="description"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter a brief description..."
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
                                Next invoice <span>${(subscription.upgradedCost + parseInt(upgradeAmount) || subscription.upgradedCost)}</span>
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