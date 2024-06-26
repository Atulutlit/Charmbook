import { ADMIN_GET_TIMETABLE, ADMIN_DELETE_TIMETABLE, ADMIN_CREATE_USER, ADMIN_UPDATE_TIMETABLE, ADMIN_TEACHER, ADMIN_GET_SUBJECT } from 'constant/Constant';
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
import { ADMIN_CREATE_TIMETABLE } from 'constant/Constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import TimeTableExcel from 'Excel/TimetableExcel';

const Timetable = () => {
  const [timetablelist, setTimetablelist] = useState([])
  const [timeTable, setTimeTable] = useState([])

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(-1);
  const [selectedModalClass, setSelectedModalClass] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(-1);


  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [period, setPeriod] = useState(1);
  const navigate = useNavigate();

  const [deleteBox, setDeleteBox] = useState(false);

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
        console.log(response.data.data[0]?.id, 'response');
        setSelectedClass(response?.data?.data[0]?.id); // Select the first class by default or ID 1
        setSelectedModalClass(response?.data?.data[0]?.id || 1); // Set modal class default
        fetchTimetable(response?.data?.data[0]?.id);
      }
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Failed to fetch classes:', error);
        toast.error('Failed to fetch classes');
      }
    }
  };
  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response?.data?.status) {
        setTeachers(response?.data?.data);
        setSelectedTeacher(response?.data?.data[0].id); // Select the first teacher by default
      }
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Failed to get teachers:', error);
        toast.error('Failed to get teachers');
      }
    }
  };
  const fetchSubjects = async () => {
    try {
      const url = ADMIN_GET_SUBJECT;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response?.data?.status) {
        setSubjects(response?.data?.data);
        setSelectedSubject(response?.data?.data[0]?.id); // Select the first subject by default
      }
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Failed to fetch subjects:', error);
        toast.error('Failed to fetch subjects');
      }
    }
  };
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
    fetchTimetable();
  }, [])

  const fetchTimetable = async (id) => {
    try {
      const url = `${ADMIN_GET_TIMETABLE}/${id}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response?.data?.status) {
        console.log(response.data.data, 'timetable......')
        setTimeTable(response.data.data);

      } else {
        setTimetablelist([]);
      }
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Failed to fetch timetable:', error);
      }
      setTimetablelist([]);
    }
  };
  useEffect(() => {
    fetchTimetable(selectedClass);
  }, [selectedClass])

  const updateTimetable = async (event) => {
    event.preventDefault();
    try {
      const url = ADMIN_UPDATE_TIMETABLE;
      const token = localStorage.getItem('token')
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {time_table_id:editData.id,start_time:editData.start_time,end_time:editData.end_time}
      });
      const data = await response.json();
      if (data?.status) {
        toast.success("Timetable updated Successfully!!");
        console.log('Timetable updated successfully:', data.message);
      } else {
        toast.error(data?.message);
        console.error('Failed to update timetable:', data.message);
      }
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Failed to update timetable:', error);
        toast.error('Failed to update Timetable');
      }
    }
  };

  const deleteTimetable = async (id) => {
    try {
      const url = `${ADMIN_DELETE_TIMETABLE}/${id}`;
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Deleted Successfully!!");
      fetchTimetable();
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Failed to delete timetable:', error);
        toast.error('Failed to delete Timetable');
      }
    }
  }


  const createTimetable = async (event) => {
    event.preventDefault();
    try {
      const url = ADMIN_CREATE_TIMETABLE;
      const data = {
        class_id: selectedModalClass,
        subject_id: selectedSubject,
        start_time: startTime,
        end_time: endTime,
        period_no: period,
        teacher_id: selectedTeacher
      }
      console.log(data, 'data at create timetable')
      await axios.post(url, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Timetable Created Successfully");
      toggleModal();
      fetchTimetable();
    } catch (error) {
      if(error?.response?.status==401)
      {
        navigate('/auth/login');
      }else{
        console.error('Error creating timetable:', );
        toast.error(error?.response?.data?.message)
      }
    }
  };

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
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
                    <h3 className="mb-0">Timetable</h3>
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
                          <DropdownItem key={c.id} onClick={() => setSelectedClass(c.id)}>
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
                    <th scope="col">Class Id</th>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Start Time</th>
                    <th scope='col'>End Time</th>
                    <th scope='col'>Period</th>
                    <th scope='col'>Teacher Id</th>
                    <th scope='col'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {timeTable && timeTable.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>{item?.class.class_name}</td>
                      <td>{item?.subject?.subject_name}</td>
                      <td>{item?.start_time}</td>
                      <td>{item?.end_time}</td>
                      <td>{item?.period_no}</td>
                      <td>{item?.teacher_id}</td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => { console.log(item, 'item'); setEditData(item); setShowEdit(true); }}
                        >
                          Update
                        </Button>
                        {' '}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => deleteTimetable(item.id)}
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

      {/* Download Excel  */}
      <div className="d-flex justify-content-end" style={{ marginRight: "140px", marginTop: "20px" }}><TimeTableExcel client={timeTable} /></div>

      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Timetable</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={createTimetable}>
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
                <option value={-1}>select subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="subject">Start Time</Label>
              <Input name="class" id="class" type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); }} />
            </FormGroup>

            <FormGroup>
              <Label for="subject">End Time</Label>
              <Input type="time" name="class" id="class" value={endTime} onChange={(e) => { setEndTime(e.target.value); }} />
            </FormGroup>
            <FormGroup>
              <Label for="subject">Period</Label>
              <Input type="number" name="class" id="class" value={period} onChange={(e) => { setPeriod(e.target.value); }} />
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
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Box */}
      <Modal isOpen={showEdit} toggle={() => { setShowEdit(false); }} centered>
        <ModalHeader toggle={() => { setShowEdit(false) }}>Edit Timetable</ModalHeader>
        <ModalBody className='p-4'>
          <Form onSubmit={updateTimetable}>
            <FormGroup>
              <Label for="class">Class</Label>
              <Input
                type="select"
                name="class"
                id="class"
                value={editData.classId}
                onChange={(e) => { setEditData((prev) => { const inputdata = { ...prev }; inputdata['classId'] = e.target.value; return inputdata }) }}
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
                value={editData.subject}
                onChange={(e) => { setEditData((prev) => { const inputdata = { ...prev }; inputdata['subject'] = e.target.value; return inputdata }) }}              >
                <option value={-1}>Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="subject">Start Time</Label>
              <Input name="class" id="class" type="time" value={editData.start_time}
                onChange={(e) => { setEditData((prev) => { const inputdata = { ...prev }; inputdata['start_time'] = e.target.value; return inputdata }) }} />
            </FormGroup>

            <FormGroup>
              <Label for="subject">End Time</Label>
              <Input type="time" name="class" id="class" value={editData.end_time}
                onChange={(e) => { setEditData((prev) => { const inputdata = { ...prev }; inputdata['end_time'] = e.target.value; return inputdata }) }} />
            </FormGroup>
            <FormGroup>
              <Label for="subject">Period</Label>
              <Input type="number" name="class" id="class" value={editData.period_no}
                onChange={(e) => { setEditData((prev) => { const inputdata = { ...prev }; inputdata['period_no'] = e.target.value; return inputdata }) }} />
            </FormGroup>

            <FormGroup>
              <Label for="teacher">Teacher</Label>
              <Input
                type="select"
                name="teacher"
                id="teacher"
                value={editData.teacher_id}
                onChange={(e) => { setEditData((prev) => { const inputdata = { ...prev }; inputdata['teacher_id'] = e.target.value; return inputdata }) }} >

                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </Input>
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
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Timetable</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this timetable?</p>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-end custom-footer">
          <Button color="btn btn-secondary" size='sm' onClick={() => { setDeleteBox(false); }}>
            Cancel
          </Button>
          <Button color="btn btn-danger" size='sm' onClick={deleteTimetable}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Timetable