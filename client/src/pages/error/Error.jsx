import React from 'react'
import { Link } from 'react-router-dom';

import "./Error.scss";

const Error = () => {
    return (

        <div className="error">
            <img src="/img/errorpage.jpg" alt="error" />
            <Link to={`/`}>
                <button>Go back</button>
            </Link>
        </div>
    )
}

export default Error;
