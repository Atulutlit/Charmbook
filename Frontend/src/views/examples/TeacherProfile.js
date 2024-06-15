import Header from 'components/Headers/Header';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';


const TeacherProfile = ({ teacher }) => {
  // Sample teacher data (replace with actual data fetching logic)
  const teacherData = teacher || {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    // Omit email and mobile number for privacy reasons (replace with generic text)
    email: '(Hidden for privacy)',
    mobileNo: '(Hidden for privacy)',
    password: '********', // Password field included
    class: '10th Grade', // Assuming teachers also have a class they teach
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image
  };

  return (
    <>
    <Header></Header>
    <div className="container">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow">
            <CardHeader className='d-flex justify-content-between align-items-center '>
              <h3>Teacher Profile</h3>
              <img
                    src={teacherData.profilePicture}
                    alt="Teacher Profile Picture"
                    className="img-thumbnail rounded-circle"
                  />
                  <divider></divider>
            </CardHeader>
            <CardBody>
              <Row >
                <Col md="12" className="text-center">
                 
                </Col>
                <Col md="12">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th>First Name:</th>
                        <td>{teacherData.firstName}</td>
                      </tr>
                      <tr>
                        <th>Last Name:</th>
                        <td>{teacherData.lastName}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{teacherData.email}</td>
                      </tr>
                      <tr>
                        <th>Mobile No.:</th>
                        <td>{teacherData.mobileNo}</td>
                      </tr>
                      <tr>
                        <th>Password:</th>
                        <td>{teacherData.password}</td>
                      </tr>
                      <tr>
                        <th>Class:</th>
                        <td>{teacherData.class}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default TeacherProfile;
