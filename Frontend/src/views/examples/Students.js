import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ModalFooter, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_STUDENTS, ADMIN_CLASS, ADMIN_CREATE_USER, ADMIN_DELETE_SUBJECT } from 'constant/Constant';
import { ADMIN_REMOVE_STUDENT } from 'constant/Constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentExcel from 'Excel/StudentExcel';
import { ADMIN_UPDATE_USER } from 'constant/Constant';
import "./DeleteModal.css"
import { useNavigate } from 'react-router-dom';

const Students = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // delete item
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);
  const token = localStorage.getItem('token');

  // Pagination
  const [pageSize, setPageSize] = useState(25);
  const [NumberBox, setNumberBox] = useState([1, 2]);
  const [indexNumber, setIndexNumber] = useState(0);
  const [activeColor, setActiveColor] = useState(0);

  // Search
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Edit
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(-1);

  const navigate = useNavigate();


  const fetchStudents = async (classId) => {
    try {
      const url = `${ADMIN_STUDENTS}?class_id=${classId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data, "fetch students", selectedClassId);
      if (data.status) {
          setStudents(data.data);
          setData(data.data);
        } else {
          toast(data.msg);
    }
    } catch (error) {
      if(error.response.status==401)
      {
        navigate('/auth/login');
      }else{
        console.log('Failed to fetch student',error);
        toast.error('Failed to fetch student');
      }
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
        // setSelectedClassId(data?.data[0]?.id);
        fetchStudents();
      } else {
        console.error('Failed to fetch classes:', data.message);
      }
    } catch (error) {
      if(error.response.status==401)
      {
        navigate('/auth/login');
      }else{
        console.log('Failed to fetch class',error);
        toast.error('Failed to fetch class');
      }
    }
  };

  // all logic of pagination
  useEffect(() => {
    setNumberBox(Array(parseInt(students.length / pageSize + 1)).fill(1))
    let data = students.slice(parseInt(indexNumber) * parseInt(pageSize), min(parseInt(students.length), (parseInt(indexNumber) + 1) * parseInt(pageSize)));
    setData(data);
  }, [JSON.stringify(students), indexNumber])

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
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudent = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      class_id: selectedClassId,
      role: 'STUDENT',
      password: formData.get('password'),
      confirm_password: formData.get('confirmPassword'),
      phone_no: formData.get('phoneNumber'),
      email: formData.get("email")

    };
    const validationResult = validateForm(formData.get("email"), formData.get('phoneNumber'), formData.get('password'), formData.get('confirmPassword'));
    if (!validationResult['valid']) {
      toast(validationResult['message']);
      return;
    }
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
        toast('Student Created Successfully!!');
        fetchStudents(selectedClassId);
        toggleModal()
      } else {
        console.error('Failed to create student:', data.message);
      }
    } catch (error) {
      if(error.response.status==401)
      {
        navigate('/auth/login');
      }else{
        console.log('Failed to create student',error);
        toast.error('Failed to create student');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const url = `${ADMIN_REMOVE_STUDENT}/${deletedId}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        setStudents(students.filter(student => student.id !== deletedId));
      } else {
        console.error('Failed to delete student:', data.message);
      }
      setDeleteBox(false);
      toast("Student Deleted Successfully!!");
    } catch (error) {
      if(error.response.status==401)
      {
        navigate('/auth/login');
      }else{
        console.log('Failed to remove student',error);
        toast.error('Failed to remove student');
      }
      setDeleteBox(false);
    }
  };

  // Validation Form
  function validateForm(email, mobileNumber, password, confirmPassword) {

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return { "valid": false, "message": 'Invalid email format' };
    }

    // Mobile number validation: 10 digits and numeric
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobileNumber)) {
      return { "valid": false, "message": 'Mobile number must be a 10-digit number' };
    }

    // Password and confirm password validation
    if (password !== confirmPassword) {
      return { "valid": false, "message": "Paswords do not match" };
    } else if (password.length < 6) {
      return { "valid": false, "message": 'Password must be at least 6 characters long' };
    }

    return { "valid": true, "message": "successfully" };
  }



  const handleEditStudent = async (event) => {
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
        fetchStudents(selectedClassId); // Refresh student list
        setModalEditOpen(false); // Close the modal
      } else {
        console.error('Failed to update student:', data.message);
        toast.error(data.message);
      }
    } catch (error) {
      if(error.response.status==401)
      {
        navigate('/auth/login');
      }else{
        console.log('Failed to update students',error);
        toast.error('Failed to update students');
      }
    }
  };


  // minimum function
  const min = (a, b) => {
    if (a < b) return a;
    else return b;
  }

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

