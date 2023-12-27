import React, { useState} from "react";
import { Circles } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="loaderHolder">
      <div className="loaderMain">
        <Circles
          height="80"
          width="80"
          color="#755DD9"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  );
};

const IsLoadingHOC = (WrappedComponent : any) => {
  function HOC(props: any) {
    const [isLoading, setLoading] = useState<boolean>(false);

    const setLoadingState = (isComponentLoading: boolean) => {
      setLoading(isComponentLoading);
    };

    return (
      <>
        {isLoading && <Loading />}
        <WrappedComponent
          {...props}
          isLoading={isLoading}
          setLoading={setLoadingState}
        />
      </>
    );
  }
  return HOC;
};

export default IsLoadingHOC;
