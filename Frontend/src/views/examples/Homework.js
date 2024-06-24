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
  ModalFooter,
  Toast
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import axios from 'axios';
import { ADMIN_CLASS, ADMIN_GET_SUBJECT, ADMIN_TEACHER, ADMIN_GET_HOMEWORK, ADMIN_UPLOAD_DOC, ADMIN_CREATE_HOMEWORK, ADMIN_DELETE_HOMEWORK } from './../../constant/Constant'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Homework = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(-1);
  const [selectedModalClass, setSelectedModalClass] = useState(-1);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(-1);
  const [fileUrl, setFileUrl] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [error, setError] = useState("");
  const [homeworks, setHomeworks] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);

  const navigate = useNavigate();


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
      if (response.data.status) {
        setClasses(response.data.data);
        // setSelectedClass(response.data.data[0]?.id || 1); // Select the first class by default or ID 1
        // setSelectedModalClass(response.data.data[0]?.id || 1); // Set modal class default
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

  const fetchSubjects = async () => {
    try {
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/subject'
      const url = ADMIN_GET_SUBJECT;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setSubjects(response.data.data);
        // setSelectedSubject(response.data.data[0].id); // Select the first subject by default
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch subject', error);
        toast.error('Failed to fetch subject');
      }
    }
  };

  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/teachers'
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setTeachers(response.data.data);
        // setSelectedTeacher(response.data.data[0].id); // Select the first teacher by default
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch teachers', error);
        toast.error('Failed to fetch teachers');
      }
    }
  };

  const fetchHomeworks = async (classId) => {
    try {
      const url = `${ADMIN_GET_HOMEWORK}/${classId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data, 'fetch homework')
      if (response.data.status) {
        setHomeworks(response.data.data);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to get homeworks', error);
        toast.error('Failed to get homeworks');
      }
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchHomeworks(selectedClass);
    }
  }, [selectedClass]);

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('doc', file);
      const url = ADMIN_UPLOAD_DOC;
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFileUrl(response.data.data);
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to upload file', error);
        toast.error('Failed to upload file');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = ADMIN_CREATE_HOMEWORK;
      const response = await axios.post(url,
        {
          class_id: selectedModalClass,
          subject_id: selectedSubject,
          file_url: fileUrl,
          teacher_id: selectedTeacher,
          date: new Date().toDateString()
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setFileUrl("");
      toggleModal();
      setSelectedModalClass(-1);
      setSelectedTeacher(-1);
      setSelectedSubject(-1);
      if (response.data.status) {
        console.log(response, 'response')
        toast.success("Homework Created Successfully");
        fetchHomeworks(selectedClass);
      } else {
        toast.error(response.data.message.message);
      }

    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to create homework', error);
        toast.error('Failed to create homework');
      }
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  const handleDeleteHomework = async (id) => {
    try {
      const url = `${ADMIN_DELETE_HOMEWORK}/${id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Homework Deleted Successfully!!");
      fetchHomeworks(selectedClass);
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to delete homework', error);
        toast.error('Failed to delete homework');
      }
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
                    <h3 className="mb-0">Homework</h3>
                  </div>

                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={toggleModal}
                      size="sm"
                    >
                      Create <i className="fas fa-plus"></i>
                    </Button>
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} size="sm" color="primary">
                      <DropdownToggle caret>
                        {classes.find(c => c.id === selectedClass)?.class_name || 'Select Class'}
                      </DropdownToggle>
                      <DropdownMenu>
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
                    <th scope="col">Cover Image</th>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homeworks.map((homework, index) => (
                    <tr key={homework.id}>
                      <td>{index + 1}</td>
                      <td>
                        <img src={homework?.book?.cover_image_url} alt="Cover" width="50" />
                      </td>
                      <td>{homework?.book?.subject?.subject_name}</td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => window.open(homework?.file_url, '_blank')}
                        >
                          View
                        </Button>
                        {' '}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteHomework(homework?.id)}
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
        <ModalHeader toggle={toggleModal}>Create Homework</ModalHeader>
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
                <option value={-1}>select class</option>
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
                <option value={-1}>select subjects</option>
                {subjects && subjects.map(subject => (
                  <option key={subject.id} value={subject?.id}>
                    {subject?.subject_name}
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
                <option value={-1}>select teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher?.first_name} {teacher?.last_name}
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
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Homework</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this homework?</p>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-end custom-footer">
          <Button color="btn btn-secondary" size='sm' onClick={() => { setDeleteBox(false); }}>
            Cancel
          </Button>
          <Button color="btn btn-danger" size='sm' onClick={handleDeleteHomework}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Homework;
