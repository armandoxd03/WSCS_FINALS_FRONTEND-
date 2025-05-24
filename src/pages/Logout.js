import React, {useContext, useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import { Modal, Button } from 'react-bootstrap';

export default function Logout(){
	const { setUser } = useContext(UserContext);
	const [showModal, setShowModal] = useState(true);
	const [redirect, setRedirect] = useState(false);

	useEffect(()=> {
		if (!showModal) {
			localStorage.clear();
			setUser({
				id: null,
				isAdmin: null
			});
			setRedirect(true);
		}
	}, [showModal]);

	if (redirect) {
		return <Redirect to={{pathname: '/login', state: { from: 'logout'}}}/>
	}

	return(
		<Modal
			show={showModal}
			onHide={() => setShowModal(false)}
			centered
			contentClassName="logout-modal-content"
		>
			<Modal.Header closeButton className="border-0">
				<Modal.Title className="w-100 text-center" style={{color: "var(--primary)", fontWeight: 700}}>
					Logging Out
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="text-center" style={{padding: "2rem 1.5rem"}}>
				<p style={{fontSize: "1.1rem", color: "var(--dark)"}}>
					Are you sure you want to logout?
				</p>
			</Modal.Body>
			<Modal.Footer className="d-flex justify-content-center border-0 pb-4">
				<Button 
					variant="secondary"
					className="px-4 py-2"
					onClick={() => setShowModal(false)}
					style={{
						borderRadius: "50px",
						backgroundColor: "var(--secondary)",
						border: "none",
						fontWeight: 600
					}}
				>
					Logout
				</Button>
			</Modal.Footer>
		</Modal>
	);
}