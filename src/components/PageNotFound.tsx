import React from 'react'
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="nk-app-root">
    <div className="nk-main ">
        <div className="nk-wrap nk-wrap-nosidebar">
        <div className="nk-content ">
                    <div className="nk-block nk-block-middle wide-xs mx-auto">
                        <div className="nk-block-content nk-error-ld text-center">
                            <h1 className="nk-error-head">404</h1>
                            <h3 className="nk-error-title">Oops! Why you’re here?</h3>
                            <p className="nk-error-text">We are very sorry for inconvenience. It looks like you’re try to access a page that either has been deleted or never existed.</p>
                            <Link to="/" className="btn btn-lg btn-primary mt-2">Back To Home</Link>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>
  )
}

export default PageNotFound
