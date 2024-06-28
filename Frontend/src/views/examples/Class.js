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
  ModalFooter
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import axios from 'axios';
import { ADMIN_CREATE_CLASS, ADMIN_CLASS, ADMIN_DELETE_CLASS, ADMIN_UPDATE_CLASS } from './../../constant/Constant'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Classes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [error, setError] = useState("");

  // Delete and Edit State
  const [showEditBox, setShowEditBox] = useState(false)
  const [selectedId, setSelectedId] = useState(-1);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [editData, setEditData] = useState(null)

  const navigate = useNavigate();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const fetchClasses = async () => {
    try {
      const url = ADMIN_CLASS
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status) {
        console.log(response.data.data, 'data')
        setClasses(response.data.data.map(c => ({ id: c.id, name: c.class_name })));
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch class', error);
        toast.error('Failed to class class');
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = ADMIN_CREATE_CLASS;
      await axios.post(url,
        { class_name: newClassName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      setNewClassName("");
      toggleModal();
      fetchClasses();
      toast.success('Class Created Successfully!!');
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to create class', error);
        toast.error('Failed to create class');
      }
    }
  };


  // delete class 
  const deleteClass = async () => {
    try {
      console.log(selectedId, 'selected id');
      const url = `${ADMIN_DELETE_CLASS}/${selectedId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowDeleteBox(false);
      toast.success("successfully deleted class!!.")
      fetchClasses();
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to delete class', error);
        toast.error('Failed to delete class');
      }
    }
  }

  // update class logic
  const updateClass = async (e) => {
    e.preventDefault();
    try {
      const url = `${ADMIN_UPDATE_CLASS}/${selectedId}`;
      await axios.put(url, editData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowEditBox(false);
      toast.success("successfully updated class!!.")
      fetchClasses();
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to update class', error);
        toast.error('Failed to update class');
      }
    }
  }

  const handleEdit = (item) => {
    setShowEditBox(true);
    setSelectedId(item.id);
    setEditData(item);
  }

  const handleDelete = (id) => {
    setShowDeleteBox(true);
    setSelectedId(id);
    console.log(id, 'id')
  }


  return (
    <>
      <ToastContainer />
      <Header />
      <Container className="mt--7 mb-5" fluid>
        <Row className="mt-5 justify-content-center">
          <Col className="mb-5 mb-xl-0" xl="10">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Classes</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={toggleModal}
                      size="sm"
                    >
                      Create <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </Row>
              </CardHeader>

              {/* Show all class */}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Class Name</th>
                    <th scope='col'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((clazz, index) => (
                    <tr key={clazz.id}>
                      <td>{index + 1}</td>
                      <td>{clazz.name}</td>
                      <td>
                        <div className="d-flex">
                          <i className="fas fa-edit text-info mr-3" title="Edit" onClick={() => handleEdit(clazz)} style={{ cursor: 'pointer' }}></i>
                          <i className="fas fa-trash-alt text-danger" title="Delete" onClick={() => { handleDelete(clazz.id); }} style={{ cursor: 'pointer' }}></i>
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

      {/* ------------ create class --------------- */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Class</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="className">Class Name</Label>
              <Input
                type="text"
                name="className"
                id="className"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter Class Name"
                required
              />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>


      {/* ------------------- Update Class ------------------------- */}

      <Modal isOpen={showEditBox} toggle={() => { setShowEditBox(false); }} centered>
        <ModalHeader toggle={() => { setShowEditBox(false); }}>Edit Class</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={updateClass}>
            <FormGroup>
              <Label for="className">Class Name</Label>
              <Input
                type="text"
                name="className"
                id="className"
                value={editData?.name}
                onChange={(e) => { setEditData((prevResult) => { const inputdata = { ...prevResult }; inputdata['name'] = e.target.value; return inputdata }) }}
                placeholder="Enter Class Name"
                required
              />
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Delete Box */}
      <Modal isOpen={showDeleteBox} toggle={() => { setShowDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setShowDeleteBox(false); }} className='custom-header'>Delete Class</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this class?</p>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-end custom-footer">
          <Button color="btn btn-secondary" size='sm' onClick={() => { setShowDeleteBox(false); }}>
            Cancel
          </Button>
          <Button color="btn btn-danger" size='sm' onClick={deleteClass}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </>
  );
};

export default Classes;
