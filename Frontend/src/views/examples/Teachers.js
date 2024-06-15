import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_TEACHER,ADMIN_CREATE_USER,ADMIN_REMOVE_TEACHER } from 'constant/Constant';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Teachers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem('token');

  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`}
      });
      const data = await response.json();
      if (data.status) {
        setTeachers(data.data);
        toast.success("Successfully fetch the data");
      } else {
        toast.error(data.message);
        console.error('Failed to fetch teachers:', data.message);
      }
    } catch (error) {
      toast.error(error);
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTeacher = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      role: 'TEACHER',
      email: formData.get('email'),
      password: formData.get('password'),
      confirm_password: formData.get('confirmPassword'),
      phone_no: formData.get('mobileNo')
    };

    try {
      const url = ADMIN_CREATE_USER;
      const response = await fetch(ADMIN_CREATE_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTeacher)
      });
      const data = await response.json();
      if (data.status) {
        console.log('Teacher created successfully:', data.message);
        toggleModal();
        toast.success("Teacher Created Successfully");
        fetchTeachers();
      } else {
        toast.error(data.message);
        console.error('Failed to create teacher:', data.message);
      }
    } catch (error) {
      toast(error);
      console.error('Error creating teacher:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${ADMIN_REMOVE_TEACHER}/${id}`;
      const response = await fetch(url ,{
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        toast.success("Successfully deleted");
        setTeachers(teachers.filter(teacher => teacher.id !== id));
      } else {
        console.error('Failed to delete teacher:', data.message);
        toast.warn(data.message);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error(error);
    }
  };

  return (
    <>
      <ToastContainer/>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5 justify-content-center">
          <Col className="mb-5 mb-xl-0" xl="10">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Teachers</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={toggleModal}
                      size="sm"
                    >
                      Create <i className='fas fa-plus'></i>
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className='d-none'>Img</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Mobile No.</th>
                    <th scope="col">Email</th>
                    <th scope='col'>Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className='d-none'>
                        <Link to="/teacher-profile">
                          <img 
                            src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/avatar-icon.png" 
                            alt="Avatar" 
                            className="avatar-img" 
                            style={{ width: "40px", height: "40px", cursor: "pointer" }} 
                          />
                        </Link>
                      </td>
                      <td>{teacher.first_name}</td>
                      <td>{teacher.last_name}</td>
                      <td>{teacher.phone_no}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.status}</td>
                      <td>
                        <div className="d-flex">
                          <i className="fas fa-trash-alt text-danger" title="Delete" onClick={() => handleDelete(teacher.id)} style={{ cursor: "pointer" }}></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Create Teacher Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Teacher</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" name="firstName" id="firstName" placeholder="Enter First Name" />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input type="text" name="lastName" id="lastName" placeholder="Enter Last Name" />
            </FormGroup>
            <FormGroup>
              <Label for="mobileNo">Mobile No.</Label>
              <Input type="text" name="mobileNo" id="mobileNo" placeholder="Enter Mobile No." />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="Enter Email" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="Enter Password" />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Teachers;
