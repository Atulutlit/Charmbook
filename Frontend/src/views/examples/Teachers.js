import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_TEACHER, ADMIN_CREATE_USER, ADMIN_REMOVE_TEACHER } from 'constant/Constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeacherExcel from 'Excel/TeacherExcel';
import { ADMIN_UPDATE_USER, ADMIN_CLASS } from 'constant/Constant';
import { useNavigate } from 'react-router-dom';

const Teachers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // class
  const [selectedClass, setSelectedClass] = useState(-1);
  const [classOptions, setClassOptions] = useState([])

  // handle delete
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);
  const [searchText, setSearchText] = useState("");

  // pagination 
  const [pageSize, setPageSize] = useState(25);
  const [NumberBox, setNumberBox] = useState([1, 2]);
  const [indexNumber, setIndexNumber] = useState(0);
  const [activeColor, setActiveColor] = useState(0);

  const [data, setData] = useState([])

  // Edit Teacher Details
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(-1);

  // Fetch all teacher
  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data?.status) {
        console.log(data, 'teacher data');
        setTeachers(data?.data);
        setData(data?.data);
        toast.success("Successfully fetch the data");
      } else {
        toast.error(data?.message);
        console.error('Failed to fetch teachers:', data?.message);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch teacher', error);
        toast.error('Failed to fetch teacher');
      }

    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const url = ADMIN_CLASS;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data?.status) {
        setClassOptions(data?.data);
      } else {
        console.error('Failed to fetch classes:', data?.message);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch class', error);
        toast.error('Failed to fetch class');
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [])

  // Create Teacher
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
      phone_no: formData.get('mobileNo'),
      class_id: formData.get('class')
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
      if (data?.status) {
        console.log('Teacher created successfully:', data.message);
        toggleModal();
        toast.success("Teacher Created Successfully");
        fetchTeachers();
      } else {
        toast.error(data?.message);
        console.error('Failed to create teacher:', data.message);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to create teacher', error);
        toast.error('Failed to create teacher');
      }
    }
  };

  // Remove Teacher
  const handleDelete = async () => {
    try {
      const url = `${ADMIN_REMOVE_TEACHER}/${deletedId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        toast.success("Successfully deleted");
        setTeachers(teachers.filter(teacher => teacher.id !== deletedId));
      } else {
        console.error('Failed to delete teacher:', data.message);
        toast.warn(data.message);
      }
      setDeleteBox(false);
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to delete teacher', error);
        toast.error('Failed to delete teacher');
      }
      setDeleteBox(false);
    }
  };

  // minimum function
  const min = (a, b) => {
    if (a < b) return a;
    else return b;
  }



  // handleEditTeacher
  const handleEditTeacherDetail = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const url = `${ADMIN_UPDATE_USER}/${editId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData) // Stringify the data
      });

      const data = await response.json();
      if (data.status) {
        console.log('Student updated successfully:', data.message);
        toast.success('Student Updated Successfully!!');
        fetchTeachers();
        setModalEditOpen(false); // Close the modal
      } else {
        console.error('Failed to update teacher:', data.message);
        toast.error(data.message);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to update teacher', error);
        toast.error('Failed to update teacher');
      }
    }
  }

  // all logic of pagination
  useEffect(() => {
    setNumberBox(Array(parseInt(teachers.length / pageSize + 1)).fill(1))
    let data = teachers.slice(parseInt(indexNumber) * parseInt(pageSize), min(parseInt(teachers.length), (parseInt(indexNumber) + 1) * parseInt(pageSize)));
    console.log(data, 'data')
    setData(data);
  }, [JSON.stringify(teachers), indexNumber])

  // Search component
  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };


  useEffect(() => {
    const handleSearch = () => {
      if (!searchText || searchText == "") {
        teachers.length > 0 && setData(teachers);
      } else {
        const lowerCaseQuery = searchText.toLowerCase();
        const filteredItems = teachers.filter(item =>
          Object.keys(item).some(key =>
            item[key] && item[key].toString().toLowerCase().includes(lowerCaseQuery)
          )
        );
        setData(filteredItems);
      }
    };

    const debouncedSearch = debounce(handleSearch, 300);
    debouncedSearch();

    // Cleanup function to cancel the timeout if the component unmounts or query changes
    return () => {
      if (debouncedSearch.timeoutId) {
        clearTimeout(debouncedSearch.timeoutId);
      }
    };
  }, [searchText]);

  return (
    <>
      <ToastContainer containerId="containerI"/>
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
                  <Form className="navbar-search navbar-search-dark bg-primary rounded-pill form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <FormGroup className="mb-0">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Search" type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value); }} />
                      </InputGroup>
                    </FormGroup>
                  </Form>
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

              {/* Show Teacher Data */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className='d-none'>Img</th>
                    <th scope="col">Enrollment No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Mobile No.</th>
                    <th scope="col">Email</th>
                    <th scope="col">Class</th>
                    <th scope='col'>Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((teacher) => (
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
                      <td>{teacher?.enrollment_no}</td>
                      <td>{teacher?.first_name} {teacher?.last_name}</td>
                      <td>{teacher?.phone_no}</td>
                      <td>{teacher?.email}</td>
                      <td>{teacher?.class?.class_name}</td>
                      <td>{teacher?.status}</td>
                      <td>
                        <div className="d-flex">
                          <i className="fas fa-edit p-1" style={{ cursor: "pointer" }} onClick={() => { setModalEditOpen(true); setEditId(teacher.id); setEditData(teacher); }}></i>
                          <i className="fas fa-trash-alt text-danger p-1" title="Delete" onClick={() => { setDeleteBox(true); setDeletedId(teacher.id); }} style={{ cursor: "pointer" }}></i>
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

      {/* Pagination */}
      <div className="container my-5" >
        <div className="row align-items-center">
          {/* Left part */}
          <div className="col-md-4 d-flex flex-row align-items-center">
            <div className="fw-bold ms-3" style={{ fontSize: '16px', padding: "10px" }}>Page&nbsp;Size</div>
            <select className="form-select ms-3" value={pageSize} onChange={(e) => { setPageSize(e.target.value); }} style={{ height: '2rem', width: 'auto' }}>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="col-md-4 d-flex justify-content-center mt-3 mt-md-0">
            <div className="d-flex justify-content-end" ><TeacherExcel client={teachers} /></div>
          </div>

          {/* Bottom part */}
          <div className="col-md-4 d-flex justify-content-end align-items-center mt-3 mt-md-0">
            <div className="d-flex flex-row gap-2">
              <div className="rounded-circle border border-2 bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <i className="fas fa-arrow-left"></i>
              </div>
              {NumberBox.map((item, key) => (
                <div
                  key={key}
                  className={`rounded-circle border text-center d-flex align-items-center justify-content-center ${activeColor === key ? 'bg-white border-primary' : 'bg-light border-light'} cursor-pointer`}
                  style={{ width: '32px', height: '32px', fontFamily: 'Ubuntu', fontWeight: 700, fontSize: '16px', color: '#2D5BFF' }}
                  onClick={() => { setIndexNumber(key); setActiveColor(key); }}
                >
                  {key + 1}
                </div>
              ))}
              <div className="rounded-circle border border-2 bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/*------------------Create Teacher------------------ */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered scrollable>
        <ModalHeader toggle={toggleModal}>Create Teacher</ModalHeader>
        <ModalBody className='p-4'>
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
            <FormGroup>
              <Label for="class">Class</Label>
              <Input type="select" name="class" id="class" value={selectedClass} onChange={(e) => { console.log(e.target.value); setSelectedClass(e.target.value) }}>
                <option value={-1}>Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option.id}>{option.class_name} {option._id}</option>
                ))}
              </Input>
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/*------------------ Delete Box ----------------------*/}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Teacher</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this teacher?</p>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-end custom-footer">
          <Button color="btn btn-secondary" size='sm' onClick={() => { setDeleteBox(false); }}>
            Cancel
          </Button>
          <Button color="btn btn-danger" size='sm' onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>


      {/*------------------- Edit Modal--------------------------- */}
      <Modal isOpen={modalEditOpen} toggle={() => setModalEditOpen(false)} centered scrollable>
        <ModalHeader toggle={() => setModalEditOpen(false)}>Edit Student Details</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleEditTeacherDetail}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter First Name"
                value={editData?.first_name || ''}
                onChange={(e) => setEditData((prevData) => ({ ...prevData, first_name: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter Last Name"
                value={editData?.last_name || ''}
                onChange={(e) => setEditData((prevData) => ({ ...prevData, last_name: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                value={editData?.password || ''}
                onChange={(e) => setEditData((prevData) => ({ ...prevData, password: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input
                type="select"
                name="class"
                id="class"
                value={editData?.class_id || ''}
                onChange={(e) => setEditData((prevData) => ({ ...prevData, class_id: e.target.value }))}
              >
                <option value={-1}>Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option.id}>{option.class_name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Mobile Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter Phone Number"
                value={editData?.phone_no || ''}
                onChange={(e) => setEditData((prevData) => ({ ...prevData, phone_no: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email Address"
                value={editData?.email || ''}
                onChange={(e) => setEditData((prevData) => ({ ...prevData, email: e.target.value }))}
              />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Teachers;
