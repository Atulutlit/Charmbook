import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ADMIN_CREATE_HOLIDAY, ADMIN_HOLIDAY } from 'constant/Constant';
import { Card, CardHeader, Table, Container, Row, Col, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import { Button, Modal } from 'react-bootstrap';
import Header from "components/Headers/Header.js";
import { ADMIN_UPDATE_HOLIDAY, ADMIN_DELETE_HOLIDAY } from 'constant/Constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [holidayName, setHolidayName] = useState();
  const [holidayStartDate, setHolidayStartDate] = useState();
  const [holidayEndDate, setHolidayEndDate] = useState();

  // Delete Holiday
  const [deleteBox, setDeleteBox] = useState(false);
  const [holidayId, setHolidayId] = useState();

  // only for pagination
  const [pageSize, setPageSize] = useState(10);
  const [NumberBox, setNumberBox] = useState([]);
  const [indexNumber, setIndexNumber] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [data, setData] = useState([])

  const navigate = useNavigate();

  // minimum function
  const min = (a, b) => {
    if (a < b) return a;
    else return b;
  }

  const fetchHolidays = async () => {
    try {
      const url = ADMIN_HOLIDAY;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status) {
        console.log(response.data.data, 'fetch holidays...')
        let sortedData = sorting(response.data.data);
        setHolidays(sortedData);
        setNumberBox(Array(parseInt(sortedData.length / pageSize + 1)).fill(1))
        let data1 = sortedData.slice(parseInt(indexNumber) * parseInt(pageSize), min(parseInt(sortedData.length), (parseInt(indexNumber) + 1) * parseInt(pageSize)));
        setData(data1);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to fetch holiday', error);
        toast.error('Failed to fetch holiday');
      }
    }
  };

  const handleSaveCreate = async () => {
    try {
      const url = ADMIN_CREATE_HOLIDAY
      console.log(new Date(holidayStartDate), new Date(holidayEndDate), holidayName, 'holiday')
      const validResult = DateValidation(holidayStartDate, holidayEndDate);
      if (!validResult['isValid']) {
        toast(validResult['message']);
        return;
      }
      await axios.post(url,
        {
          holiday_name: holidayName,
          start_date: new Date(holidayStartDate).toISOString(),
          end_date: new Date(holidayEndDate).toISOString()
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setShowCreate(false);
      fetchHolidays();
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to create holiday', error);
        toast.error('Failed to create holiday');
      }
    }
  };

  // sort the data
  const sorting = (data) => {
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const deleteHoliday = async () => {
    try {
      console.log("holiday id", holidayId)
      const url = `${ADMIN_DELETE_HOLIDAY}/${holidayId}`
      await axios.delete(url,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setShowDeleteBox(false);
      toast.success('Deleted Successfully!!');
      fetchHolidays();
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/auth/login');
      } else {
        console.log('Failed to create holiday', error);
        toast.error('Failed to create holiday');
      }
    }
  };
  useEffect(() => {
    fetchHolidays();
  }, [])

  function DateValidation(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      return {
        isValid: false,
        message: 'Start date is invalid'
      };
    }

    if (isNaN(end.getTime())) {
      return {
        isValid: false,
        message: 'End date is invalid'
      };
    }

    if (start > end) {
      return {
        isValid: false,
        message: 'Start date must be less than or equal to end date'
      };
    }

    return {
      isValid: true,
      message: 'Dates are valid'
    };
  }

  const [showCreate, setShowCreate] = useState(false);
  const handleCloseCreate = () => setShowCreate(false);
  const [modalOpen, setModalOpen] = useState([])
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  // all logic of pagination
  useEffect(() => {
    setNumberBox(Array(parseInt(holidays.length / pageSize + 1)).fill(1))
    let data = holidays.slice(parseInt(indexNumber) * parseInt(pageSize), min(parseInt(holidays.length), (parseInt(indexNumber) + 1) * parseInt(pageSize)));
    setData(data);
  }, [JSON.stringify(holidays), indexNumber])

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
                    <h3 className="mb-0">Holiday</h3>
                  </div>

                  <div className="col text-right">
                    <Button color="primary" size="sm" onClick={() => { setShowCreate(true); }}>ADD</Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope='col'>Holiday_Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated At</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(indexNumber) * pageSize + index}</td>
                      <td>{item?.holiday_name}</td>
                      <td>{item?.date?.slice(0, 10)}</td>
                      <td>{item?.created_at}</td>
                      <td>{item?.updated_at}</td>

                      <td>
                        <Button color="primary" size="sm" onClick={() => { setHolidayId(item.id); console.log("delete holiday"); setShowDeleteBox(true); }}>
                          Delete </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ------------------- Delete Box ------------------------- */}
      <Modal show={showDeleteBox} onHide={() => { setShowDeleteBox(false); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are You Sure Want To Delete Holiday?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDeleteBox(false); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { deleteHoliday(); }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/*   ----------------- Create Holiday ------------- */}
      <Modal show={showCreate} onHide={handleCloseCreate} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-4'>
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
              onChange={e => setHolidayStartDate(e.target.value)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="holiday_end_date">End Date:</label>
            <input
              type="date"
              value={holidayEndDate}
              onChange={e => setHolidayEndDate(e.target.value)}
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

      {/* Delete Box */}
      <Modal isOpen={deleteBox} toggle={() => { setDeleteBox(false); }} centered className="custom-delete-modal w-auto">
        <ModalHeader toggle={() => { setDeleteBox(false); }} className='custom-header'>Delete Holiday</ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <p className=' '>Are you sure you want to delete this holiday?</p>
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-end custom-footer">
          <Button color="btn btn-secondary" size='sm' onClick={() => { setDeleteBox(false); }}>
            Cancel
          </Button>
          <Button color="btn btn-danger" size='sm' onClick={deleteHoliday}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Holiday