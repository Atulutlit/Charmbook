import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_GET_SUBJECT, ADMIN_CREATE_SUBJECT, ADMIN_DELETE_SUBJECT } from 'constant/Constant';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Subjects = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedSubject, setEditedSubject] = useState({
    id: null,
    name: ''
  });

  // handle delete subject
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const url = ADMIN_GET_SUBJECT;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        setSubjects(data.data);
      } else {
        console.error('Failed to fetch subjects:', data.message);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.error('Failed to fetch Subjects:', error);
        toast.error('Failed to fetch subjects');
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSubject = {
      subject_name: formData.get('subjectName')
    };

    try {
      const url = ADMIN_CREATE_SUBJECT;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSubject)
      });
      const data = await response.json();
      if (data.status) {
        console.log('Subject created successfully:', data.message);
        toggleModal();
        fetchSubjects();
        toast.success("Subject Created Successfully!!");
      } else {
        console.error('Failed to create subject:', data.message);
        toast.warn(data.message);
      }

    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.error('Failed to create Subject:', error);
        toast.error('Failed to fetch subjects');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const url = `${ADMIN_DELETE_SUBJECT}/${deletedId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        console.log('Subject deleted successfully:', data.message);
        setSubjects(subjects.filter(subject => subject.id !== deletedId));
        toast.success("Subject Deleted Successfully!!");
      } else {
        console.error('Failed to delete subject:', data.message);
        toast.warn(data.message);
      }
      setDeleteBox(false);
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to delete subject', error);
        toast.error('Failed to delete subject');
      }
      setDeleteBox(false);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEdit = (subject) => {
    setEditedSubject(subject);
    toggleEditModal();
  };

  const saveChanges = async () => {
    const updatedSubject = {
      subject_name: editedSubject.subject_name
    };

    try {
      const url = `${ADMIN_GET_SUBJECT}/${editedSubject.id}`;
      const token = localStorage.getItem('token');
      const data = await axios.put(url, updatedSubject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(data, 'get subject');
      if (data) {
        console.log('Subject updated successfully:', data.message);
        toast("Subject Updated Successfully!!");
        fetchSubjects(); // Uncomment if you need to refresh the subjects list
        toggleEditModal();
      } else {
        console.error('Failed to update subject:', data.message);
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to update subject', error);
        toast.error('Failed to update subject');
      }
      toggleEditModal();
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
                    <h3 className="mb-0">Subjects</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" onClick={toggleModal} size="sm">
                      Create <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>{subject.subject_name}</td>
                      <td>
                        <div className="d-flex">
                          <i className="fas fa-edit text-info mr-3" title="Edit" onClick={() => handleEdit(subject)} style={{ cursor: 'pointer' }}></i>
                          <i className="fas fa-trash-alt text-danger" title="Delete" onClick={() => { setDeletedId(subject.id); setDeleteBox(true); }} style={{ cursor: 'pointer' }}></i>
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

      {/* Create Subject */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Subject</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="subjectName">Subject Name</Label>
              <Input type="text" name="subjectName" id="subjectName" placeholder="Enter Subject Name" />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Model */}
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Subject</ModalHeader>
        <ModalBody className='p-4'>
          <Form>
            <FormGroup>
              <Label for="subjectName">Subject Name</Label>
              <Input id="subjectName" type="text" value={editedSubject.subject_name} onChange={(e) => setEditedSubject({ ...editedSubject, subject_name: e.target.value })} placeholder="Enter Subject Name" />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveChanges}>Save</Button>{' '}
          <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
        </ModalFooter>
      </Modal>


      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Subject</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this subjects?</p>
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

export default Subjects;
