
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Container,
  Nav,
  Media,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DashboardItems from "./DashboardItems";
// import Students from "./examples/Students";

const Index = (props) => {
  const navigate = useNavigate();

  // This is simple authentication,we have to add jwt after somettime.
  // useEffect(()=>{
  //   const token = localStorage.getItem('token');
  //   if(!token)
  //     navigate("/auth/login")
  //   },[])
  
  return (
    <>
      <Navbar className="navbar-top navbar-dark bg-primary" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../assets/img/theme/admin-avatar.webp")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                    Admin
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="/login" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span onClick={()=>{localStorage.clear();navigate("/auth/login")}}>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
      <DashboardItems/>
    </>
  );
};

export default Index;
