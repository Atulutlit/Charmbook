import { ADMIN_GET_TIMETABLE, ADMIN_DELETE_TIMETABLE, ADMIN_CREATE_USER, ADMIN_UPDATE_TIMETABLE, ADMIN_TEACHER, ADMIN_GET_SUBJECT } from 'constant/Constant';
import React, { useState } from 'react'
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

const Schedule = () => {

  const [timetablelist, setTimetablelist] = useState([])
  const [timeTable, setTimeTable] = useState({ "classId": "", "subjectId": "", "startTime": "", "endTime": "", "periodNo": "", "teacherId": "" })

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedModalClass, setSelectedModalClass] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);


  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [period, setPeriod] = useState(1);



  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const fetchClasses = async () => {
    try {
      const response = await axios.get('https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/class', {
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
  const fetchTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      // const url = 'https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/teachers'
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setTeachers(response.data.data);
        setSelectedTeacher(response.data.data[0].id); // Select the first teacher by default
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
        setSelectedSubject(response.data.data[0].id); // Select the first subject by default
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTimetable = async (classId) => {
    try {
      const url = ADMIN_GET_TIMETABLE;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setTimetablelist(response.data.data);
      } else {
        setTimetablelist([]);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetablelist([]);
    }
  };

  const updateTimetable = async () => {
    const updatedTimetable = {
      class_id: timeTable.classId,
      subject_id: timeTable.subjectId,
      start_time: timeTable.startTime,
      end_time: timeTable.endTime,
      period_no: timeTable.periodNo,
      teacher_id: timeTable.teacherId
    };

    try {
      const url = ADMIN_UPDATE_TIMETABLE;
      const token = localStorage.getItem('token')
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTimetable)
      });
      const data = await response.json();
      if (data.status) {
        console.log('Timetable updated successfully:', data.message);
        fetchTimetable();
      } else {
        console.error('Failed to update timetable:', data.message);
      }
    } catch (error) {
      console.error('Error updating timetable:', error);
    }
  };

  const deleteTimetable = async (classId) => {
    try {
      const url = ADMIN_DELETE_TIMETABLE;
      // const url = `https://rrxts0qg-5000.inc1.devtunnels.ms/api/admin/books/${classId}`
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTimetable();
    } catch (error) {
      console.error('Error fetching delete timetable:', error);
    }
  }


  const createTimetable = async () => {
    try {
      const url = ADMIN_CREATE_USER;
      const data = {
        class_id: timeTable.classId,
        subject_id: timeTable.subjectId,
        start_time: timeTable.startTime,
        end_time: timeTable.endTime,
        period_no: timeTable.periodNo,
        teacher_id: timeTable.teacherId
      }
      await axios.post(url, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTimetable();
    } catch (error) {
      console.error('Error creating timetable:', error);
    }
  };
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

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
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Class Id</th>
                    <th scope="col">Subject Id</th>
                    <th scope="col">Start Time</th>
                    <th scope='col'>End Time</th>
                    <th scope='col'>Period</th>
                    <th scope='col'>Teacher Id</th>
                  </tr>
                </thead>
                <tbody>
                  {timetablelist && timetablelist.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>{item.classId}</td>
                      <td>{item.startTime}</td>
                      <td>{item.endTime}</td>
                      <td>{item.period}</td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                        >
                          View
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
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Create Timetable</ModalHeader>
        <ModalBody>
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
    </>
  )
}

export default Schedule