import React, { useState, useEffect } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../Common/IsLoadingHOC";
import IsLoggedinHOC from "../Common/IsLoggedInHOC";
import { CapitalizeFirstLetter } from "../Helper";
import Select from "react-select";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function SendEmail(props: MyComponentProps) {
  const { setLoading } = props;
  const [customers, setCustomers] = useState<any>([]);
  const [currentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(500000);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const [fieldData, setFieldData] = useState({
    emailList: [],
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFieldData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (options: any) => {
    setSelectedOptions(options);
    const optionsData: any = [];
    options.map((item: any) => optionsData.push(item.value));
    setFieldData((prev) => ({
      ...prev,
      emailList: optionsData,
    }));
  };

  useEffect(() => {
    getCustomerListData();
  }, [currentPage, itemsPerPage]);

  const getCustomerListData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/auth/get-all-users?page=${currentPage}&limit=${itemsPerPage}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            const roleData: any = [];
            resData.users.forEach((item: any) => {
              const nameWithCaps = CapitalizeFirstLetter(item.name);
              roleData.push({ label: nameWithCaps, value: item.email });
            });
            setCustomers(roleData);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = fieldData;
    setLoading(true);
    await authAxios()
      .post("/user/send-mail-multi-user", payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            toast.success(response.data.message);
            setFieldData({
              emailList: [],
              subject: "",
              message: "",
            });
            setSelectedOptions([]);
          } else {
            toast.error(response.data.message);
          }
        },
        (error) => {
          setLoading(false);
          if (error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            const obj = error.response.data.errors[0];
            const errormsg = Object.values(obj) || [];
            if (errormsg && errormsg.length > 0) {
              toast.error(`${errormsg[0]}`);
            }
          }
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
            <div className="nk-block-head nk-block-head-sm">
              <div className="nk-block-between">
                <div className="nk-block-head-content">
                  <h3 className="nk-block-title page-title">
                    Send a mail to users
                  </h3>
                </div>
              </div>
            </div>
            <div className="nk-block">
              <div className="card">
                <div className="card-inner">
                  {/* <h5 className="card-title">Web Store Setting</h5>
                  <p>Here is your basic store setting of your website.</p> */}
                  <form onSubmit={handleSubmit} className="gy-3 form-settings">
                    <div className="row g-3 align-center">
                      <div className="col-lg-5">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            User Email
                          </label>
                          <span className="form-note">
                            Select valid user email.
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Select
                              options={customers}
                              value={selectedOptions}
                              onChange={handleSelectChange}
                              isMulti={true}
                              closeMenuOnSelect={false}
                              hideSelectedOptions={false}
                              placeholder="Select user"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3 align-center">
                      <div className="col-lg-5">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-email">
                            Subject
                          </label>
                          <span className="form-note">
                            Write subject here.
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <input
                              minLength={4}
                              type="text"
                              className="form-control form-control-lg"
                              id="default-01"
                              required
                              value={fieldData.subject}
                              onChange={handleChange}
                              name="subject"
                              placeholder="Subject"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3 align-center">
                      <div className="col-lg-5">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="site-copyright"
                          >
                            Message
                          </label>
                          <span className="form-note">
                            Write a message here.
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <textarea
                              minLength={10}
                              className="form-control form-control-lg"
                              required
                              value={fieldData.message}
                              onChange={handleChangeTextArea}
                              name="message"
                              placeholder="Message"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-lg-7 offset-lg-5">
                        <div className="form-group mt-2">
                          <button
                            type="submit"
                            className="btn btn-lg btn-primary"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default IsLoadingHOC(IsLoggedinHOC(SendEmail));
