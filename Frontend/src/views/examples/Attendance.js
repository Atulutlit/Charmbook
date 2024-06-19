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
  DropdownItem,
  ModalFooter
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import { ADMIN_CLASS } from 'constant/Constant';
import AttendanceExcel from 'Excel/AttendanceExcel';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // handle delete
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);
  // handle Search
  const [searchText,setSearchText] = useState("");
  const [data,setData]=useState([]);
  // edit data
  const [editData,setEditData]=useState(null);


  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    console.log(classId);
    fetchAttendance();
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
  useEffect(() => {
    fetchClasses();
    fetchAttendance();
  }, [])

  const fetchAttendance = async () => {
    try {
      const date = '2024-06-12';
      const url = `${ADMIN_GET_ATTENDANCE}?date=${date}&&class_id=${selectedClass}`
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        console.log(response.data.data, 'data fetch attendacnce')
        setAttendance(response.data.data);
        setData(response.data.data);
      } else {
        setAttendance([]);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
    }
  };
  const markAttendance = async () => {
    try {
      const data = { attendance_id: attendanceId, status: status }
      console.log(data, 'data')
      console.log(`Bearer ${localStorage.getItem('token')}`)

      const url = ADMIN_MARK_ATTENDANCE
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.status) {
        toast.success("successfully mark the attendance!!");
        fetchAttendance();
      }
      toggleModal();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchAttendance();
  }, [])

  const search = (attendance, searchText) => {
    const searchResults = [];

    for (let i = 0; i < attendance.length; i++) {
      const item = attendance[i];
      if (item.enrollment_no == searchText ||
        item.class_name == searchText ||
        item.student_name == searchText || item.status == searchText) {
        searchResults.push(item);
      }
    }
    setData(searchResults);
  };
  
  const handleDeleteAttendance =()=>{

  }

  return (
    <>
      <ToastContainer/>
      <Header />
      <Container className="mt--7" fluid>
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="d-flex align-items-center justify-content-between search-container">
                <input type="text" className="search-input form-control rounded text-center" placeholder="Search Student Attendance on the basis of Enrollment No." value={searchText} onChange={(e) => { setSearchText(e.target.value); }} />
                <button className="search-button btn btn-primary" onClick={() => { search(attendance, searchText); }}>Search</button>
              </div>
            </div>
          </div>
        </div>
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
                    <th scope='col'>Enrollment No.</th>
                    <th scope="col">className</th>
                    <th scope="col">studentName</th>
                    <th scope="col">Date</th>
                    <th scope='col'>Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((item, index) => (
                    <tr key={item?.id}>
                      <td>{index + 1}</td>
                      <td>{item?.enrollment_no}</td>
                      <td>{item?.class_name}</td>
                      <td>{item?.student_name}</td>
                      <td>{item?.date?.slice(0, 10)}</td>
                      <td>{item?.time}</td>
                      <td>{item?.status}</td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => { setAttendanceId(item.id);setEditData(item); setModalOpen(true); }}
                        >
                          Edit
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
      {/* Download ExcelSheet */}
      <div className="d-flex justify-content-end" style={{marginRight:"140px",marginTop:"20px",marginBottom:"20px"}}><AttendanceExcel client={attendance} /></div>

      {/* Mark Attendance */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Mark Attendance</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="class">Enrollment No</Label>
              <Input
                type="number"
                name="class"
                id="class"
                value={editData?.enrollment_no}
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

      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(!deleteBox) }} centered>
        <ModalHeader toggle={() => { setDeleteBox(!deleteBox); }}>Delete Teacher</ModalHeader>
        <ModalBody>
          <div className='text-l font-semibold'>Are You Sure Want to Delete Attendance?</div>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="secondary" onClick={() => { setDeleteBox(false); }}>Cancel</Button>
          <Button type="submit" style={{ backgroundColor: "red", color: "white" }} onClick={() => { handleDeleteAttendance() }}>Delete</Button>
        </ModalFooter>
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