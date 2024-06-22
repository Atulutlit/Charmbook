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
import { ADMIN_CLASS, ADMIN_GET_BOOK, ADMIN_UPLOAD_IMAGE, ADMIN_UPLOAD_DOC, ADMIN_DELETE_BOOK, ADMIN_CREATE_BOOK, ADMIN_GET_SUBJECT, ADMIN_UPDATE_BOOK, } from './../../constant/Constant'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ValidationError } from 'ajv';

const Books = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(-1);
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

  // edit
  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);
  const [editId, setEditId] = useState(-1);

  // delete
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);



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
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data.data, 'handle image upload')
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
      const url = ADMIN_UPLOAD_DOC;
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response,'respponse')
      setNewBook({ ...newBook, file_url: response.data.data });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const validateUrl = (url, url1) => {
    const parsedUrl = new URL(url); // Parse the URL
    const path = parsedUrl.pathname; // Get the pathname

    const imageRegex = /\.(jpg|jpeg|JPG|JPEG)$/i;
    const pdfRegex = /\.pdf$/i;

    if (!imageRegex.test(path)) {
      console.log(path, 'url')
      return { "status": false, "message": "Image must be in jpg or Jpeg format" };
    }

    if (!pdfRegex.test(url1))
      return { "status": false, "message": "Book must be in pdf format" };

    return { "status": true, "message": "correct format" };
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
      console.log(newBookData,'new book data')
      const isValid = validateUrl(newBook.cover_url, newBook.file_url);
      if (!isValid.status) {
        toast.error(isValid['message']);
        return;
      }
      const url = ADMIN_CREATE_BOOK;
      await axios.post(url, newBookData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Book Added Successfully!!');
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
      toast.error(error)
    }
  };

  const handleDelete = async () => {
    try {
      const url = `${ADMIN_DELETE_BOOK}?book_id=${deletedId}`;
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setBooks(books.filter(book => book.id !== deletedId));
        toast.success('Book Deleted Successfully!!');
        setDeleteBox(false);
      }
    } catch (error) {
      console.error('Error at Deleting Book:', error);
      toast.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      const url = `${ADMIN_UPDATE_BOOK}`;
      console.log(editedBook, 'editedBook');
      const response = await axios.put(url, editedBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        toast.success('Book Edited Successfully!!');
        toggleEditModal();
      }
    } catch (error) {
      console.error('Error at Deleting Book:', error);
      toast.error(error);
    }
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
      <ToastContainer />
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
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} size="sm" color="primary">
                      <DropdownToggle caret>
                        {classes.find(cls => cls.id === selectedClass)?.class_name || 'Select Class'}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem value={-1} onClick={() => setSelectedClass(-1)}>
                          select class
                        </DropdownItem>
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
                          {/* <i
                            className="fas fa-edit text-info mr-3"
                            title="Edit"
                            onClick={() => {toggleEditModal();setEditedBook(book); console.log(book);}}
                            style={{ cursor: 'pointer' }}
                          ></i> */}
                          <i
                            className="fas fa-trash-alt text-danger"
                            title="Delete"
                            onClick={() => { setDeleteBox(true); setDeletedId(book.id); }}
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

      {/* Create Book */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Book</ModalHeader>
        <ModalBody className='p-4'>
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

      {/* Edit Book */}
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Book</ModalHeader>
        <ModalBody className='p-4'>
          {/* <FormGroup>
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
            </FormGroup> */}
          <FormGroup>
            <Label for="subject">Subject</Label>
            <Input
              type="select"
              name="subject"
              id="subject"
              value={editedBook.subject}
              onChange={(e) => {
                const selectedSubject = JSON.parse(e.target.value); // Parse the selected value
                setEditedBook({ ...editedBook, subject: selectedSubject });
                console.log(selectedSubject, 'selected subject'); // Log the selected subject
              }}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={JSON.stringify(sub)}>
                  {sub.subject_name}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="class">Class</Label>
            <Input
              type="select"
              name="class"
              id="class"
              value={editedBook.class}
              onChange={(e) => setEditedBook({ ...editedBook, class: JSON.parse(e.target.value) })}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={JSON.stringify(cls)}>{cls.class_name}</option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleEditModal}>Cancel</Button>{' '}
          <Button color="secondary" onClick={() => { handleEdit(); }}>Update</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Book</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this book?</p>
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

export default Books;
