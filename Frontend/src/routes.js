
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Books from "views/examples/Books.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Students from "views/examples/Students.js";
import Teachers from "views/examples/Teachers";
import Subjects from "views/examples/Subjects";
import StudentProfile from "views/examples/StudentProfile";
import Class from "views/examples/Class"
import Homework from "views/examples/Homework";
import Test from "views/examples/Test";
import Timetable from "views/examples/Timetable";
import Attendance from "views/examples/Attendance";
import Holiday from "views/examples/Holiday";


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/class",
    name: "Classes",
    icon: "ri-school-line text-yellow",
    component: <Class />,
    layout: "/admin",
  },
  {
    path: "/students",
    name: "Students",
    icon: "fas fa-user text-blue",
    component: <Students />,
    layout: "/admin", 
  },
  {
    path: "/teachers",
    name: "Teachers",
    icon: "fa fa-users text-blue",
    component: <Teachers />,
    layout: "/admin", 
  },
  ,
  {
    path: "/subjects",
    name: "Subjects",
    icon: "fa-solid fa-book-open text-blue",
    component: <Subjects />,
    layout: "/admin", 
  },
  {
    path: "/books",
    name: "Books",
    icon: "fa fa-book text-orange",
    component: <Books />,
    layout: "/admin",
  },
  
  {
    path: "/homework",
    name: "Homework",
    icon: " ni ni-laptop text-red",
    component: <Homework />,
    layout: "/admin",
  },
  {
    path: "/test",
    name: "Test",
    icon: " ni ni-single-copy-04 text-black",
    component: <Test />,
    layout: "/admin",
  },
 
  {
    path: "/timetable",
    name: "Timetable",
    icon: "ni ni-key-25 text-info",
    component: <Timetable />,
    layout: "/admin",
  },
  {
    path: "/holiday",
    name: "Holiday",
    icon: "ni ni-air-baloon text-info",
    component: <Holiday />,
    layout: "/admin",
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: "ni ni-calendar-grid-58 text-info",
    component: <Attendance />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-circle-08 text-info",
    component: <Login />,
    layout: "/auth",
  },
  
 
  
];
export default routes;
