import { ADMIN_MARK_ATTENDANCE, ADMIN_GET_ATTENDANCE } from 'constant/Constant';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
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
  DropdownItem
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import { ADMIN_CLASS } from 'constant/Constant';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const [attendanceId, setAttendanceId] = useState("");
  const [status, setStatus] = useState("PRESENT");

  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedModalClass, setSelectedModalClass] = useState(1);


  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
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
        setSelectedClass(response.data.data[0]?.id || 1); // Select the first class by default or ID 1
        setSelectedModalClass(response.data.data[0]?.id || 1); // Set modal class default
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };
  useEffect(()=>{
    fetchClasses();
    fetchAttendance();
  },[])

  const fetchAttendance = async (classId) => {
    try {
      const date = '2024-06-12';
      const url = `${ADMIN_GET_ATTENDANCE}?date=${date}&&class_id=${selectedClass}`
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        console.log(response.data.data,'data fetch attendacnce')
        setAttendance(response.data.data);
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
    }
  };
  const markAttendance = async () => {
    try {
      const data = { attendance_id: attendanceId, status: status }
      console.log(data,'data')
      console.log( `Bearer ${localStorage.getItem('token')}`)

      const url = ADMIN_MARK_ATTENDANCE
      const response = await axios.post(url,data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.status) {
        console.log("successfully mark the attendance!!");
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };
  useEffect(() => {
    fetchAttendance();
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
                    <h3 className="mb-0">Attendance</h3>
                  </div>

                  <div className="col text-right">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
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
                    <th scope='col'>Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">class_id</th>
                    <th scope="col">student_id</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item?.id}</td>
                      <td>{item?.user?.first_name}{item?.user?.last_name}</td>
                      <td>{item?.class_id}</td>
                      <td>{item?.student_id}</td>
                      <td>{item?.date}</td>
                      <td>{item?.status}</td>
                      <td>
                      <Button
                          color="primary"
                          size="sm"
                          onClick={()=>{setAttendanceId(item.id);setModalOpen(true);}}
                        >
                          Mark
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
        <ModalHeader toggle={toggleModal}>Mark Attendance</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="class">Attendance Id</Label>
              <Input
                type="number"
                name="class"
                id="class"
                value={attendanceId}
                onChange={(e) => setAttendanceId(e.target.value)}
              >
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option key={1} value="PRESENT">PRESENT</option>
                <option key={2} value="ABSENT">ABSENT</option>
                <option key={3} value="HOLIDAY">HOLIDAY</option>
                <option key={4} value="PENDING">PENDING</option>
              </Input>
            </FormGroup>


            <Button color="primary" onClick={markAttendance}>Submit</Button>
          </Form>
        </ModalBody>
      </Modal>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </>
  )
}

export default Attendance