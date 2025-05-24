import React, { useState, useContext } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import Loading from './Loading';

export default function LoginForm(props) {
    const history = useHistory();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const authenticate = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) throw new Error('Invalid credentials');
                return res.json();
            })
            .then(data => {
                if (data.access) {
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);
                } else {
                    throw new Error('Login failed');
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                setError(err.message || 'Invalid email or password');
                setIsLoading(false);
            });
    };

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch user details');
                return res.json();
            })
            .then(data => {
                setUser({ id: data._id, isAdmin: data.isAdmin });

                Swal.fire({
                    title: 'Login Successful',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    if (props.location.state?.from === 'cart') {
                        history.goBack();
                    } else if (data.isAdmin) {
                        history.push('/products');
                    } else {
                        history.push('/');
                    }
                });
            })
            .catch(err => {
                console.error('Error fetching user details:', err);
                localStorage.removeItem('token');
                setError('Failed to authenticate. Please try again.');
            })
            .finally(() => setIsLoading(false));
    };

    if (user.id) {
        return <Redirect to="/" />;
    }

    return (
        <Row className="justify-content-center" style={{ minHeight: '100vh', alignItems: 'center' }}>
            <Col xs={12} md={6} lg={5} style={{ position: 'relative' }}>
                <Card style={{
                    border: 'none',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                    transform: 'none',
                    transition: 'none'
                }}>
                    <Card.Body style={{ padding: '2rem' }}>
                        <h2 className="text-center mb-4" style={{ fontSize: '1.8rem' }}>Log In</h2>

                        {error && <Alert variant="danger" style={{ marginBottom: '1.5rem' }}>{error}</Alert>}

                        <Form onSubmit={authenticate}>
                            <Form.Group controlId="userEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{
                                        border: '1px solid #ced4da',
                                        boxShadow: 'none',
                                        ':hover': { borderColor: '#ced4da' }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="password" className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        border: '1px solid #ced4da',
                                        boxShadow: 'none',
                                        ':hover': { borderColor: '#ced4da' }
                                    }}
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: 'none',
                                    boxShadow: 'none',
                                    ':hover': {
                                        backgroundColor: '#0d6efd',
                                        transform: 'none'
                                    },
                                    ':active': {
                                        transform: 'none'
                                    }
                                }}
                            >
                                {isLoading
                                    ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                style={{ marginRight: 8 }}
                                            />
                                            Logging In...
                                        </>
                                    )
                                    : 'Log In'
                                }
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <Link
                                to="/register"
                                style={{
                                    color: '#6c757d',
                                    textDecoration: 'none',
                                    ':hover': {
                                        textDecoration: 'none',
                                        color: '#6c757d'
                                    }
                                }}
                            >
                                Don't have an account? Register here
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}