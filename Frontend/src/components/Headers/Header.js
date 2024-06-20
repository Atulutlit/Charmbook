import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { format } from 'date-fns';
import { ADMIN_CREATE_SCHEDULE,ADMIN_GET_SCHEDULE} from "constant/Constant";
import { ADMIN_TEACHER,ADMIN_HOLIDAY,ADMIN_STUDENTS} from "constant/Constant";

const Header = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [schedule, setSchedule] = useState({ start_time: '', end_time: '' });
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  
  const [holidays, setHolidays] = useState([]);
  const [holidayName, setHolidayName] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState(null);
  const [holidayEndDate, setHolidayEndDate] = useState(null);

  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const handleSaveCreate = async () => {
    try {
      const url = ADMIN_HOLIDAY
      await axios.post(url, 
      {
        holiday_name: holidayName,
        start_date: new Date(holidayStartDate).toISOString(),
        end_date: new Date(holidayEndDate).toISOString()
      }, 
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchHolidays();
      handleCloseCreate();
    } catch (error) {
      console.error('Error creating holiday:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const url = ADMIN_CREATE_SCHEDULE;
      await axios.post(url, 
      {
        start_time: editStartTime,
        end_time: editEndTime
      }, 
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSchedule();
      handleCloseEdit();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const fetchTotalStudents = async () => {
    try {
      const url = ADMIN_STUDENTS;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setTotalStudents(response.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTotalTeachers = async () => {
    try {
      const url = ADMIN_TEACHER;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        setTotalTeachers(response.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSchedule = async () => {
    try {
      const url = ADMIN_GET_SCHEDULE;
      const token = localStorage.getItem('token');
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response,'response  url ........')
      if (response.data.status) {
        const data = response.data.data;
        setSchedule(data);
        setEditStartTime(data.start_time);
        setEditEndTime(data.end_time);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const url = ADMIN_HOLIDAY;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        console.log(response.data.data,'fetch holidays...')
        setHolidays(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  useEffect(() => {
    fetchTotalStudents();
    fetchTotalTeachers();
    fetchSchedule();
    fetchHolidays();
  }, []);

  const formatTime = (time) => {
    const [hour, minute, second] = time.split(':');
    const date = new Date();
    date.setHours(hour, minute, second);
    return format(date, 'hh:mm aa');
  };

  const formatHolidayDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
  };

  const holidayRange = holidays.length > 0 ? 
    `${formatHolidayDate(holidays[0].date)} - ${formatHolidayDate(holidays[holidays.length - 1].date)}` 
    : 'No holidays';

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 py-3 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Students
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalStudents}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-user" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 py-3 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Teachers
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalTeachers}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 py-3 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Schedule
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {schedule.start_time ? formatTime(schedule.start_time) : ''} - {schedule.end_time ? formatTime(schedule.end_time) : ''}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <Button variant="primary" size="sm" onClick={handleShowEdit}>
                          Edit <i className="fas fa-edit"></i>
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* <Col lg="6" xl="3">
                <Card className="card-stats mb-4 py-3 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total No. of Holiday
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {holidays.length}
                        </span>
                      </div>
                      <Col className="col-auto flex-column">
                        <Button variant="primary" size="sm" onClick={handleShowCreate}>
                          Edit <i className="fas fa-edit"></i>
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col> */}
            </Row>
          </div>
        </Container>
      </div>
      <Modal show={showCreate} onHide={handleCloseCreate} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="holiday_name">Holiday Name:</label>
            <input
              type="text"
              id="holiday_name"
              className="form-control"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="holiday_start_date">Start Date:</label>
            <input
              type="date"
              value={holidayStartDate}
              onChange={date => setHolidayStartDate(date.target.value)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="holiday_end_date">End Date:</label>
            <input
              type="date"
              value={holidayEndDate}
              onChange={date => setHolidayEndDate(date.target.value)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreate}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveCreate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="edit_start_time">Start Time:</label>
            <input
              type="time"
              id="edit_start_time"
              className="form-control"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit_end_time">End Time:</label>
            <input
              type="time"
              id="edit_end_time"
              className="form-control"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
