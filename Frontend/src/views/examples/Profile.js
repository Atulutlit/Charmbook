import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log('Form is valid:', formData);
    } else {
      // Form has errors, update state to display errors
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <label htmlFor="upload">
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={image ? image : require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </label>
                    <input
                      id="upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>Admin</h3>
                  <div className="h5 mt-4">Principle</div>
                  <div>Name Of School</div>
                  <hr className="my-4" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    Admin information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-username">
                            First Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.firstName}
                            onChange={handleChange}
                            name="firstName"
                            id="input-username"
                            placeholder="First Name"
                            type="text"
                          />
                          {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-username">
                            Last Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.lastName}
                            onChange={handleChange}
                            name="lastName"
                            id="input-username"
                            placeholder="Last Name"
                            type="text"
                          />
                          {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            id="input-email"
                            placeholder="jesse@example.com"
                            type="email"
                          />
                          {errors.email && <span className="text-danger">{errors.email}</span>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            id="input-email"
                            placeholder="Choose Your Password"
                            type="password"
                          />
                          {errors.password && <span className="text-danger">{errors.password}</span>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Confirm Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                            id="input-email"
                            placeholder="Confirm Your Password"
                            type="password"
                          />
                          {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="text-center">
                    <Button className="my-4" color="primary" type="submit">
                      Update
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
