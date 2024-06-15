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
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import axios from 'axios';
import {ADMIN_CREATE_CLASS,ADMIN_CLASS, ADMIN_DELETE_CLASS, ADMIN_UPDATE_CLASS} from './../../constant/Constant'
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Classes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [error, setError] = useState("");

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const fetchClasses = async () => {
    try {
      // const url = `https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/class`
      const url = ADMIN_CLASS
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status) {
        setClasses(response.data.data.map(c => ({ id: c.id, name: c.class_name })));
      }
    } catch (error) {
      setError("Failed to fetch classes.");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = ADMIN_CREATE_CLASS;
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/class/create'
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
    } catch (error) {
      setError("Failed to create class.");
    }
  };
  const [showEditBox,setShowEditBox]=useState(false)
  const [selectedId,setSelectedId]=useState(null);
  const [showDeleteBox,setShowDeleteBox]=useState(false);
  const [editData,setEditData]=useState(null)

  const deleteClass=async()=>{
    try {
      const url = `${ADMIN_DELETE_CLASS}/${selectedId}`;
      await axios.delete(url,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowDeleteBox(false);
      toast.success("successfully deleted class!!.")
      fetchClasses();
    } catch (error) {
      console.log(error,'error');
      toast.error("Failed to Create Class!!");
      setError("Failed to create class.");
    }
  }
  const updateClass = async(e)=>{
    e.preventDefault();
    try {
      const url = `${ADMIN_UPDATE_CLASS}/${selectedId}`;
      await axios.put(url,editData,{ headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowEditBox(false);
      toast.success("successfully updated class!!.")
      fetchClasses();
    } catch (error) {
      setError("Failed to create class.");
    }
  }
    
  const handleEdit=(item)=>{
    setShowEditBox(true);
    setSelectedId(item.id);
    setEditData(item);
  }

  const handleDelete=(id)=>{
   setShowDeleteBox(true);
   setSelectedId(id);
  }

  return (
    <>
      <ToastContainer/>
      <Header />
      <Container className="mt--7" fluid>
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
                          <i className="fas fa-trash-alt text-danger" title="Delete" onClick={() => handleDelete(clazz.id)} style={{ cursor: 'pointer' }}></i>
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
        <ModalBody>
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

      {/* -----------Delete Modal Box-------------- */}
      <Modal isOpen={showDeleteBox} toggle={()=>{setShowDeleteBox(false);}} centered>
        <ModalHeader toggle={()=>{showDeleteBox(false);}}>Are you sure want to delete the class?</ModalHeader>
        <ModalBody>
        <div className="d-flex">
        <Button type="submit" color="primary" onClick={()=>{showDeleteBox(false)}}>Cancel</Button>
        <Button type="submit" color="primary" onClick={()=>{deleteClass();}}>Delete</Button>
        </div>
        </ModalBody>
      </Modal>

      {/* ------------------- Update Class ------------------------- */}
      
      <Modal isOpen={showEditBox} toggle={()=>{setShowEditBox(false);}} centered>
        <ModalHeader toggle={()=>{setShowEditBox(false);}}>Edit Class</ModalHeader>
        <ModalBody>
          <Form onSubmit={updateClass}>
            <FormGroup>
              <Label for="className">Class Name</Label>
              <Input
                type="text"
                name="className"
                id="className"
                value={editData?.name}
                onChange={(e) => {setEditData((prevResult)=>{const inputdata={...prevResult};inputdata['name']=e.target.value;return inputdata})}}
                placeholder="Enter Class Name"
                required
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
    </>
  );
};

export default Classes;