// Search component

  useEffect(() => {
    const handleSearch = () => {
      if (!searchText) {
        students.length>0 && setData(students);
      } else {
        const lowerCaseQuery = searchText.toLowerCase();
        const filteredItems = students.filter(item =>
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
      <ToastContainer  />
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
                  <Form className="navbar-search navbar-search-dark bg-primary rounded-pill form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <FormGroup className="mb-0">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Search" type="text" value={searchText} onChange={(e)=>{setSearchText(e.target.value);}} />
                      </InputGroup>
                    </FormGroup>
                  </Form>
                  <div className="col text-right">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} size="sm" color="primary">
                      <DropdownToggle caret>
                        {classOptions.find(c => c.id === selectedClassId)?.class_name || 'Select Class'}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem key={0} onClick={() => handleClassSelect(-1)}>
                          select class
                        </DropdownItem>
                        {classOptions.map(c => (
                          <DropdownItem key={c.id} onClick={() => handleClassSelect(c.id)}>
                            {c.class_name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
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
                    <th scope="col">Enrollment</th>
                    <th scope="col">Name</th>
                    <th scope="col">Class</th>
                    <th scope="col">PhoneNo</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((student) => (
                    <tr key={student.id}>
                      <td className='d-none'>
                      </td>
                      <td>{student?.enrollment_no}</td>
                      <td>{student?.first_name}{student?.last_name}</td>
                      <td>{student?.class?.class_name}</td>
                      <td>{student?.phone_no}</td>
                      <td>{student?.email}</td>
                      <td>{student?.status}</td>

                      <td>
                        <div className="row gx-2">
                          <i className="fas fa-edit text-primary p-2"
                            title="Update"
                            onClick={() => { setEditData(student); setEditId(student.id); setModalEditOpen(true); }}
                            style={{ cursor: "pointer" }}>
                          </i>
                          <i
                            className="fas fa-trash-alt text-danger p-2"
                            title="Delete"
                            onClick={() => { setDeleteBox(true); setDeletedId(student?.id); }}
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

      {/* Download Excel */}


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
            <div className="d-flex justify-content-end" ><StudentExcel client={students} /></div>
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


          {/* Right part */}
        </div>
      </div>


      {/*Create Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered scrollable >
        <ModalHeader toggle={toggleModal}>Create Student</ModalHeader>
        <ModalBody className='m-4'>
          <Form onSubmit={handleSubmit} >
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
              <Input type="select" name="class" id="class" value={selectedClassId} onChange={(e) => { console.log(e.target.value); setSelectedClassId(e.target.value) }}>
                <option value={-1}>Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option.id}>{option.class_name} {option._id}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Mobile Number</Label>
              <Input type="number" name="phoneNumber" id="phoneNumber" placeholder="Enter Phone Number" />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email Address</Label>
              <Input type="text" name="email" id="email" placeholder="Enter Email Address" />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modalEditOpen} toggle={() => setModalEditOpen(false)} centered>
        <ModalHeader toggle={() => setModalEditOpen(false)}>Edit Student Details</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleEditStudent}>
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

      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Student</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this student?</p>
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
    </>
  );
};

export default Students;
