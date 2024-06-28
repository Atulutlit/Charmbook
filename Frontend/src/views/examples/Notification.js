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
import { ADMIN_CLASS, ADMIN_GET_NOTIFICATION, ADMIN_ADD_NOTIFICATION } from './../../constant/Constant'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(-1);
  // notification
  const [notification, setNotification] = useState([])

   // only for pagination
   const [pageSize, setPageSize] = useState(10);
   const [NumberBox, setNumberBox] = useState([]);
   const [indexNumber, setIndexNumber] = useState(0);
   const [activeColor, setActiveColor] = useState(0);
   const [data, setData] = useState([]);

   
  // minimum function
  const min = (a, b) => {
    if (a < b) return a;
    else return b;
  }

  const navigate = useNavigate();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = ADMIN_ADD_NOTIFICATION;
      await axios.post(url,
        { title: title, message: message, class_id: selectedClassId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      toggleModal();
      toast.success('Notification Created Successfully!!');
      setSelectedClassId(-1);
      setTitle("");
      setMessage("");
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to create notification', error);
        toast.error('Failed to create notification');
      }
    }
  };


  const fetchNotificaiton = async () => {
    try {
      const url = ADMIN_GET_NOTIFICATION;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response?.data?.status) {
        console.log(response?.data?.data, 'data')
        setNotification(response?.data?.data);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch notification', error);
        toast.error('Failed to notification');
      }
    }
  };

  const fetchClasses = async () => {
    try {
      const url = ADMIN_CLASS
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response?.data?.status) {
        console.log(response?.data?.data, 'data')
        setClasses(response?.data?.data)
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
    fetchNotificaiton();
    fetchClasses();

  }, []);

    // all logic of pagination
    useEffect(() => {
      setNumberBox(Array(parseInt(notification.length / pageSize + 1)).fill(1))
      let data = notification.slice(parseInt(indexNumber) * parseInt(pageSize), min(parseInt(notification.length), (parseInt(indexNumber) + 1) * parseInt(pageSize)));
      setData(data);
    }, [JSON.stringify(notification), indexNumber])
  



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
                    <h3 className="mb-0">Notification</h3>
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
                    <th scope="col">Title</th>
                    <th scope='col'>Message</th>
                    <th scope='col'>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.message}</td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ------------ create notification--------------- */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Notification</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="className">Title</Label>
              <Input
                type="text"
                name="className"
                id="className"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Notification"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="className">Message</Label>
              <Input
                type="text"
                name="className"
                id="className"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Message"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input type="select" name="class" id="class" value={selectedClassId} onChange={(e) => { console.log(e.target.value); setSelectedClassId(e.target.value) }}>
                <option value={-1}>Select Class</option>
                {classes.map((option) => (
                  <option key={option._id} value={option.id}>{option.class_name} {option._id}</option>
                ))}
              </Input>
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Pagination */}
      <div className="container" style={{ "margin": "40px" }}>
        <div className="row align-items-center">
          {/* Left part */}
          <div className="col-md-4 d-flex flex-row align-items-center">
            <div className="fw-bold ms-3 p-2" style={{ fontSize: '16px' }}>Page&nbsp;Size</div>
            <select className="form-select ms-3" value={pageSize} onChange={(e) => { setPageSize(e.target.value); }} style={{ height: '2rem', width: 'auto' }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Bottom part */}
          <div className="col-md-4 d-flex justify-content-center mt-3 mt-md-0">
            {/* Showing 0 to 10 of 246 entries */}
          </div>

          {/* Right part */}
          <div className="col-md-4 d-flex justify-content-end align-items-center mt-3 mt-md-0">
            <div className="d-flex flex-row gap-2">
              <div className="rounded-circle border border-2 bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <i className="fas fa-arrow-left"></i>
              </div>
              {NumberBox.map((item, key) => (
                <div
                  key={key}
                  className={`rounded-circle border text-center d-flex align-items-center justify-content-center ${activeColor === key ? 'bg-white border-primary' : 'bg-light border-light'} cursor-pointer`}
                  style={{ width: '32px', height: '32px', fontFamily: 'Ubuntu', fontWeight: 700, fontSize: '16px', color: '#2D5BFF', cursor: "pointer" }}
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
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </>
  );
};

export default Notification;
