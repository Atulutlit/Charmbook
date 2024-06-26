import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ModalFooter
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import axios from 'axios';
import { ADMIN_CLASS, ADMIN_GET_SUBJECT, ADMIN_TEACHER, ADMIN_GET_TEST, ADMIN_UPLOAD_DOC, ADMIN_CREATE_TEST, ADMIN_DELETE_TEST } from './../../constant/Constant'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(-1);
  const [selectedModalClass, setSelectedModalClass] = useState(-1);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(-1);
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [tests, setTests] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // deleted
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchClasses = async () => {
    try {
      const url = ADMIN_CLASS;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response?.data?.status) {
        setClasses(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const url = ADMIN_GET_SUBJECT;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchTests = async (classId) => {
    try {
      const url = `${ADMIN_GET_TEST}/${classId}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status) {
        console.log(response.data.data, 'data')
        setTests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTests(selectedClass);
    }
  }, [selectedClass]);

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('doc', file);
      const url = ADMIN_UPLOAD_DOC;
      const response = await axios.post(ADMIN_UPLOAD_DOC, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFileUrl(response.data.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = ADMIN_CREATE_TEST;
      await axios.post(url,
        {
          class_id: selectedModalClass,
          subject_id: selectedSubject,
          test_file_url: fileUrl,
          teacher_id: selectedTeacher,
          Date: new Date().toDateString
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setFileUrl("");
      toggleModal();
      toast.success('Test Created Successfully!!');
      fetchTests(selectedClass);
      setSelectedClass(-1);
      setSelectedSubject(-1);
      setSelectedTeacher(-1);
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error(error);
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  const handleDeleteTest = async () => {
    try {
      const url = `${ADMIN_DELETE_TEST}/${deletedId}`
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Deleted Successfully!!");
      fetchTests(selectedClass);
      setDeleteBox(false);
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error(error);
    }
  };

  return (
    <>
      <ToastContainer containerId="containerJ"/>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5 justify-content-center">
          <Col className="mb-5 mb-xl-0" xl="10">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Test</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={toggleModal}
                      size="sm"
                    >
                      Create <i className="fas fa-plus"></i>
                    </Button>
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} size='sm' color="primary">
                      <DropdownToggle caret>
                        {classes.find(c => c.id === selectedClass)?.class_name || 'Select Class'}
                      </DropdownToggle>
                      <DropdownMenu>
                          <DropdownItem key={-1} onClick={() => handleClassChange(-1)}>
                            select class
                          </DropdownItem>
                        {classes.map(c => (
                          <DropdownItem key={c.id} onClick={() => handleClassChange(c.id)}>
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
                    <th scope="col">#</th>
                    <th scope="col">Teacher Name</th>
                    <th scope="col">Class Name</th>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <tr key={test.id}>
                      <td>{index + 1}</td>
                      {/* <td>
                        <img src={test.book.cover_image_url} alt="Cover" width="50" />
                      </td> */}
                      <td>{test?.user?.first_name}</td>
                      <td>{test?.class?.class_name}</td>
                      <td>{test?.subject?.subject_name}</td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => window.open(test.test_file_url, '_blank')}
                        >
                          View
                        </Button>
                        {' '}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => { setDeleteBox(true); setDeletedId(test.id); }}
                        >
                          Delete
                        </Button>
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
        <ModalHeader toggle={toggleModal}>Create Test</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input
                type="select"
                name="class"
                id="class"
                value={selectedModalClass}
                onChange={(e) => setSelectedModalClass(e.target.value)}
              >
                <option key={-1} value={-1}>
                  select class
                </option>
                {classes.map(clazz => (
                  <option key={clazz.id} value={clazz.id}>
                    {clazz.class_name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input
                type="select"
                name="subject"
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option key={-1} value={-1}>
                  select subject
                </option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="teacher">Teacher</Label>
              <Input
                type="select"
                name="teacher"
                id="teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option key={-1} value={-1}>
                  select subject
                </option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="file">File(Pdf Format Only)</Label>
              <Input
                type="file"
                name="file"
                id="file"
                onChange={handleFileUpload}
              />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}


      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(!deleteBox) }} centered>
        <ModalHeader toggle={() => { setDeleteBox(!deleteBox); }}>Delete Teacher</ModalHeader>
        <ModalBody>
          <div className='text-l font-semibold'>Are You Sure Want to Delete Test?</div>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="secondary" onClick={() => { setDeleteBox(false); }}>Cancel</Button>
          <Button type="submit" style={{ backgroundColor: "red", color: "white" }} onClick={() => { handleDeleteTest(); }}>Delete</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Test;
