import React, { useState } from "react";
import "../styles/BookingPage.css";
import {
  Card,
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import Close from "../components/common/CloseButton";
import NavMenu from "../components/layout/NavBarElements";
import { Link } from "react-router-dom";

const Booking = () => {
  const [ticketType, setTicketType] = useState("Regular Ticket");
  const [quantity, setQuantity] = useState(1);

  const ticketPrices = {
    "Select Ticket": 0,
    "Regular Ticket": 200,
    "VIP Ticket": 500,
    "VVIP Ticket": 1000,
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
        className="ticket-section"
        style={{ maxWidth: "800px", margin: "auto" }}
      >
        <Card className="ticket-container">
          <Close />
          <Card.Header className="h3">
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                className="btn-dropdown"
              >
                {ticketType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(ticketPrices).map((type) => (
                  <Dropdown.Item key={type} onClick={() => setTicketType(type)}>
                    {type}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            <Row className="align-items-center">
              <Col>
                <div>
                  {ticketType} <br />
                  Price: ₹{pricePerTicket.toFixed(2)}
                </div>
              </Col>
              <Col>
                <InputGroup>
                  <Button variant="outline-secondary" onClick={decrement}>
                    -
                  </Button>
                  <FormControl
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    style={{ textAlign: "center" }}
                  />
                  <Button variant="outline-secondary" onClick={increment}>
                    +
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col>Qty: {quantity}</Col>
              <Col>Total: ₹{(quantity * pricePerTicket).toFixed(2)}</Col>
            </Row>
            <Link to="/AttendeeDetails">
              <Button variant="dark" className="w-100 mt-2">
                Proceed &gt;
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Booking;
