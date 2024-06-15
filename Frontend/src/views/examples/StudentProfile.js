import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

const StudentProfile = ({ student }) => {
  const studentData = student || {
    id: 1,
    firstName: 'Arun',
    lastName: 'Kumar',
    email: '(Hidden for privacy)',
    mobileNo: '(Hidden for privacy)',
    enrollmentNo: 'M-1232',
    address: '123 Main Street, Anytown, CA 12345',
    parentName: 'John Doe',
    class: '10th Grade',
    profilePicture: 'https://via.placeholder.com/150',
  };

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h3>Student Profile</h3>
              <img
                src={studentData.profilePicture}
                alt="Student Profile Picture"
                className="img-thumbnail rounded-circle"
              />
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="12" className="text-center"></Col>
                <Col md="12">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th>First Name:</th>
                        <td>{studentData.firstName}</td>
                      </tr>
                      <tr>
                        <th>Last Name:</th>
                        <td>{studentData.lastName}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{studentData.email}</td>
                      </tr>
                      <tr>
                        <th>Mobile No.:</th>
                        <td>{studentData.mobileNo}</td>
                      </tr>
                      <tr>
                        <th>Enrollment No.:</th>
                        <td>{studentData.enrollmentNo}</td>
                      </tr>
                      <tr>
                        <th>Address:</th>
                        <td>{studentData.address}</td>
                      </tr>
                      <tr>
                        <th>Parent Name:</th>
                        <td>{studentData.parentName}</td>
                      </tr>
                      <tr>
                        <th>Class:</th>
                        <td>{studentData.class}</td>
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
  );
};

export default StudentProfile;
