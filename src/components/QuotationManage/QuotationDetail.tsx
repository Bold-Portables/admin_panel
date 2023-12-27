import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { getFormatedDate } from "../../Helper";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

const QuotationDetail = (props: MyComponentProps) => {
  const quote = useSelector((state: RootState) => state.app.quotation);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { setLoading } = props;

  useEffect(() => {
    if (quote && quote._id) {
      getQuotationDetailsData(quote._id);
    }
  }, [quote]);

  const [coordinator, setCoordinator] = useState({
    name: "",
    email: "",
    cellNumber: "",
  });
  const [eventDetails, setEventDetails] = useState({ eventDate: "" });
  console.log("eventDetails", eventDetails);
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
    restrictedAccess: false,
    restrictedAccessDescription: "",
    dateTillUse: "",
    placementDate: "",
    status: "",
    maleWorkers: 0,
    femaleWorkers: 0,
    totalWorkers: 0,
    quotationType: "",
  });

  const [servicesPrice, setServicesPrice] = useState({
    deliveryPrice: 0,
    pickUpPrice: 0,
    specialRequirementsCost: 0,
    numberOfUnitsCost: 0,
    useAtNightCost: 0,
    useInWinterCost: 0,
    handWashingCost: 0,
    handSanitizerPumpCost: 0,
    twiceWeeklyServicing: 0,
    serviceFrequencyCost: 0,
    weeklyHoursCost: 0,
    workersCost: 0,
  });

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
    "restrictedAccess",
    "restrictedAccessDescription",
    "placementDate",
    "dateTillUse",
    "status",
    "weeklyHours",
    "maleWorkers",
    "femaleWorkers",
    "totalWorkers",
    "quotationType",
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

  const getQuotationDetailsData = async (QuotationId: string) => {
    setLoading(true);
    const payload = { quote_id: QuotationId };
    await authAxios()
      .post("/quotation/get-specific-quotation-from-all-collection", payload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data.quotation;
            const resCoordinateData = resData?.coordinator;
            const costDetails = resData?.costDetails;
            const totalPrice = resData?.costDetailsSum;
            setEventDetails(resData?.eventDetails);
            if (totalPrice) {
              setTotalPrice(totalPrice);
            }
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

  return (
    <>
      <div className="nk-content ">
        <div className="container-fluid">
          <div className="nk-content-inner">
            <div className="nk-content-body">
              <div className="nk-block">
                <div className="card">
                  <div className="card-aside-wrap">
                    <div className="card-inner card-inner-lg">
                      <div className="nk-block-head">
                        <div className="nk-block-between d-flex justify-content-between">
                          <div className="nk-block-head-content">
                            <h4 className="nk-block-title">Quotation Detail</h4>
                            <div className="nk-block-des"></div>
                          </div>
                          <div className="d-flex align-center">
                            <div className="nk-tab-actions me-n1"></div>
                            <div className="nk-block-head-content align-self-start d-lg-none">
                              <a
                                href="#"
                                className="toggle btn btn-icon btn-trigger"
                                data-target="userAside"
                              >
                                <em className="icon ni ni-menu-alt-r"></em>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="nk-block">
                        <div className="nk-data data-list">
                          <div className="data-head">
                            <h6 className="overline-title">Project Manger</h6>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Name</span>
                              <span className="data-value">
                                {coordinator?.name}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Email</span>
                              <span className="data-value">
                                {coordinator?.email}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Phone</span>
                              <span className="data-value text-soft">
                                {coordinator?.cellNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="nk-data data-list">
                          <div className="data-head">
                            <h6 className="overline-title">CONTRACT</h6>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Contract Type</span>
                              <span className="data-value">
                                {quotation?.quotationType}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">
                                Distance From Kelowna
                              </span>
                              <span className="data-value">
                                {quotation?.distanceFromKelowna}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Placement Date</span>
                              <span className="data-value">
                                {getFormatedDate(
                                  quotation?.placementDate ||
                                    eventDetails?.eventDate
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Status</span>
                              <span className="data-value text-soft">
                                {quotation?.status}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Number of Unit</span>
                              <span className="data-value text-soft">
                                {quotation?.numUnits}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Male Workers</span>
                              <span className="data-value text-soft">
                                {quotation?.maleWorkers}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Female Workers</span>
                              <span className="data-value text-soft">
                                {quotation?.femaleWorkers}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Total Workers</span>
                              <span className="data-value text-soft">
                                {quotation?.totalWorkers}
                              </span>
                            </div>
                          </div>
                          {quotation.restrictedAccess &&
                            quotation.restrictedAccessDescription && (
                              <div className="data-item">
                                <div className="data-col">
                                  <span className="data-label">
                                    Restricted Access
                                  </span>
                                  <span className="data-value text-soft">
                                    {quotation.restrictedAccessDescription}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="nk-data data-list">
                          <div className="data-head">
                            <h6 className="overline-title">Production Price</h6>
                          </div>
                          {servicesPrice?.deliveryPrice > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Delivery Price
                                </span>
                                <span className="data-value">
                                  {servicesPrice?.deliveryPrice}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.pickUpPrice > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Pick Up Price
                                </span>
                                <span className="data-value">
                                  {servicesPrice?.pickUpPrice}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.numberOfUnitsCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Number Of Units Cost
                                </span>
                                <span className="data-value">
                                  {servicesPrice?.numberOfUnitsCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.useAtNightCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Use Night Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.useAtNightCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.useInWinterCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Use Winter Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.useInWinterCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.handWashingCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Hand Washing Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.handWashingCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.handSanitizerPumpCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Hand Sanitizer Pump Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.handSanitizerPumpCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.twiceWeeklyServicing > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Twice Weekly Servicing
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.twiceWeeklyServicing}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.serviceFrequencyCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Service Frequency Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.serviceFrequencyCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.weeklyHoursCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Weekly Hours Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.weeklyHoursCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.workersCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">Workers Cost</span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.workersCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {servicesPrice?.specialRequirementsCost > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label">
                                  Special Requirements Cost
                                </span>
                                <span className="data-value text-soft">
                                  {servicesPrice?.specialRequirementsCost}
                                </span>
                              </div>
                            </div>
                          )}
                          {totalPrice > 0 && (
                            <div className="data-item">
                              <div className="data-col">
                                <span className="data-label bold">
                                  Total Cost
                                </span>
                                <span className="data-value text-soft">
                                  {totalPrice}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IsLoadingHOC(IsLoggedinHOC(QuotationDetail));
