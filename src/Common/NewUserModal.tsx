import React, { useState, useEffect } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "./IsLoadingHOC";
import IsLoggedinHOC from "./IsLoggedInHOC";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
  getCustomerListData: any
}

function EditSubscription(props: MyComponentProps) {
  const {
    setLoading,
    modal,
    closeModal,
    getCustomerListData,
  } = props;

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cellNumber: "",
  });

  const handleUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9-+]/g, ""); // Remove non-numeric, non-hyphen, and non-plus characters
    if (sanitizedValue.match(/^\+?[0-9-]*$/)) {
      setUserData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }
  };


  const handleSubmit = async () => {

    if (Object.values(userData).some(value => value === "")) {
      toast.error("Fill out all fields");
      return;
    }

    let payload: any = {userData: userData};

    setLoading(true);
    
    await authAxios()
      .post("/user/create-user", payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            getCustomerListData()
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
            <h5 className="title">Add new user</h5>
            <hr></hr>
            <div className="tab-content">
              {(
                <div className="tab-pane active">
                  <form>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input
                        required
                        value={userData.name}
                        onChange={handleUserData}
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        required
                        value={userData.email}
                        onChange={handleUserData}
                        type="email"
                        name="email"
                        className="form-control"
                        id="newUserEmail"
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cellNumber">
                        Phone
                      </label>
                      <input
                        required
                        value={userData.cellNumber}
                        onChange={handleChangePhone}
                        type="text"
                        name="cellNumber"
                        className="form-control"
                        id="newUserPhone"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="form-group">
                      <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                        <li>
                          <button
                            type="button"
                            onClick={() => handleSubmit()}
                            className="btn btn-success"
                          >
                            Add user
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