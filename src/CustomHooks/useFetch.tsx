import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { authAxios } from "../config/config";
import IsLoadingHOC from "./../Common/IsLoadingHOC";

interface MyComponentProps {
  apiEndPoint: string;
  setLoader: (isComponentLoading: boolean) => void;
}

export function useFetch(props: MyComponentProps) {
  const { apiEndPoint, setLoader } = props;
  const [listData, setListData] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);

  useEffect(() => {
    getInvoicesData(apiEndPoint);
  }, [apiEndPoint, currentPage]);

  const getInvoicesData = async (apiEndPoint: string) => {
    setLoader(true);
    await authAxios()
      .get(apiEndPoint)
      .then(
        (response) => {
          setLoader(false);
          if (response.data.status === 1) {
            setListData(response.data.data);
            setTotalCount(1000);
          }
        },
        (error) => {
          setLoader(false);
          toast.error(error.response.data.message);
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  return [
    listData,
    totalCount,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemPerPage,
  ];
}

export default IsLoadingHOC(useFetch);
