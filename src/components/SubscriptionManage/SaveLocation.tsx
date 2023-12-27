import React, { useState } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import { socketService } from "../../config/socketService";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  invoiceData: any;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
  getListingData: () => void;
}

function SaveLocation(props: MyComponentProps) {
  const { setLoading, invoiceData, modal, closeModal, getListingData } = props;
  const [userData, setUserData] = useState({
    subscriptionId: invoiceData._id,
    quotationId: invoiceData.quotationId,
    quotationType : invoiceData?.quotationType?.toLowerCase(),
    address: "",
    driver_name: "",
    driver_phone_number: "",
    status: "modified",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = userData;
    setLoading(true);
    await authAxios()
      .post("/tracking/save-tracking", payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data?.message);
            socketService.connect().then((socket: any) => {
              socket.emit("save_location", response.data.data);
            });
            getListingData();
            closeModal(false);
          } else {
            toast.error(response.data?.message);
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
    <div
      className={`modal fade ${modal ? "show" : "hide"}`}
      style={{ display: modal ? "block" : "none" }}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-top" role="document">
        <div className="modal-content">
          <a
            className="close cursor_ponter"
            onClick={() => closeModal(false)}
            data-bs-dismiss="modal"
          >
            <em className="icon ni ni-cross-sm"></em>
          </a>
          <div className="modal-body modal-body-md">
            <h5 className="title">Save Order Location</h5>
            <div className="tab-content">
              <div className="tab-pane active" id="personal">
                <form onSubmit={handleSubmit}>
                  <div className="row gy-4">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="full-name">
                          Driver Name
                        </label>
                        <input
                          type="text"
                          required
                          onChange={handleChange}
                          name="driver_name"
                          value={userData.driver_name}
                          className="form-control"
                          id="driver_name"
                          placeholder="Enter Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone-no">
                          Driver Phone
                        </label>
                        <input
                          type="number"
                          required
                          className="form-control"
                          onChange={handleChange}
                          name="driver_phone_number"
                          value={userData.driver_phone_number}
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="full-name">
                          Address
                        </label>
                        <input
                          type="text"
                          required
                          minLength={5}
                          onChange={handleChange}
                          name="address"
                          value={userData.address}
                          className="form-control"
                          id="address"
                          placeholder="Enter Address"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                        <li>
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => closeModal(false)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(SaveLocation));


