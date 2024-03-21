import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { getFormatedDate } from "../../Helper";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Lightbox from "react-image-lightbox";

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
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [images, setImages] = useState<any>([]);

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
            console.log(response.data.data.serviceRequests)

            setServiceRequests(response.data.data.serviceRequests)
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

  const openLightbox = (index: number, imagesPath: any) => {
    const allImagesPath: any[] = [];
    imagesPath.forEach((item: any) => {
      allImagesPath.push(`${process.env.REACT_APP_AWS_S3_URL}/${item.image_path}`);
    });
    setImages(allImagesPath);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    let payload: any = { 
      upgradeAmount: upgradeAmount, 
      description: description 
    };

    setLoading(true);
    
    await authAxios()
      .post(`payment/admin/subscription-fee/${subscriptionId}`, payload)
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
      <div className="modal-dialog modal-xl modal-dialog-top" role="document">
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

            <h6 className="title my-3 text-primary hover:underline">{serviceRequests.length} Service requests</h6>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Images</th>
                  <th>Created At</th>
                </tr>
              </thead>
              {serviceRequests &&
                serviceRequests.length > 0 &&
                serviceRequests.map((request: any, index: number) => (
                <tbody key={index + 1}>
                <tr className="height-50"></tr>
                <tr>
                  <td>
                    {request._id?.slice(-8)?.toUpperCase()}
                  </td>
                  <td className="">
                    {request?.name}
                  </td>
                  <td className="border-xside">
                    {request?.phone}
                  </td>
                  <td className="">
                    {request?.email}
                  </td>

                  {request.serviceTypes &&
                    request.serviceTypes.length > 0 &&
                    request.serviceTypes.map(
                    (type: string, index: number) => (
                      <td className="" key={`type-${index + 1}`}>
                        {type}
                      </td>
                    )
                  )}
                  <td>
                    {request.images &&
                      request.images.length > 0 &&
                      request.images.map((element: any, index: number) => (
                    <img
                        key={element.image_path}
                        onClick={() => openLightbox(index, request.images)}
                        src={`${process.env.REACT_APP_AWS_S3_URL}/${element.image_path}`}
                        alt="Service img"
                        style={{ width: "45px", height: "45px" }}
                      />
                    ))}
                  </td>
                  <td>
                    {getFormatedDate(request.createdAt)}
                  </td>
                </tr>
              </tbody>
              ))}
            </table>
         
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