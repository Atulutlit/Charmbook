import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { ADMIN_CREATE_HOLIDAY,ADMIN_HOLIDAY } from 'constant/Constant';
import { Card, CardHeader, Table, Container, Row, Col, } from 'reactstrap';
import { Button, Modal } from 'react-bootstrap';
import Header from "components/Headers/Header.js";
import { ADMIN_UPDATE_HOLIDAY , ADMIN_DELETE_HOLIDAY } from 'constant/Constant';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Holiday = () => {
    const [holidays,setHolidays]=useState([]);
    const [holidayName,setHolidayName]=useState();
    const [holidayStartDate,setHolidayStartDate]=useState();
    const [holidayEndDate,setHolidayEndDate]=useState();
    const [holidayId,setHolidayId]=useState();
    
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
    
    const handleSaveCreate = async () => {
        try {
          const url = ADMIN_CREATE_HOLIDAY
          console.log(new Date(holidayStartDate),new Date(holidayEndDate),holidayName,'holiday')
          
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
          console.error('Error creating holiday:', error);
        }
    };
    const deleteHoliday = async () => {
        try {
          const url = `${ADMIN_DELETE_HOLIDAY}/${holidayId}`
          await axios.delete(url, 
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setShowDeleteBox(false);
          toast.success('Deleted Successfully!!');
          fetchHolidays();
        } catch (error) {
          console.error('Error creating holiday:', error);
        }
    };
    useEffect(()=>{
    fetchHolidays();
    },[])
    
    const [showCreate,setShowCreate]=useState(false);
    const handleCloseCreate = () => setShowCreate(false);
    const [modalOpen,setModalOpen]=useState([])
    const [showDeleteBox,setShowDeleteBox]=useState(false);

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
                  <h3 className="mb-0">Holiday</h3>
                </div>

                <div className="col text-right">
                <Button color="primary" size="sm" onClick={()=>{setShowCreate(true);}}>ADD</Button>
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
                </tr>
              </thead>
              <tbody>
                {holidays && holidays.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item?.holiday_name}</td>
                    <td>{item?.date}</td>
                    <td>{item?.created_at}</td>
                    <td>{item?.updated_at}</td>
                    
                    <td>
                    <Button color="primary" size="sm" onClick={()=>{setHolidayId(item.id);console.log("delete holiday");setShowDeleteBox(true);}}>
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
    <Modal show={showDeleteBox} onHide={()=>{setShowDeleteBox(false);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are You Sure Want To Delete Holiday?</Modal.Title>
        </Modal.Header>
       
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShowDeleteBox(false);}}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{deleteHoliday();}}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/*   ----------------- Create Holiday ------------- */}
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
    </>
  )
}

export default Holiday