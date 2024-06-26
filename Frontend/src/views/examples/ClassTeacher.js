import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_TEACHER,ADMIN_REMOVE_TEACHER } from 'constant/Constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ADMIN_CLASS } from 'constant/Constant';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREATE_CLASS_TEACHER ,ADMIN_CLASS_TEACHER } from 'constant/Constant';
import { ADMIN_REMOVE_CLASS_TEACHER } from 'constant/Constant';
import axios from 'axios';

const ClassTeacher = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [classTeachers,setClassTeachers]=useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // class
  const [selectedClass, setSelectedClass] = useState(-1);
  const [selectedTeacher,setSelectedTeacher] = useState(-1);
  const [classOptions, setClassOptions] = useState([]);

  // handle delete
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);


  // Edit Teacher Details
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(-1);

  const [data,setData]=useState([]);
  
  // Fetch All Class Teacher 
  const fetchClassTeacher = async () => {
    try {
      const url = ADMIN_CLASS_TEACHER;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log(data,'datat fetch class teacher')
      if (data.status) {
        setClassTeachers(data.data);
        console.log(data.data,'data')
        toast.success("Successfully fetch the class teacher data");
      } else {
        toast.error(data.message);
        console.error('Failed to fetch class teachers:', data.message);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch class teacher', error);
        toast.error('Failed to fetch class teacher');
      }

    }
  };

  // Fetch all teacher
  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status) {
        console.log(data, 'teacher data');
        setTeachers(data.data);
        setData(data.data);
        toast.success("Successfully fetch the data");
      } else {
        toast.error(data.message);
        console.error('Failed to fetch teachers:', data.message);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch teacher', error);
        toast.error('Failed to fetch teacher');
      }

    }
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
      if (data.status) {
        setClassOptions(data.data);
      } else {
        console.error('Failed to fetch classes:', data.message);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch class', error);
        toast.error('Failed to fetch class');
      }
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchClassTeacher();
  }, [])


  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };


  // Create Teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTeacher = {
      teacher_id:selectedTeacher,
      class_id:selectedClass
    };

    try {
      const url = ADMIN_CREATE_CLASS_TEACHER;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTeacher)
      });
      const data = await response.json();
      if (data.status) {
        console.log('Class Teacher created successfully:', data.message);
        toggleModal();
        toast.success(" Class Teacher Created Successfully");
      } else {
        toast.error(data.message);
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
      const url = `${ADMIN_REMOVE_CLASS_TEACHER}`;
      const token = localStorage.getItem('token')
      const response = await axios.put(url, {class_id:selectedClass,teacher_id:selectedTeacher}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response?.data?.status) {
        toast.success("class teacher remove Successfully!!");
        console.log('Timetable updated successfully:', response?.data.message);
      } else {
        toast.error(response.data?.message);
        console.error('Failed to update timetable:', response?.data.message);
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
                    <h3 className="mb-0"> Class Teachers</h3>
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

              {/* Show Teacher Data */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className='d-none'>Img</th>
                    <th scope="col">Teacher</th>
                    <th scope="col">Class</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classTeachers && classTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher?.user?.first_name}&nbsp;{teacher?.user?.last_name}</td>
                      <td>{teacher?.class?.class_name}</td>
                      <td>
                        <div className="d-flex">
                          <i className="fas fa-trash-alt text-danger p-1" title="Delete" onClick={() => { setDeleteBox(true); setSelectedClass(teacher.class_id);setSelectedTeacher(teacher.teacher_id); }} style={{ cursor: "pointer" }}></i>
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

      {/*------------------Create Class Teacher------------------ */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered scrollable>
        <ModalHeader toggle={toggleModal}>Create Class Teacher</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input type="select" name="class" id="class" value={selectedClass} onChange={(e) => { console.log(e.target.value); setSelectedClass(e.target.value) }}>
                <option value={-1}>Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option.id}>{option.class_name} {option._id}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="class">Teacher</Label>
              <Input type="select" name="class" id="class" value={selectedTeacher} onChange={(e) => { console.log(e.target.value); setSelectedTeacher(e.target.value) }}>
                <option value={-1}>Select Class</option>
                {teachers.map((option) => (
                  <option key={option._id} value={option.id}>{option.first_name}</option>
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

    </>
  );
};

export default ClassTeacher;
