import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import Header from 'components/Headers/Header.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CLASS, ADMIN_GET_BOOK, ADMIN_UPLOAD_IMAGE, ADMIN_UPLOAD_DOC, ADMIN_CREATE_BOOK, ADMIN_GET_SUBJECT, } from './../../constant/Constant'

const Books = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [newBook, setNewBook] = useState({
    cover: '',
    file: null,
    cover_url: '',
    file_url: '',
    subject: '',
    class: ''
  });
  const [editedBook, setEditedBook] = useState({
    id: null,
    cover: '',
    subject: '',
    class: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);

  // delete
  const [deleteBox, setDeleteBox] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchBooks(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const url = ADMIN_CLASS;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setClasses(response.data.data);
        setSelectedClass(response.data.data[0].id); // Select the first class by default
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

  const fetchBooks = async (classId) => {
    try {
      // const url = `https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/books/${classId}`
      const url = `${ADMIN_GET_BOOK}/${classId}`
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setBooks(response.data.data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      const url = ADMIN_UPLOAD_IMAGE;
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/image'
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewBook({ ...newBook, cover_url: response.data.data });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('doc', file);
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/doc';
      const url = ADMIN_UPLOAD_DOC;
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewBook({ ...newBook, file_url: response.data.data });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBookData = {
        subject_id: newBook.subject,
        class_id: newBook.class,
        cover_image_url: newBook.cover_url,
        file_url: newBook.file_url
      };
      const url = ADMIN_CREATE_BOOK;
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/add/book'
      await axios.post(url, newBookData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setBooks([...books, {
        ...newBook,
        id: books.length + 1,
        class: classes.find(cls => cls.id === newBook.class),
        subject: subjects.find(sub => sub.id === newBook.subject)
      }]);
      setNewBook({
        cover: '',
        file: null,
        cover_url: '',
        file_url: '',
        subject: '',
        class: ''
      });
      toggleModal();
    } catch (error) {
      console.error('Error adding new book:', error);
    }
  };

  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleEdit = (book) => {
    setEditedBook(book);
    toggleEditModal();
  };

  const saveChanges = () => {
    setBooks(books.map(book => (book.id === editedBook.id ? editedBook : book)));
    toggleEditModal();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token)
      navigate("/auth/login")
  }, [])

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
                    <h3 className="mb-0">Books</h3>
                  </div>
                  <div className="col text-right">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                        {classes.find(cls => cls.id === selectedClass)?.class_name || 'Select Class'}
                      </DropdownToggle>
                      <DropdownMenu>
                        {classes.map(cls => (
                          <DropdownItem key={cls.id} onClick={() => setSelectedClass(cls.id)}>
                            {cls.class_name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                    <Button
                      color="primary"
                      href="#pablo"
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
                    <th scope="col">Cover</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Class</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <a href={book.file_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={book.cover_image_url}
                            alt="Book Cover"
                            className="avatar-img"
                            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                          />
                        </a>
                      </td>
                      <td>{book.subject?.subject_name}</td>
                      <td>{book.class?.class_name}</td>
                      <td>
                        <div className="d-flex">
                          <i
                            className="fas fa-edit text-info mr-3"
                            title="Edit"
                            onClick={() => handleEdit(book)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                          <i
                            className="fas fa-trash-alt text-danger"
                            title="Delete"
                            onClick={() => handleDelete(book.id)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                          <a href={book.file_url} download>
                            <i className="fas fa-download text-success ml-3" title="Download"></i>
                          </a>
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
        <ModalHeader toggle={toggleModal}>Create Book</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="cover">Upload Cover Image(jpg or jpeg format only)</Label>
              <Input
                type="file"
                name="cover"
                id="cover"
                onChange={handleImageUpload}
              />
            </FormGroup>
            <FormGroup>
              <Label for="file">Upload Book File(Pdf Format Only)</Label>
              <Input
                type="file"
                name="file"
                id="file"
                onChange={handleFileUpload}
              />
            </FormGroup>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input
                type="select"
                name="subject"
                id="subject"
                value={newBook.subject}
                onChange={(e) => setNewBook({ ...newBook, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.subject_name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input
                type="select"
                name="class"
                id="class"
                value={newBook.class}
                onChange={(e) => setNewBook({ ...newBook, class: e.target.value })}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </Input>
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Book</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="subject">Subject</Label>
            <Input
              type="select"
              name="subject"
              id="subject"
              value={editedBook.subject?.subject_name}
              onChange={(e) => setEditedBook({ ...editedBook, subject: e.target.value })}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.subject_name}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="class">Class</Label>
            <Input
              type="select"
              name="class"
              id="class"
              value={editedBook.class?.class_name}
              onChange={(e) => setEditedBook({ ...editedBook, class: e.target.value })}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveChanges}>Save</Button>{' '}
          <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(!deleteBox) }} centered>
        <ModalHeader toggle={() => { setDeleteBox(!deleteBox); }}>Delete Teacher</ModalHeader>
        <ModalBody>
          <div className='text-l font-semibold'>Are You Sure Want to Delete Teacher?</div>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="secondary" onClick={() => { setDeleteBox(false); }}>Cancel</Button>
          <Button type="submit" style={{ backgroundColor: "red", color: "white" }} onClick={() => { handleDelete(); }}>Delete</Button>
        </ModalFooter>
      </Modal>

    </>
  );
};

export default Books;
