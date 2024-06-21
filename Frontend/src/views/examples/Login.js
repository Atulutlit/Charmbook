import React, { useState,useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { ADMIN_LOGIN_URL, } from "constant/Constant";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false); // State to track login success
  const navigate = useNavigate();
  const [rememberMe,setRememberMe]=useState(false);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const url = ADMIN_LOGIN_URL;
  //     if(password!="12345"){
  //       setError("Please Enter Correct Password!!");
  //       return ;
  //     }
  //     const response = await axios.post(
  //       url,{ email, password }
  //     );
  //     if (response.data.status) {
  //       // Save the token in local storage
  //       localStorage.setItem("token", response.data.admin.token);
  //       // Set login success state to true
  //       setLoginSuccess(true);
  //       if(rememberMe)
  //       {
  //         localStorage.setItem('email',email);
  //         localStorage.setItem('password',password);
  //       }else{
  //         localStorage.removeItem('email');
  //         localStorage.removeItem('password');
  //       }
  //       navigate("/admin/index");
  //     } else {
  //       setError("Login failed. Please check your credentials.");
  //       setTimeout(()=>{ setError(""); },2000);
  //     }
  //   } catch (error) {
  //     setError("An error occurred. Please try again.");
  //     setTimeout(()=>{ setError("");},2000);
  //   }
  // };
  
  useEffect(()=>{
  const email=localStorage.getItem('email');
  const password = localStorage.getItem('password');
  email && setEmail(email);
  password && setPassword(password);
  },[])

  const checkTokenValidity = async () => {
    try {
        const token = await localStorage.getItem('token'); // Replace with your actual token key
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

            if (decodedToken.exp < currentTime) {
                // Token has expired
                navigate('/auth/login'); // Assuming you want to redirect to the login page
            } else {
                // Token is valid, navigate to dashboard
                navigate('/admin/index');
            }
        }
    } catch (error) {
        // Handle any errors that might occur during token retrieval
        console.error("Error while checking token validity:", error);
    }
};
useEffect(() => {
    checkTokenValidity();
}, [navigate]);

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <div className="text-xl">Sign in</div>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {/* <Form role="form" onSubmit={handleLogin}> */}
            <Form role="form" >
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={()=>{setRememberMe(!rememberMe);}}
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              {error && (
                <div className="text-center text-danger mb-3">
                  <small>{error}</small>
                </div>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-3">
          <Col xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>Create new account</small>
            </a>
          </Col>
        </Row> */}
        {/* {loginSuccess && (
          <div className="text-center mt-3">
            <Link to="/admin/index">
              <Button color="primary">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )} */}
      </Col>
    </>
  );
};

export default Login;
