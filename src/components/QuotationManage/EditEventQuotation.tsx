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
  alcoholServed : number;
  payPerUse : number
  fencedOff: number,
  activelyCleaned: number,
}

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  quotationId: string;
  quotationType: string;
  modal: boolean;
  closeModal: (isModal: boolean) => void;
  getListingData: () => void;
}

function EditEventQuotation(props: MyComponentProps) {
  const {
    setLoading,
    quotationId,
    quotationType,
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
  const [eventDetails , setEventDetails] = useState({eventDate : ''})
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
    alcoholServed: false,
    dateTillUse: "",
    placementDate: "",
    status: "",
    maleWorkers: 0,
    femaleWorkers: 0,
    totalWorkers: 0,
  });

  const [vipSection, setVipSection] = useState({
    payPerUse: false,
    fencedOff: false,
    activelyCleaned: false,
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
    alcoholServed: 0,
    payPerUse: 0,
    fencedOff: 0,
    activelyCleaned: 0,
  });

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
    "maleWorkers",
    "femaleWorkers",
    "totalWorkers",
    "alcoholServed",
  ];

  const vipSectionFields = ["payPerUse", "fencedOff", "activelyCleaned"];

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
    "alcoholServed",
    "payPerUse",
    "fencedOff",
    "activelyCleaned",
  ];

  const getProductDetailsData = async () => {
    setLoading(true);
    const payload = { quote_id: quotationId };
    await authAxios()
      .post("/quotation/get-specific-quotation-from-all-collection", payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data.quotation
            const resCoordinateData = resData?.coordinator;
            const quotationData = resData;
            const costDetails = resData?.costDetails;
            const vipSectionData = resData?.vipSection;
            setEventDetails(resData.eventDetails)

            userFields.forEach((field) => {
              setCoordinator((prev) => ({
                ...prev,
                [field]: resCoordinateData[field],
              }));
            });

            QuotationFields.forEach((field) => {
              setQuotation((prev) => ({
                ...prev,
                [field]: quotationData[field],
              }));
            });

            servicePriceFields.forEach((field) => {
              setServicesPrice((prev) => ({
                ...prev,
                [field]: costDetails[field],
              }));
            });

            vipSectionFields.forEach((field) => {
              setVipSection((prev) => ({
                ...prev,
                [field]: vipSectionData[field],
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

  const handleChangeQuotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuotation((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeVipSection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuotation((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCoordinator = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoordinator((prev) => ({ ...prev, [name]: value }));
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
    setLoading(true);
    await authAxios()
      .put(`/quotation/update-quotation-for-event/${quotationId}`, payload)
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
            <h5 className="title">Edit Quotation</h5>
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
                            placeholder="Yes/No"
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
                            Event Date
                          </label>
                          <input
                            disabled
                            value={moment(eventDetails && eventDetails?.eventDate).format(
                              "MMMM Do YYYY"
                            )}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="placementDate"
                            className="form-control"
                            placeholder="Event Date"
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
                            placeholder="DisMale workerstance"
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
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="deliveryPrice"
                            className="form-control"
                            id="femaleWorkers"
                            placeholder="Female workers"
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
                            value={servicesPrice.handWashingCost}
                            disabled={!quotation.handwashing}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="handWashingCost"
                            className="form-control"
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
                            Alcohol Served
                          </label>
                          <input
                            disabled
                            value={quotation.alcoholServed ? "Yes" : "No"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="alcoholServed"
                            className="form-control"
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
                            value={servicesPrice.alcoholServed}
                            disabled={!quotation.alcoholServed}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="alcoholServed"
                            className="form-control"
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
                            Pay Per Use
                          </label>
                          <input
                            disabled
                            value={vipSection.payPerUse ? "Yes" : "No"}
                            onChange={handleChangeVipSection}
                            type="text"
                            name="payPerUse"
                            className="form-control"
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
                            value={servicesPrice.payPerUse}
                            disabled={!vipSection.payPerUse}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="payPerUse"
                            className="form-control"
                            id="payPerUse"
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
                            Fenced Off
                          </label>
                          <input
                            disabled
                            value={vipSection.fencedOff ? "Yes" : "No"}
                            onChange={handleChangeVipSection}
                            type="text"
                            name="fencedOff"
                            className="form-control"
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
                            value={servicesPrice.fencedOff}
                            disabled={!vipSection.fencedOff}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="fencedOff"
                            className="form-control"
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
                            Actively Cleaned
                          </label>
                          <input
                            disabled
                            value={vipSection.activelyCleaned ? "Yes" : "No"}
                            onChange={handleChangeVipSection}
                            type="text"
                            name="activelyCleaned"
                            className="form-control"
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
                            value={servicesPrice.activelyCleaned}
                            disabled={!vipSection.activelyCleaned}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="activelyCleaned"
                            className="form-control"
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
                            Pickup Price
                          </label>
                          <input
                            min={0}
                            value={servicesPrice.pickUpPrice}
                            onChange={handleChangeServicePrice}
                            type="number"
                            name="pickUpPrice"
                            className="form-control"
                            placeholder="Enter pickup Price"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Pickup Price"
                          >
                            Pickup Price <span>{servicesPrice.pickUpPrice}</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-md-3 total-price">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="Pickup Price"
                          >
                          Total Price <span>{calculateAnObjValues(servicesPrice)}</span>
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

export default IsLoadingHOC(IsLoggedinHOC(EditEventQuotation));
