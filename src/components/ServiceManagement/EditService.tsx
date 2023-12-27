import React, { useState, useEffect } from "react";
import { authAxios } from "../../config/config";
import { toast } from "react-toastify";
import IsLoadingHOC from "../../Common/IsLoadingHOC";
import IsLoggedinHOC from "../../Common/IsLoggedInHOC";
import CreatableSelect from "react-select/creatable";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
  modal: boolean;
  itemData: any;
  closeModal: (isModal: boolean) => void;
  getListingData: () => void;
}

function EditService(props: MyComponentProps) {
  const { setLoading, modal, itemData, closeModal, getListingData } = props;
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);

  const [serviceData, setServiceData] = useState({
    name: "",
    categories: [],
    description: "",
  });

  const getCategoryData = async () => {
    setLoading(true);
    await authAxios()
      .get(
        `/service-category/list?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data.serviceCategories;
            setCategories(resData);
            const categoryOptions = resData.map((item:any) => ({
              value: item.category,
              label: item.category,
            }));
            setOptions(categoryOptions);
          } else {
            toast.error(response.data.message);
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
  useEffect(() => {
    if (itemData && itemData.name) {
      setServiceData((prev) => ({
        ...prev,
        name: itemData.name,
        description: itemData.description,
        categories: itemData.categories,
      }));
      if (itemData && itemData.categories && itemData.categories.length > 0) {
        let selectedItem: any = [];
        itemData.categories.map((item: string) =>
          selectedItem.push({ value: item, label: item })
        );
        setSelectedOption(selectedItem);
      }
    }
    getCategoryData();
  }, [itemData]);

  const handleSelectChange = (options: any) => {
    setSelectedOption(options);
    let selected_value: any = [];
    options.map((item: any) => selected_value.push(item.value));
    setServiceData((prev) => ({
      ...prev,
      categories: selected_value,
    }));
  };


  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedCategories: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(options[i].value);
      }
    }
    setServiceData((prev) => ({
      ...prev,
      [name]: selectedCategories, // Use an array to store selected categories
    }));
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = serviceData;
    if (payload.categories.length === 0) {
      toast.error("Service category is required!");
    } else if (payload.description.length < 10) {
      toast.error("Description must be at least 10 characters long!");
    } else {
      setLoading(true);
      await authAxios()
        .put(`/service/update/${itemData._id}`, payload)
        .then(
          (response) => {
            setLoading(false);
            if (response.data.status === 1) {
              toast.success(response.data?.message);
              getListingData();
              closeModal(false);
            } else {
              toast.error(response.data?.message);
            }
          },
          (error) => {
            setLoading(false);
            toast.error(error.response.data?.message);
          }
        )
        .catch((error) => {
          console.log("errorrrr", error);
        });
    }
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
            <h5 className="title">Edit service</h5>
            <div className="tab-content">
              <div className="tab-pane active" id="personal">
                <form onSubmit={handleSubmit}>
                  <div className="row gy-4">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="full-name">
                          Service name
                        </label>
                        <select
                          required
                          name="name"
                          value={serviceData.name}
                          className="form-control"
                          onChange={handleChangeSelect}
                        >
                          <option value="">Select Service</option>
                          <option value="construction">Construction</option>
                          <option value="disaster-relief">
                            Disaster relief
                          </option>
                          <option value="personal-or-business">
                            Personal or business
                          </option>
                          <option value="farm-orchard-winery">
                            Farm orchard winery
                          </option>
                          <option value="event">Special event</option>
                          <option value="recreational-site">Recreational Site</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="full-name">
                          Category
                        </label>
                        <div className="form-group">
                          <label className="form-label" htmlFor="full-name">
                            Category
                          </label>
                          <CreatableSelect
                            isMulti
                            value={selectedOption}
                            options={options}
                            onChange={handleSelectChange}
                          />
                      </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="full-name">
                          Description
                        </label>
                        <textarea
                          required
                          minLength={10}
                          onChange={handleChangeTextArea}
                          name="description"
                          value={serviceData.description}
                          className="form-control"
                          id="description"
                          placeholder="Enter description..."
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

export default IsLoadingHOC(IsLoggedinHOC(EditService));
