import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Image, Badge, Button } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import UserContext from '../UserContext';

export default function AppNavBar({ cartCount }) {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();
    const [profilePicture, setProfilePicture] = useState('https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ua_dark_mode') === 'true');
    const [navHistoryCount, setNavHistoryCount] = useState(0);
    const initialPathRef = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== initialPathRef.current) {
            setNavHistoryCount(1);
        } else {
            setNavHistoryCount(0);
        }
    }, [location.pathname]);

    const handleBack = () => {
        history.push(initialPathRef.current);
    };

    useEffect(() => {
        if (user.id) {
            fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(res => res.json())
            .then(data => {
                if (data.profilePicture) {
                    setProfilePicture(data.profilePicture);
                }
            })
            .catch(err => console.error('Error fetching user details:', err));
        }
    }, [user.id]);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('ua_dark_mode', newMode);
            document.documentElement.classList.toggle('ua-dark-mode', newMode);
            return newMode;
        });
    };

    useEffect(() => {
        document.documentElement.classList.toggle('ua-dark-mode', darkMode);
    }, [darkMode]);

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            sticky="top"
            className={`shadow-sm pro-navbar ${darkMode ? 'pro-navbar-dark' : 'pro-navbar-light'}`}
        >
            <Container>
                <div className="d-flex align-items-center me-3">
                    {navHistoryCount > 0 && (
                        <Button
                            variant="link"
                            className="p-0 me-2 pro-navbar-link"
                            style={{
                                color: darkMode ? "var(--primary)" : "#343a40",
                                background: "transparent",
                                fontSize: "1.25rem",
                                boxShadow: "none"
                            }}
                            aria-label="Go back"
                            title="Go back"
                            onClick={handleBack}
                        >
                            <FaArrowLeft />
                        </Button>
                    )}
                    <button
                        className={`pro-mode-toggle-btn ${darkMode ? "ua-dark-btn" : "ua-light-btn"}`}
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        title={darkMode ? "Light mode" : "Dark mode"}
                    >
                        {darkMode
                            ? <BsSunFill size={18} />
                            : <BsMoonFill size={17} />
                        }
                    </button>
                </div>
                <Navbar.Brand as={Link} to="/" className="fw-bold pro-navbar-brand">
                    <span className="pro-navbar-logo">UA</span> Shop
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/products" 
                            active={location.pathname === '/products'}
                            className="pro-navbar-link"
                        >
                            {user.isAdmin ? 'Admin Dashboard' : 'Products'}
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {user.id ? (
                            <>
                                {!user.isAdmin && (
                                    <>
                                        <Nav.Link as={Link} to="/cart" className="position-relative mx-2 pro-navbar-link">
                                            <FaShoppingCart size={19} className="me-1" />
                                            {(cartCount > 0) && (
                                                <Badge pill bg="danger" className="pro-cart-badge">
                                                    {cartCount}
                                                </Badge>
                                            )}
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/orders" className="mx-2 pro-navbar-link">
                                            Orders
                                        </Nav.Link>
                                    </>
                                )}
                                <Nav.Link as={Link} to="/profile" className="mx-2 pro-navbar-link">
                                    <Image 
                                        src={profilePicture}
                                        roundedCircle
                                        width="32"
                                        height="32"
                                        className="border border-white shadow-sm pro-navbar-profile"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png';
                                        }}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Nav.Link>
                                <Nav.Link as={Link} to="/logout" className="mx-2 pro-navbar-link">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/login" 
                                    active={location.pathname === '/login'}
                                    className="mx-2 pro-navbar-link"
                                >
                                    Login
                                </Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/register" 
                                    active={location.pathname === '/register'}
                                    className="mx-2 pro-navbar-link"
                                >
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
