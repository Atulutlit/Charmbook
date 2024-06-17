import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_STUDENTS,ADMIN_CLASS,ADMIN_CREATE_USER,ADMIN_DELETE_SUBJECT } from 'constant/Constant';
import { ADMIN_REMOVE_STUDENT } from 'constant/Constant';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Students = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email,setEmail] = useState("");
  const [phoneNumber,setPhoneNumber]=useState("");

  const token = localStorage.getItem('token');

  const fetchStudents = async (classId) => {
    try {
      const url = ADMIN_STUDENTS;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data,"fetch students",selectedClassId);
      if (data.status) {
        setStudents(data.data.filter(student => student.class_id == classId));
      } else {
        console.error('Failed to fetch students:', data.message);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const url = ADMIN_CLASS;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        setClassOptions(data.data);
        setSelectedClassId(data.data[0]?.id || ''); // Select the first class by default
        fetchStudents(data.data[0]?.id || '');
      } else {
        console.error('Failed to fetch classes:', data.message);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClassSelect = (classId) => {
    setSelectedClassId(classId);
    fetchStudents(classId);
  };

  const handleSubmit = async (e) => {
    console.log(selectedClassId,'selectedClassId');
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudent = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      class_id: selectedClassId,
      role: 'STUDENT',
      password: formData.get('password'),
      confirm_password: formData.get('confirmPassword'),
      phone_no:formData.get('phoneNumber'),
      email:formData.get("email")

    };

    try {
      const url = ADMIN_CREATE_USER;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newStudent)
      });
      const data = await response.json();
      if (data.status) {
        console.log('Student created successfully:', data.message);
        toggleModal();
        fetchStudents(selectedClassId);
      } else {
        console.error('Failed to create student:', data.message);
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${ADMIN_REMOVE_STUDENT}/${id}`
      // const url = `https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/student?student_id=${id}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        setStudents(students.filter(student => student.id !== id));
      } else {
        console.error('Failed to delete student:', data.message);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };
  console.log(classOptions,'class options')
  return (
    <>
     <ToastContainer />
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5 justify-content-center">
          <Col className="mb-5 mb-xl-0" xl="10">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Students</h3>
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
                <Row className="align-items-center mt-2">
                  <div className="col">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                        {classOptions.find(c => c.id === selectedClassId)?.class_name || 'Select Class'}
                      </DropdownToggle>
                      <DropdownMenu>
                        {classOptions.map(c => (
                          <DropdownItem key={c.id} onClick={() => handleClassSelect(c.id)}>
                            {c.class_name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className='d-none'>Img</th>
                    <th scope="col">Enrollment</th>
                    <th scope="col">Name</th>
                    <th scope="col">PhoneNo</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className='d-none'>

                      </td>
                      <td>{student?.enrollment_no}</td>
                      <td>{student?.first_name}{student?.last_name}</td>
                      <td>{student?.phone_no}</td>
                      <td>{student?.email}</td>
                      <td>{student?.status}</td>

                      <td>
                        <div className="d-flex">
                          <i 
                            className="fas fa-trash-alt text-danger" 
                            title="Delete" 
                            onClick={() => handleDelete(student.id)} 
                            style={{ cursor: "pointer" }}
                          ></i>
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
      
      {/* Create Student Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Student</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup className='d-none'>
              <Label for="profilePhoto">Upload Profile Photo</Label>
              <Input type="file" name="profilePhoto" id="profilePhoto" />
            </FormGroup>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" name="firstName" id="firstName" placeholder="Enter First Name" />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input type="text" name="lastName" id="lastName" placeholder="Enter Last Name" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="Enter Password" />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
            </FormGroup>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input type="select" name="class" id="class" value={selectedClassId} onChange={(e) => {console.log(e.target.value);setSelectedClassId(e.target.value)}}>
                <option value="">Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option.id}>{option.class_name} {option._id}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Mobile Number</Label>
              <Input type="text" name="phoneNumber" id="phoneNumber" placeholder="Enter Phone Number" />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email Address(optional)</Label>
              <Input type="text" name="email" id="email" placeholder="Enter Email Address" />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Students;
