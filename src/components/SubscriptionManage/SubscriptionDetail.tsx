import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import { Link } from "react-router-dom";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import {
  getFormatedDate,
  getDateWithoutTime,
  CapitalizeFirstLetter,
  replaceHyphenCapitolize,
} from "../../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

function SubscriptionDetail(props: MyComponentProps) {
  const { setLoading } = props;
  const { invoiceId } = useSelector((state: RootState) => state.app);
  const [paymetData, setPaymentData] = useState<any>(null);
  const [invoiceData, setInvoice] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [subscription, setsubscription] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [inventoriesList, setInventoriesList] = useState<any>(null);

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

  const [servicesPrice, setServicesPrice] = useState({
    deliveryPrice: 0,
    pickUpPrice: 0,
    numberOfUnitsCost: 0,
    useAtNightCost: 0,
    useInWinterCost: 0,
    handWashingCost: 0,
    handSanitizerPumpCost: 0,
    twiceWeeklyServicing: 0,
    serviceFrequencyCost: 0,
    weeklyHoursCost: 0,
    workersCost: 0,
    specialRequirementsCost: 0,
    alcoholServed: 0,
    payPerUse: 0,
    fencedOff: 0,
    activelyCleaned: 0,
  });

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

  useEffect(() => {
    getSubscriptionDetailsData();
  }, []);

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
            const costDetails = resData?.costDetails;
            const totalPrice = resData?.costDetailsSum;
            setInventoriesList(response?.data?.data?.quotation?.inventories)
            if (totalPrice) {
              setTotalPrice(totalPrice);
            }
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

  const getSubscriptionDetailsData = async () => {
    setLoading(true);
    await authAxios()
      .get(`/payment/subscription/${invoiceId}`)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data.payments[0];
            const user = resData.subscription.user;
            const quotationId = resData.subscription?.quotationId;
            getQuotationDetailsData(quotationId);
            const payment = resData.payment;
            setPaymentData(payment);
            setUserData(user);
            setInvoice(resData);
            setsubscription(resData.subscription);
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
    <div className="nk-content">
      <div className="container-fluid">
        <div className="nk-content-inner">
          <div className="nk-content-body">
            <div className="nk-block">
              <div className="invoice invoice--container">
                <div className="invoice--header">
                  <div className="invoice-logo">
                    <img
                      className="logo-dark"
                      src={require("../../images/invoice-logo.png")}
                      alt="logo-dark"
                    />
                  </div>
                  <div className="invoice-download">
                    <h3>Invoice</h3>{" "}
                    <a
                      className="btn btn-icon btn-lg btn-white btn-dim btn-outline-primary"
                      href={paymetData?.invoice_pdf}
                    >
                      <em className="icon ni ni-download"></em>
                    </a>
                  </div>
                </div>
                <div className="invoice-head-center">
                  <h3>Invoice</h3>
                </div>
                <div className="invoice-wrap">
                  <div className="invoice-head">
                    <div className="invoice-contact">
                      <div className="invoice-contact-info">
                        <h4 className="title heading--invoice">
                          {userData &&
                            userData.name &&
                            CapitalizeFirstLetter(userData?.name)}
                        </h4>
                        <div className="details--invoice--list">
                          <ul className="list-plain">
                            <li>
                              <img
                                className="invoice-phone"
                                src={require("../../images/call-invoice.png")}
                                alt="invoice-phone"
                              />
                              <span>{userData?.mobile}</span>
                            </li>
                            <li>
                              <img
                                className="invoice-location"
                                src={require("../../images/location-invoice.png")}
                                alt="invoice-location"
                              />
                              <span>{userData?.address}</span>
                            </li>
                          </ul>
                          <ul className="list-plain">
                            <li className="invoice-id">
                              <span>Subscription ID:</span>
                              <span>
                                {subscription?.subscription
                                  ?.slice(-6)
                                  ?.toUpperCase()}
                              </span>
                            </li>
                            <li className="invoice-date">
                              <span>Date:</span>
                              <span>
                                {" "}
                                {getDateWithoutTime(invoiceData?.createdAt)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-bills-table">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="width-md">Quotation Type</th>
                            <th className="width-small">Male</th>
                            <th className="width-small">Female</th>
                            <th className="width-small" style={{ width: '100px' }}>Total Worker</th>
                            <th className="width-small" style={{ width: '150px' }}>Number of Unit</th>
                            <th className="text-center">Usage</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="height-50"></tr>
                          <tr>
                            <td>
                              {replaceHyphenCapitolize(
                                quotation?.quotationType
                              )}
                            </td>
                            <td className="text-center">
                              {quotation?.maleWorkers}
                            </td>
                            <td className="text-center border-xside">
                              {quotation?.femaleWorkers}
                            </td>
                            <td className="text-center">
                              {quotation?.totalWorkers}
                            </td>
                            <td className="text-center">
                              {quotation.numUnits}
                            </td>
                            <td className="text-center">Delivery</td>
                            <td>${servicesPrice.deliveryPrice}</td>
                          </tr>
                          {servicesPrice.pickUpPrice > 0 && (
                            <tr>
                              <td></td>

                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Pickup</td>
                              <td>${servicesPrice.pickUpPrice}</td>
                            </tr>
                          )}
                          {servicesPrice.numberOfUnitsCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Number Of Units</td>
                              <td>${servicesPrice.numberOfUnitsCost}</td>
                            </tr>
                          )}
                          {servicesPrice.useAtNightCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Night Use</td>
                              <td>${servicesPrice.useAtNightCost}</td>
                            </tr>
                          )}

                          {servicesPrice?.useInWinterCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Winter Use</td>
                              <td>${servicesPrice?.useInWinterCost}</td>
                            </tr>
                          )}

                          {servicesPrice?.handWashingCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Hand Washing</td>
                              <td>${servicesPrice?.handWashingCost}</td>
                            </tr>
                          )}

                          {servicesPrice?.handSanitizerPumpCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">
                                Hand Sanitizer Pump
                              </td>
                              <td>${servicesPrice?.handSanitizerPumpCost}</td>
                            </tr>
                          )}
                          {servicesPrice?.twiceWeeklyServicing > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">
                                Twice Weekly Servicing
                              </td>
                              <td>${servicesPrice?.twiceWeeklyServicing}</td>
                            </tr>
                          )}
                          {servicesPrice?.serviceFrequencyCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">
                                service Frequency Cost
                              </td>
                              <td>${servicesPrice?.serviceFrequencyCost}</td>
                            </tr>
                          )}
                          {servicesPrice?.weeklyHoursCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Weekly Hours</td>
                              <td>${servicesPrice?.weeklyHoursCost}</td>
                            </tr>
                          )}
                          {servicesPrice?.workersCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Workers</td>
                              <td>${servicesPrice?.workersCost}</td>
                            </tr>
                          )}
                          {servicesPrice?.alcoholServed > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Alcohol Served</td>
                              <td>${servicesPrice?.alcoholServed}</td>
                            </tr>
                          )}
                          {servicesPrice?.payPerUse > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Pay Per Use</td>
                              <td>${servicesPrice?.payPerUse}</td>
                            </tr>
                          )}
                          {servicesPrice?.fencedOff > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Fenced Off</td>
                              <td>${servicesPrice?.fencedOff}</td>
                            </tr>
                          )}
                          {servicesPrice?.activelyCleaned > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">Actively Cleaned</td>
                              <td>${servicesPrice?.activelyCleaned}</td>
                            </tr>
                          )}
                          {servicesPrice?.specialRequirementsCost > 0 && (
                            <tr>
                              <td></td>
                              <td className="text-center"></td>
                              <td className="text-center border-xside"></td>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="text-center">
                                Special Requirements
                              </td>
                              <td>${servicesPrice?.specialRequirementsCost}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <span className="border--bottom"></span>
                      <div className="total--bill--div">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Subtotal</td>
                              <td>${totalPrice}</td>
                            </tr>
                            {/* <tr>
                              <td>Processing fee</td>
                              <td>0</td>
                            </tr> */}
                            <tr className="border-y">
                              <td>Grand Total</td>
                              <td>${totalPrice}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {inventoriesList && inventoriesList.length > 0 && (
                        <div className="inventoryListKey">
                          <h3>INVENTORY ASSIGNED (QR ID)</h3>
                          <div className="list--button-key">
                            {inventoriesList.map((item:any, index:any) => (
                              <button className="list--inventory-key" key={index}>
                                {item.qrId}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="bottom--invoice">
                        <h4 className="heading--invoice">Bold Portable</h4>
                        <div className="details--invoice--list">
                          <ul className="list-plain">
                            <li>
                              <img
                                className="invoice-phone"
                                src={require("../../images/call-invoice.png")}
                                alt="invoice-phone"
                              />
                              <span>+0123456789</span>
                            </li>
                            <li>
                              <img
                                className="invoice-location"
                                src={require("../../images/location-invoice.png")}
                                alt="invoice-location"
                              />
                              <span>
                                #6 8860 Jim Bailey Crescent, Kelowna BC V4V 2L7
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="nk-notes ff-italic fs-12px text-soft">
                          {" "}
                          *Invoice was created on a computer and is valid
                          without the signature and seal.{" "}
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
      <div className="alert alert-icon alert-primary" role="alert">
        <em className="icon ni ni-alert-circle"></em>
        <strong>Order has been placed.</strong>
      </div>
    </div>
  );
}

export default IsLoadingHOC(IsLoggedinHOC(SubscriptionDetail));
