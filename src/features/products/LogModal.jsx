import {useState, forwardRef, useImperativeHandle} from "react";

const getDate = (date) => {
    return new Date(date).toLocaleString("en-GB", {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"});
}

function LogModal({productLog}, ref) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal: () => setIsModalOpen(true)
    }));

    const closeModal = () => setIsModalOpen(false);

    const handleOutsideClick = (e) => {
        if(e.target.className === "modal"){
            closeModal();
        }
    }

    if(!isModalOpen) return null;

    return (
        <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-container adjustiable-container">
                <div className="modal-header-container">
                    <button className="close-btn" onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body-cobtainer">
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th className="nowrap">Username</th>
                                <th className="nowrap">Operation Time</th>
                                <th className="nowrap">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productLog.map(logItem => (
                                <tr className="row" key={logItem.operationTime}>
                                    <td className="nowrap">{logItem.username}</td>
                                    <td className="expand">{getDate(logItem.operationTime)}</td>
                                    <td className="nowrap">{logItem.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(LogModal)