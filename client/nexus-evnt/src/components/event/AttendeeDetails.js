import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Close from "../../components/common/CloseButton";
import NavMenu from "../../components/layout/NavBarElements";
import "../../styles/AttendeeDetails.css";
import { Link } from "react-router-dom";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState("");

  const ticketPrices = {
    "Standard Ticket": 200,
    "Premium Ticket": 500,
    "VIP Ticket": 1000,
  };

  const pricePerTicket = ticketPrices[ticketType];

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div>
      <NavMenu />
      <div
        className="attendee-section"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <Card className="attendee-container">
          <Close />
          <Card.Header>
            Attendee Details
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3 w-100" controlId="formGroupUserName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Full Name" />
              </Form.Group>
              <Form.Group className="mb-3 w-100" controlId="formGroupEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter your Email" />
              </Form.Group>
              <Form.Group className="mb-3 w-100" controlId="formGroupPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="number" placeholder="Enter your Phone number" />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-between">
              <span>Qty: {quantity}</span>
              <span>Total: ₹{(quantity * pricePerTicket).toFixed(2)}</span>
            </div>
            <Link to="/OrderSummary">
              <Button variant="dark" className="w-100 mt-2">
                 Continue to Checkout &gt;
              </Button>
           </Link>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;