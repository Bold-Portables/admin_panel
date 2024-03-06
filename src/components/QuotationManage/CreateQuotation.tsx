import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import moment from "moment";
import { socketService } from "../../config/socketService";

interface ServicesPrice {
  workersCost: number;
  deliveryPrice: number;
  specialRequirementsCost: number;
  numberOfUnitsCost: number;
  useAtNightCost: number;
  useInWinterCost: number;
  handWashingCost: number;
  handSanitizerPumpCost: number;
  twiceWeeklyServicing: number;
  serviceFrequencyCost: number;
  weeklyHoursCost: number;
  pickUpPrice: number;
}

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
  getListingData: () => void;
}

function CreateQuotation(props: MyComponentProps) {
  const {
    setLoading,
    modal,
    closeModal,
    getListingData,
  } = props;

  const [activeStep, setActiveStep] = useState<number>(1);

  const defaultCoordinator = {
    _id: "",
    name: "",
    email: "",
    mobile: "",
  }
  const [coordinator, setCoordinator] = useState(defaultCoordinator);
  const [coordinators, setCoordinators] = useState([defaultCoordinator]);

  const [quotation, setQuotation] = useState({
    maxWorkers: "",
    weeklyHours: "",
    serviceFrequency: "",
    special_requirements: "",
    distanceFromKelowna: "",
    numUnits: 0,
    workerTypes: "",
    useAtNight: false,
    useInWinter: false,
    designatedWorkers: false,
    handwashing: false,
    handSanitizerPump: false,
    twiceWeeklyService: false,
    dateTillUse: "",
    placementDate: "",
    status: "",
    maleWorkers: 0,
    femaleWorkers: 0,
    totalWorkers: 0,
  });

  const [quotationType, setQuotationType] = useState('')

  const [servicesPrice, setServicesPrice] = useState<ServicesPrice>({
    workersCost: 0,
    deliveryPrice: 0,
    specialRequirementsCost: 0,
    numberOfUnitsCost: 0,
    useAtNightCost: 0,
    useInWinterCost: 0,
    handWashingCost: 0,
    handSanitizerPumpCost: 0,
    twiceWeeklyServicing: 0,
    serviceFrequencyCost: 0,
    weeklyHoursCost: 0,
    pickUpPrice: 0,
  });

  useEffect(() => {
    getCustomerListData()
  }, []);

  const userFields = ["name", "email", "cellNumber"];

  const QuotationFields = [
    "maxWorkers",
    "serviceFrequency",
    "special_requirements",
    "distanceFromKelowna",
    "useAtNight",
    "useInWinter",
    "numUnits",
    "designatedWorkers",
    "workerTypes",
    "handwashing",
    "handSanitizerPump",
    "twiceWeeklyService",
    "placementDate",
    "dateTillUse",
    "status",
    "weeklyHours",
    "maleWorkers",
    "femaleWorkers",
    "totalWorkers",
  ];

  const servicePriceFields = [
    "workersCost",
    "deliveryPrice",
    "specialRequirementsCost",
    "numberOfUnitsCost",
    "useAtNightCost",
    "useInWinterCost",
    "handWashingCost",
    "handSanitizerPumpCost",
    "twiceWeeklyServicing",
    "serviceFrequencyCost",
    "weeklyHoursCost",
    "pickUpPrice",
  ];

  const getCustomerListData = async () => {
    setLoading(true);

    // temporary axios call
    await authAxios()
      .get(`/auth/get-all-users?page=${1}&limit=${100}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            setCoordinators(resData.users);
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

  const handleChangeQuotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuotation((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCoordinator = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoordinator((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectUser = (e: any) => {
    const { value } = e.target;
    const coordinator = coordinators.find(user => user._id === value);

    coordinator ? setCoordinator(coordinator) :
                  setCoordinator(defaultCoordinator)
  };

  const handleChangeServicePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServicesPrice((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async (requestType: string) => {
    let payload: any = { costDetails: servicesPrice };
    if (requestType === "save") {
      payload["type"] = "save";
    }
    let endPoint: string = "quotation/update-quotation-for-construction";
    if (quotationType === "construction") {
      endPoint = "quotation/update-quotation-for-construction";
    } else if (quotationType === "disaster-relief") {
      endPoint = "quotation/update-quotation-for-disaster-relief";
    } else if (quotationType === "farm-orchard-winery") {
      endPoint = "quotation/update-quotation-for-farm-orchard-winery";
    } else if (quotationType === "personal-or-business") {
      endPoint = "quotation/update-quotation-for-personal-business-site";
    } else if (quotationType === "recreational-site") {
      endPoint = "quotation/update-quotation-for-recreational-site";
    }
    setLoading(true);
    await authAxios()
      .put(`/${endPoint}`, payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            socketService.connect().then((socket: any) => {
              socket.emit("update_quote", response.data.data);
            });
            toast.success(response.data.message);
            closeModal(false);
            getListingData();
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

 // Function to calculate the total price
 const calculateAnObjValues = (obj: ServicesPrice) => {
  const total = Object.values(obj).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return total;
};

 
  return (
    <div
      className={`modal max-modal-size fade ${modal ? "show" : "hide"}`}
      style={{ display: modal ? "block" : "none" }}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-top" role="document">
        <div className="modal-content">
          <a
            onClick={() => closeModal(false)}
            className="close cursor_ponter"
            data-bs-dismiss="modal"
          >
            <em className="icon ni ni-cross-sm"></em>
          </a>
          <div className="modal-body modal-body-md">
            <h5 className="title">New Quotation</h5>
            <ul className="nk-nav nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeStep === 1 ? "active" : ""} `}
                  data-bs-toggle="tab"
                  onClick={() => setActiveStep(1)}
                >
                  Personal
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeStep === 2 ? "active" : ""} `}
                  data-bs-toggle="tab"
                  onClick={() => setActiveStep(2)}
                >
                  Quotation
                </a>
              </li>
            </ul>
            <div className="tab-content">
              {activeStep === 1 && (
                <div className="tab-pane active">
                  <form>
                    <div className="row gy-4">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="full-name">
                            User Name
                          </label>
                          <select
                            required
                            name="coordinator"
                            value={coordinator._id}
                            className="form-control"
                            onChange={handleSelectUser}
                          >
                            <option value="">Select a user</option>
                            {coordinators.map(user => (
                            <option key={user._id} value={user._id || ''}>{user.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Email Address
                          </label>
                          <input
                            disabled
                            value={coordinator.email}
                            onChange={handleChangeCoordinator}
                            type="email"
                            name="email"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Phone Number
                          </label>
                          <input
                            disabled
                            value={coordinator.mobile}
                            onChange={handleChangeCoordinator}
                            type="text"
                            name="cellNumber"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Designated Workers
                          </label>
                          <input
                            disabled
                            value={quotation.designatedWorkers ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="designatedWorkers"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Designated workers"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Worker Types
                          </label>
                          <input
                            disabled
                            value={quotation.workerTypes}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="workerTypes"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Worker Types"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Placement Date
                          </label>
                          <input
                            disabled
                            value={moment(quotation.placementDate).format(
                              "MMMM Do YYYY"
                            )}
                            type="text"
                            name="placementDate"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Placement Date"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Male workers
                          </label>
                          <input
                            disabled
                            value={quotation.maleWorkers}
                            onChange={handleChangeQuotation}
                            type="number"
                            name="maleWorkers"
                            className="form-control"
                            id="maleWorkers"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Female workers
                          </label>
                          <input
                            min={0}
                            disabled
                            value={quotation.femaleWorkers}
                            onChange={handleChangeQuotation}
                            type="number"
                            name="femaleWorkers"
                            className="form-control"
                            id="femaleWorkers"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Total workers
                          </label>
                          <input
                            disabled
                            value={quotation.totalWorkers}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="title"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Maximum workers"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Distance
                          </label>
                          <input
                            disabled
                            value={quotation.distanceFromKelowna}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="distanceFromKelowna"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Distance"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.workersCost}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="workersCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Weekly Hours
                          </label>
                          <input
                            disabled
                            value={quotation.weeklyHours}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="weeklyHours"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Weekly hours"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Weekly Hours Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.weeklyHoursCost}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="weeklyHoursCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                          <li>
                            <button
                              type="button"
                              onClick={() => setActiveStep(2)}
                              className="btn btn-primary"
                            >
                              Next
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
              {activeStep === 2 && (
                <div className="tab-pane active">
                  <form>
                    <div className="row gy-4">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Use At Night
                          </label>
                          <input
                            disabled
                            value={quotation.useAtNight ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="useAtNight"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Yes/No"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            disabled={!quotation.useAtNight}
                            value={servicesPrice.useAtNightCost}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="useAtNightCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Use In Winter
                          </label>
                          <input
                            disabled
                            value={quotation.useInWinter ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="title"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Yes/No"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.useInWinterCost}
                            disabled={!quotation.useInWinter}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="useInWinterCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Number of units
                          </label>
                          <input
                            disabled
                            value={quotation.numUnits}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="numUnits"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Number of units"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            disabled={quotation.numUnits <= 0}
                            value={servicesPrice.numberOfUnitsCost}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="numberOfUnitsCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Date Till Use
                          </label>
                          <input
                            disabled
                            value={moment(quotation.dateTillUse).format(
                              "MMMM Do YYYY"
                            )}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="dateTillUse"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Date till use"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Handwashing
                          </label>
                          <input
                            disabled
                            value={quotation.handwashing ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="handwashing"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.handWashingCost}
                            disabled={!quotation.handwashing}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="handWashingCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Hand Sanitizer Pump
                          </label>
                          <input
                            disabled
                            value={quotation.handSanitizerPump ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="title"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Yes/No"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.handSanitizerPumpCost}
                            disabled={!quotation.handSanitizerPump}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="handSanitizerPumpCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Twice Weekly Service
                          </label>
                          <input
                            disabled
                            value={quotation.twiceWeeklyService ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="title"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Yes/No"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            disabled={!quotation.twiceWeeklyService}
                            value={servicesPrice.twiceWeeklyServicing}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="twiceWeeklyServicing"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Special Requirements
                          </label>
                          <input
                            value={quotation.special_requirements}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="title"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Special Requirements"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.specialRequirementsCost}
                            disabled={!quotation.special_requirements}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="specialRequirementsCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Service Frequency
                          </label>
                          <input
                            disabled
                            value={quotation.serviceFrequency}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="serviceFrequency"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Service Frequency"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Cost
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.serviceFrequencyCost}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="serviceFrequencyCost"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Delivery Fee
                          </label>
                          <input
                            min={1}
                            value={servicesPrice.pickUpPrice}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="pickUpPrice"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Enter pickup Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Delivery Fee"
                          >
                            Delivery Fee <span>${servicesPrice.pickUpPrice}</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Delivery Fee"
                          >
                            Monthly Invoice <span>${calculateAnObjValues(servicesPrice) - servicesPrice.pickUpPrice}</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3 total-price">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Delivery Fee"
                          >
                            Initial Invoice <span>${calculateAnObjValues(servicesPrice)}</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                          <li>
                            <button
                              type="submit"
                              onClick={() => setActiveStep(1)}
                              className="btn btn-primary"
                            >
                              Back
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={() => handleSubmit("save")}
                              className="btn btn-success"
                            >
                              Save Invoice
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={() => handleSubmit("send invoice")}
                              className="btn btn-warning"
                            >
                              Send Invoice
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

export default IsLoadingHOC(IsLoggedinHOC(CreateQuotation));
