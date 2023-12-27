import React, { useState, useRef } from "react";
import { authAxios } from "../config/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { acceptedFileTypes } from "../Helper/constants";

interface MyComponentProps {
  getProductsListData: () => void;
}

interface MyState {
  title: string;
  description: string;
  product_images: any[];
  product_price: number;
  product_type: string;
}

const AddProduct = (props: MyComponentProps) => {
  const navigate = useNavigate();
  const { getProductsListData } = props;

  const [product, setProduct] = useState<MyState>({
    title: "",
    description: "",
    product_images: [],
    product_price: 0,
    product_type: "",
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("This field is required")
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must not exceed 50 characters"),
    description: Yup.string()
      .required("This field is required")
      .min(5, " Description must be at least 5 characters"),
    product_price: Yup.number()
      .required("This field is required")
      .min(0, "Product price must be at least 0 "),
    product_type: Yup.string()
      .required("This field is required")
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MyState>({
    resolver: yupResolver(validationSchema),
  });

  const handleSubmitData = async (data: MyState) => {
    const product = data;
    const formData = new FormData();
    product.product_images.forEach((file) => {
      formData.append(`product_image`, file);
    });

    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("product_price", product.product_price.toString());
    formData.append("product_type", product.product_type);
    await authAxios()
      .post("/product/add-products", formData)
      .then(
        (response) => {
          if (response.data.status === 1) {
            toast.success(response.data.message);
            navigate("/products");
            reset();
            getProductsListData();
          } else {
            toast.error(response.data.message);
          }
        },
        (error) => {
          toast.error(error.response.data.message);
          console.log(error);
        }
      )
      .catch((error) => {
        console.log("errorr", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "product_price") {
      setProduct((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const files = e.target.files;
    if (!files) {
      return;
    }
    console.log("files", files);
    setProduct((prev) => ({
      ...prev,
      [name]: files,
    }));
  };

  return (
    <>
      <div
        className="nk-add-product toggle-slide toggle-slide-right"
        data-content="addProduct"
        data-toggle-screen="any"
        data-toggle-overlay="true"
        data-toggle-body="true"
        data-simplebar
      >
        <div className="nk-block-head">
          <div className="nk-block-head-content">
            <h5 className="nk-block-title">New Product</h5>
            <div className="nk-block-des">
              <p>Add information and add new product.</p>
            </div>
          </div>
        </div>
        <div className="nk-block">
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <div className="row g-3">
              <div className="col-12">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <div className="form-control-wrap">
                    <input
                      required
                      {...register("title")}
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      type="text"
                      name="title"
                      id="inputEmail4"
                      placeholder="Enter product name"
                    />
                    <div className="invalid-feedback">
                      {errors.title?.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-mb-6">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <div className="form-control-wrap">
                    <select
                      required
                      {...register("product_type")}
                      className={`form-control ${
                        errors.product_type ? "is-invalid" : ""
                      }`}
                      name="product_type"
                    >
                      <option value="">Select Type</option>
                      <option value="Standard">Standard</option>
                      <option value="Flushing">Flushing</option>
                      <option value="Standard with sink">
                        Standard With Sink
                      </option>
                      <option value="Wheelchair accessible">
                        Wheelchair Accessible
                      </option>
                      <option value="Restroom trailer">Restroom Trailer</option>
                    </select>
                    <div className="invalid-feedback">
                      {errors.product_type?.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-mb-6">
                <div className="form-group">
                  <label className="form-label">Rent Price</label>
                  <div className="form-control-wrap">
                    <input
                      required
                      min={0}
                      {...register("product_price")}
                      className={`form-control ${
                        errors.product_price ? "is-invalid" : ""
                      }`}
                      type="number"
                      name="product_price"
                      placeholder="Rent price"
                      id="sale-price"
                    />
                    <div className="invalid-feedback">
                      {errors.product_price?.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <div className="form-control-wrap">
                    <textarea
                      required
                      {...register("description")}
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      id="inputEmail4"
                      name="description"
                      placeholder="Enter description"
                    />
                    <div className="invalid-feedback">
                      {errors.description?.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label className="form-label">Upload Image</label>
                  <div className="form-control-wrap">
                    <input
                      required
                      multiple
                      type="file"
                      {...register("product_images", { required: true })}
                      className="form-control"
                      id="inputPassword4"
                      placeholder="upload image"
                      accept={acceptedFileTypes}
                    />
                    <div className="invalid-feedback">
                      {errors.product_images ? "This field is required" : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  <em className="icon ni ni-plus"></em>
                  <span>Add New</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
