import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { Card, CardHeader, Table, Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { ADMIN_GET_SUBJECT,ADMIN_CREATE_SUBJECT,ADMIN_DELETE_SUBJECT} from 'constant/Constant';
import axios from 'axios';

const Subjects = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedSubject, setEditedSubject] = useState({
    id: null,
    name: ''
  });

  const token = localStorage.getItem('token');

  const fetchSubjects = async () => {
    try {
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/subject'
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
      console.error('Error fetching subjects:', error);
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
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/subject'
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
      } else {
        console.error('Failed to create subject:', data.message);
      }
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${ADMIN_DELETE_SUBJECT}/${id}`;
      // const url = `https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/subject/${id}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status) {
        console.log('Subject deleted successfully:', data.message);
        setSubjects(subjects.filter(subject => subject.id !== id));
      } else {
        console.error('Failed to delete subject:', data.message);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEdit = (subject) => {
    setEditedSubject(subject);
    toggleEditModal();
      };
  
  // not working 12/06/2024
  const saveChanges = async () => {
    const updatedSubject = {
      subject_name: editedSubject.subject_name
    };

    try {
      // const url = `https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/subject/${editedSubject.id}`
      const url = `${ADMIN_GET_SUBJECT}/${editedSubject.id}`
      const token = localStorage.getItem('token');
      console.log(url,token,'many more things')
      const response = await fetch(url, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: updatedSubject
      });
      
      const data = await response.json();
      console.log(data,'get subject')
      if (data.status) {
        console.log('Subject updated successfully:', data.message);
        fetchSubjects();
        toggleEditModal();
      } else {
        console.error('Failed to update subject:', data.message);
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  return (
    <>
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
                          <i className="fas fa-trash-alt text-danger" title="Delete" onClick={() => handleDelete(subject.id)} style={{ cursor: 'pointer' }}></i>
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
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Subject</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="subjectName">Subject Name</Label>
              <Input type="text" name="subjectName" id="subjectName" placeholder="Enter Subject Name" />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Subject</ModalHeader>
        <ModalBody>
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
    </>
  );
};

export default Subjects;