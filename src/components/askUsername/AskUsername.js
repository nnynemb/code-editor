import React from "react";
import "./AskUsername.scss";

const AskUsername = ({ modalRef, saveUserData, isLoading = false }) => {
    const [userData, setUserData] = React.useState({
        name: "",
        email: "",
    });

    const onChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            {/* Modal */}
            <div
                className="modal fade"
                tabIndex="-1"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">#</span>
                                <input type="text" name="name" onChange={onChange} defaultValue={userData.name} className="form-control" placeholder="Your name" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">@</span>
                                <input type="email" name="email" onChange={onChange} defaultValue={userData.email} className="form-control" placeholder="Your email" aria-label="Email" aria-describedby="basic-addon1" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" type="button" disabled={isLoading} onClick={() => saveUserData(userData)}>
                                {isLoading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving
                                    </span>
                                ) : (
                                    <span>
                                        Save
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskUsername;
