import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import UserContext from '../UserContext';
import { Modal, Button } from 'react-bootstrap';

export default function Logout() {
    const { setUser } = useContext(UserContext);
    const [showModal, setShowModal] = useState(true);
    const [doLogout, setDoLogout] = useState(false);
    const history = useHistory();

    const handleConfirmLogout = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });
        setDoLogout(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        // Go back to previous page
        history.goBack();
    };

    if (doLogout) {
        return <Redirect to={{ pathname: '/login', state: { from: 'logout' } }} />;
    }

    if (!showModal) {
        return null;
    }

    return (
        <Modal
            show={showModal}
            onHide={handleCancel}
            centered
            contentClassName="logout-modal-content"
        >
            <Modal.Header className="border-0">
                <Modal.Title className="w-100 text-center" style={{ color: "var(--primary)", fontWeight: 700 }}>
                    Logging Out
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center" style={{ padding: "2rem 1.5rem" }}>
                <p style={{ fontSize: "1.1rem", color: "var(--dark)" }}>
                    Are you sure you want to logout?
                </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center border-0 pb-4">
                <Button
                    variant="secondary"
                    className="px-4 py-2"
                    onClick={handleConfirmLogout}
                    style={{
                        borderRadius: "50px",
                        backgroundColor: "var(--secondary)",
                        border: "none",
                        fontWeight: 600
                    }}
                >
                    Confirm Logout
                </Button>
                <Button
                    variant="outline-secondary"
                    className="px-4 py-2 ms-2"
                    onClick={handleCancel}
                    style={{
                        borderRadius: "50px",
                        fontWeight: 600
                    }}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}