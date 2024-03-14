import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import Select from "react-select";
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
  // used by event quotes only
  alcoholServed : number;
  payPerUse: number;
  fencedOff: number;
  activelyCleaned: number;
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
    maxWorkers: 0,
    weeklyHours: 0,
    serviceFrequency: "",
    special_requirements: "",
    distanceFromKelowna: 0,
    serviceCharge: 0,
    deliveredPrice: 0,
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
    alcoholServed: false,
    payPerUse: false,
    fencedOff: false,
    activelyCleaned: false,
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
    alcoholServed: 0,
    payPerUse: 0,
    fencedOff: 0,
    activelyCleaned: 0,
  });

  const [vipSection, setVipSection] = useState({
    payPerUse: false,
    fencedOff: false,
    activelyCleaned: false,
  });

  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    eventDate: "",
    eventType: "",
    eventLocation: "",
    eventMapLocation: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  useEffect(() => {
    getCustomerListData()
  }, []);

  const getCustomerListData = async () => {
    setLoading(true);

    // temporary axios call
    await authAxios()
      .get(`/auth/get-all-users?page=${1}&limit=${1000}`)
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
    
    if (name === 'special_requirements' && value === '') {
      setServicesPrice((prev) => ({...prev, ['specialRequirementsCost']: 0}))
    }
  };

  const handleChangeCoordinator = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoordinator((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectUser = (e: any) => {
    if (!e) {
      setCoordinator(defaultCoordinator)
      return
    }

    const coordinator = coordinators.find(user => user._id === e.value);

    coordinator ? setCoordinator(coordinator) :
                  setCoordinator(defaultCoordinator)
  };

  const handleSelectQuoteType = (e: any) => {
    const { value } = e.target
    setQuotationType(value)
  }

  const handleSelectChange = (e: any, vip: boolean = false) => {
    const { name, value } = e.target;

    if (vip) {
      setVipSection((prev) => ({...prev, [name]: value === 'yes' ? true : false}));
        if (value === 'no') {
            setServicesPrice((prev) => ({...prev, [name]: 0}))
          }
    } else {
      setQuotation((prev) => ({ ...prev, [name]: value === 'yes' ? true : 
                                                 value === 'no' ? false :
                                                 value }));
    }

    let cost: string

    switch (name) {
      case 'handwashing':
        cost = 'handWashingCost';
        break;
      case 'twiceWeeklyService':
        cost = 'twiceWeeklyServicing';
        break;
      case 'alcoholServed':
        cost = 'alcoholServed';
        break;
      default:
        cost = `${name}Cost`;
    }

    if (value === 'no') {
      setServicesPrice((prev) => ({...prev, [cost]: 0}))
    }
  };

  const handleChangeServicePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServicesPrice((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async () => {
    let payload: any = 
    { 
      ...quotation,
      vipSection,
      eventDetails,
      costDetails: servicesPrice,
      coordinator: coordinator,
      isAdmin: true,
    };
    setLoading(true);
    await authAxios()
      .post(`/quotation/create-quotation-for-${quotationType}`, payload)
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
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label" htmlFor="full-name">
                            User
                          </label>
                          <Select 
                            onChange={handleSelectUser} 
                            isClearable={true}
                            placeholder="Search by name or email"
                            formatOptionLabel={(option, { context }) => {
                              return context === 'menu' ? `${option.label}` : `${option.label_input}`;
                            }}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: '#f4f6f9',
                                primary: '#854fff',
                              },
                            })}
                            options={coordinators.map((user) => ({ value: user._id, 
                                                                   label: `${user.name} - ${user.email}`, 
                                                                   label_input: `${user.name}`}))} />
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
                            Quote Type
                          </label>
                          <select
                            required
                            name="quotationType"
                            value={quotationType}
                            className="form-control"
                            onChange={handleSelectQuoteType}
                          >
                            <option value="">Select type</option>
                            <option value="construction">Construction</option>
                            <option value="disaster-relief">Disaster Relief</option>
                            <option value="personal-business-site">Individual Needs</option>
                            <option value="farm-orchard-winery">Farm Orchard Winery</option>
                            <option value="event">Special Events</option>
                            <option value="recreational-site">Recreational Sites</option>
                            
                          </select>
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
                          {/* <input
                            disabled
                            value={quotation.designatedWorkers ? "yes" : "no"}
                            onChange={handleChangeQuotation}
                            type="text"
                            name="designatedWorkers"
                            className="form-control"
                            id="inputEmail4"
                            placeholder="Designated workers"
                          /> */}

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
                            value={quotation.placementDate}
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
                            value={quotation.dateTillUse}
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

                      {quotationType === 'event' && (
                      <>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="personal-email"
                          >
                            Alcohol Served
                          </label>
                          <select
                            required
                            name="alcoholServed"
                            value={quotation.alcoholServed ? "yes" : "no"}
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
                          <select
                            required
                            name="payPerUse"
                            value={vipSection.payPerUse ? "yes" : "no"}
                            className="form-control"
                            onChange={(e) => handleSelectChange(e, true)}
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
                          <select
                            required
                            name="fencedOff"
                            value={vipSection.fencedOff ? "yes" : "no"}
                            className="form-control"
                            onChange={(e) => handleSelectChange(e, true)}
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
                          <select
                            required
                            name="activelyCleaned"
                            value={vipSection.activelyCleaned ? "yes" : "no"}
                            className="form-control"
                            onChange={(e) => handleSelectChange(e, true)}
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

                      </>
                      )}

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
                            disabled={!quotation.special_requirements}
                            min={0}
                            value={servicesPrice.specialRequirementsCost}
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
                            type="number"
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
                              onClick={handleSubmit}
                              className="btn btn-success"
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
