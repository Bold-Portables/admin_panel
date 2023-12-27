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

const InventoryDetails = (props: MyComponentProps) => {
  const { inventory } = useSelector((state: RootState) => state.app);
  const { setLoading } = props;

  useEffect(() => {
    if (inventory && inventory.qrCodeValue) {
      const str = inventory.qrCodeValue;
      const quoteIdRegex = /quotationId=([^&]+)/;
      const match = str.match(quoteIdRegex);
      // Check if there is a match and get the value
      const quoteIdValue = match ? match[1] : null;
      getQuotationDetailsData(quoteIdValue);
    }
  }, []);

  const [coordinator, setCoordinator] = useState({
    name: "",
    email: "",
    cellNumber: "",
  });
  const [eventDetails, setEventDetails] = useState({ eventDate: "" });
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
    quotationType: "",
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
    "placementDate",
    "dateTillUse",
    "status",
    "weeklyHours",
    "maleWorkers",
    "femaleWorkers",
    "totalWorkers",
    "quotationType",
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
            setEventDetails(resData.eventDetails);
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
                            <h4 className="nk-block-title">Inventory Detail</h4>
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
                            <h6 className="overline-title">Inventory</h6>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Product Name</span>
                              <span className="data-value">
                                {inventory?.productName}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Category</span>
                              <span className="data-value">
                                {inventory?.category}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Gender</span>
                              <span className="data-value">
                                {" "}
                                {inventory?.gender}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Status</span>
                              <span className="data-value text-soft">
                                {inventory?.status}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Inventory Type</span>
                              <span className="data-value text-soft">
                                {inventory?.type}
                              </span>
                            </div>
                          </div>
                        </div>

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

export default IsLoadingHOC(IsLoggedinHOC(InventoryDetails));
