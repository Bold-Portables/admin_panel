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
  quotationId: string;
  quotationType: string;
  subscriptionId: string;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
  getListingData: () => void;
}

function EditQuotation(props: MyComponentProps) {
  const {
    setLoading,
    subscriptionId,
    modal,
    closeModal,
    getListingData,
  } = props;

  const [activeStep, setActiveStep] = useState<number>(1);
  const [coordinator, setCoordinator] = useState({
    name: "",
    email: "",
    cellNumber: "",
  });
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

  const [subscription, setSubscription] = useState({
    monthlyCost: 0,
  });

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

  // const [updateImmediately, setUpdateImmediately] = useState(true)
  

  useEffect(() => {
    getProductDetailsData();
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

  const getProductDetailsData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/payment/admin/subscription-detail/${subscriptionId}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resCoordinateData = response.data.data.quotation?.coordinator;
            const resData = response.data.data.quotation;
            const costDetails = response.data.data.quotation?.costDetails;
            setSubscription(response.data.data.subscription)

            userFields.forEach((field) => {
              setCoordinator((prev) => ({
                ...prev,
                [field]: resCoordinateData[field],
              }));
            });

            QuotationFields.forEach((field) => {
              setQuotation((prev) => ({
                ...prev,
                [field]: resData[field],
              }));
            });

            servicePriceFields.forEach((field) => {
              setServicesPrice((prev) => ({
                ...prev,
                [field]: costDetails[field],
              }));
            });
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

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setQuotation((prev) => ({ ...prev, [name]: value === 'yes' ? true : 
                                               value === 'no' ? false :
                                               value }));

    let cost: string

    switch (name) {
      case 'handwashing':
        cost = 'handWashingCost';
        break;
      case 'twiceWeeklyService':
        cost = 'twiceWeeklyServicing';
        break;
      default:
        cost = `${name}Cost`;
    }

    if (value === 'no') {
      setServicesPrice((prev) => ({...prev, [cost]: 0}))
    }
  };

  const handleChangeQuotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuotation((prev) => ({ ...prev, [name]: value }));

    if (name === 'special_requirements' && value === '') {
      setServicesPrice((prev) => ({...prev, ['specialRequirementsCost']: 0}))
    }
  };

  const handleChangeCoordinator = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoordinator((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeServicePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServicesPrice((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async () => {
    const updatedCost = calculateAnObjValues(servicesPrice) - servicesPrice.pickUpPrice

    let payload: any = {
      costDetails: servicesPrice, 
      updatedCost: updatedCost,
      updatedQuotation: quotation
    };

    setLoading(true);
    await authAxios()
      .put(`payment/admin/subscription/${subscriptionId}`, payload)
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
            <h5 className="title">Edit Subscription</h5>
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
                          <input
                            value={coordinator.name}
                            onChange={handleChangeCoordinator}
                            type="text"
                            disabled
                            name="name"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="User name"
                          />
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
                            value={coordinator.cellNumber}
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
                          <select
                            required
                            name="designatedWorkers"
                            value={quotation.designatedWorkers ? "yes" : "no"}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            
                          </select>
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
                          <select
                            required
                            name="workerTypes"
                            value={quotation.workerTypes}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="">Select type</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="both">Both</option>
                            
                          </select>
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
                            value={moment.utc(quotation.placementDate).format("YYYY-MM-DD")}
                            type="date"
                            name="placementDate"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Placement Date"
                            onChange={handleChangeQuotation}
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
                            value={(parseInt(`${quotation.maleWorkers}`) + parseInt(`${quotation.femaleWorkers}`)) ? 
                                   (parseInt(`${quotation.maleWorkers}`) + parseInt(`${quotation.femaleWorkers}`)) : 0}
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
                            value={quotation.distanceFromKelowna}
                            onChange={handleChangeQuotation}
                            type="number"
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
                            value={quotation.weeklyHours}
                            onChange={handleChangeQuotation}
                            type="number"
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
                          <select
                            required
                            name="useAtNight"
                            value={quotation.useAtNight ? "yes" : "no"}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
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
                            value={quotation.useAtNight ? servicesPrice.useAtNightCost : 0}
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
                          <select
                            required
                            name="useInWinter"
                            value={quotation.useInWinter ? "yes" : "no"}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
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
                            value={moment(quotation.dateTillUse).format("YYYY-MM-DD")}
                            onChange={handleChangeQuotation}
                            type="date"
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
                          <select
                            required
                            name="handwashing"
                            value={quotation.handwashing ? "yes" : "no"}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
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
                          <select
                            required
                            name="handSanitizerPump"
                            value={quotation.handSanitizerPump ? "yes" : "no"}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
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
                          <select
                            required
                            name="twiceWeeklyService"
                            value={quotation.twiceWeeklyService ? "yes" : "no"}
                            className="form-control"
                            onChange={handleSelectChange}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
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
                            name="special_requirements"
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
                            value={quotation.serviceFrequency}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="serviceFrequency"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Once per week"
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

                      {/* <div className="col-md-5">
                        <div className="form-group">
                          <input
                            className="inline"
                            defaultChecked={true}
                            onChange={ () => setUpdateImmediately(!updateImmediately)}
                            type="checkbox"
                            name="update-immediately"
                            id="update-immediately"
                          />
                          <label
                            className="form-label inline"
                            htmlFor="update-immediately"
                          >
                            Update immediately
                          </label>
                        </div>
                      </div> */}

                      <div></div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Delivery Fee"
                          >
                            Current invoice <div>${subscription.monthlyCost}</div>
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Delivery Fee"
                          >
                            Updated invoice <div>${calculateAnObjValues(servicesPrice) - servicesPrice.pickUpPrice}</div>
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
                              onClick={() => handleSubmit()}
                              className="btn btn-success"
                            >
                              Save Invoice
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

export default IsLoadingHOC(IsLoggedinHOC(EditQuotation));