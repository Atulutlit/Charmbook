import React from 'react';
import { Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import AttendanceImage from 'assets/img/attendance.png';
import BookImage from 'assets/img/book.png';
import TeacherImage from 'assets/img/teacher.png';
import SubjectsImage from 'assets/img/subjects.png';
import StudentsImage from 'assets/img/students.png';
import TimetableImage from 'assets/img/timetable.png';
import TestImage from 'assets/img/test.png';
import HolidaysImage from 'assets/img/holidays.png';
import HomeworkImage from 'assets/img/homework.png';
import ClassImage from 'assets/img/class.png';
import './dashboarditems.css';

const images = [
  { src: AttendanceImage, alt: 'Attendance', title: 'Attendance', path: '/attendance', hoverColor: '#FFE9D0' },
  { src: BookImage, alt: 'Book', title: 'Book', path: '/books', hoverColor: '#FFFED3' },
  { src: TeacherImage, alt: 'Teacher', title: 'Teacher', path: '/teachers', hoverColor: '#BBE9FF' },
  { src: SubjectsImage, alt: 'Subjects', title: 'Subjects', path: '/subjects', hoverColor: '#B1AFFF' },
  { src: StudentsImage, alt: 'Students', title: 'Students', path: '/students', hoverColor: '#B7C9F2' },
  { src: TimetableImage, alt: 'Timetable', title: 'Timetable', path: '/timetable', hoverColor: '#94FFD8' },
  { src: TestImage, alt: 'Test', title: 'Test', path: '/test', hoverColor: '#FFA27F' },
  { src: HolidaysImage, alt: 'Holidays', title: 'Holidays', path: '/holiday', hoverColor: '#95D2B3' },
  { src: HomeworkImage, alt: 'Homework', title: 'Homework', path: '/homework', hoverColor: '#CAF4FF' },
  { src: ClassImage, alt: 'Class', title: 'Class', path: '/class', hoverColor: '#FFFFE8' },
];

const DashboardItems = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/admin${path}`);
  };

  return (
    <div className="position-relative">
      <Container className="my-5 position-absolute my-dashboard" fluid>
        <div className="row">
          {images.map((image, index) => (
            <div
              key={index}
              className="col-lg-2 col-md-4 col-sm-6 boex"
              onClick={() => handleNavigation(image.path)}
              style={{ '--hover-color': image.hoverColor }}
            >
              <div className="image-box">
                <img src={image.src} className="image-icon" alt={image.alt} />
                <h5 className="image-title">{image.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DashboardItems;
