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
  ModalFooter,
  InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap';

import Header from "components/Headers/Header.js";
import { ADMIN_CLASS } from 'constant/Constant';
import AttendanceExcel from 'Excel/AttendanceExcel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const [attendanceId, setAttendanceId] = useState("");
  const [status, setStatus] = useState("PRESENT");

  const [selectedClass, setSelectedClass] = useState(-1);
  const [selectedModalClass, setSelectedModalClass] = useState(-1);

  // handle delete
  const [deleteBox, setDeleteBox] = useState(false);
  const [deletedId, setDeletedId] = useState(-1);
  // handle Search
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  // edit data
  const [editData, setEditData] = useState(null);
  // choose attendance
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getFormattedDate());

  const navigate = useNavigate();

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
      if (response?.data?.status) {
        setClasses(response.data.data);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch class', error);
        toast.error('Failed to fetch class');
      }
    }
  };
  useEffect(() => {
    fetchClasses();
    fetchAttendance();
  }, [])

  const fetchAttendance = async () => {
    try {
      const url = `${ADMIN_GET_ATTENDANCE}?date=${selectedDate}&&class_id=${selectedClass}`
      console.log(url, 'url')
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response, 'fetch attendance')
      if (response?.data?.status) {
        setAttendance(response?.data?.data);
        setData(response?.data?.data);
      } else {
        setAttendance([]);
        setData([]);
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to get attendance', error);
        toast.error('Failed to get attendance');
      }
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
      if (response?.data?.status) {
        toast.success("successfully mark the attendance!!");
        fetchAttendance();
      }
      toggleModal();
    } catch (error) {
      if (error?.response?.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to mark attendance', error);
        toast.error('Failed to mark attendance');
      }
    }
  };
  useEffect(() => {
    fetchAttendance();
  }, [selectedClass, selectedDate])


  const handleDeleteAttendance = () => {

  }

  // Search component
  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };


  useEffect(() => {
    const handleSearch = () => {
      if (!searchText) {
        attendance.length > 0 && setData(attendance);
      } else {
        const lowerCaseQuery = searchText.toLowerCase();
        const filteredItems = attendance.filter(item =>
          Object.keys(item).some(key =>
            item[key] && item[key].toString().toLowerCase().includes(lowerCaseQuery)
          )
        );
        setData(filteredItems);
      }
    };

    const debouncedSearch = debounce(handleSearch, 300);
    debouncedSearch();

    // Cleanup function to cancel the timeout if the component unmounts or query changes
    return () => {
      if (debouncedSearch.timeoutId) {
        clearTimeout(debouncedSearch.timeoutId);
      }
    };
  }, [searchText]);

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
                    <h3 className="mb-0">Attendance</h3>
                  </div>
                  <Form className="navbar-search navbar-search-dark bg-primary rounded-pill form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <FormGroup className="mb-0">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Search" type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value); }} />
                      </InputGroup>
                    </FormGroup>
                  </Form>
                  <div className="col text-right">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} size="sm" color="primary">
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
                  <div size="sm" color="primary">
                    <input type="date" id="date-input" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); }} />
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope='col'>Enrollment No.</th>
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
                      <td>{item?.user.enrollment_no}</td>
                      <td>{item?.user.first_name}&nbsp;{item?.user?.last_name}</td>
                      <td>{item?.date?.slice(0, 10)}</td>
                      <td>{item?.date?.slice(11, 16)}</td>
                      <td>{item?.status}</td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => { setAttendanceId(item.id); setEditData(item); setModalOpen(true); }}
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
      <div className="d-flex justify-content-end" style={{ marginRight: "140px", marginTop: "20px", marginBottom: "20px" }}><AttendanceExcel client={attendance} /></div>

      {/* Mark Attendance */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Mark Attendance</ModalHeader>
        <ModalBody className='p-4'>
          <Form>
            <FormGroup>
              <Label for="class">Enrollment No</Label>
              <Input
                type="text"
                name="class"
                id="class"
                value={editData?.user?.enrollment_no}
                disabled
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