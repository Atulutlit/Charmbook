
import { useEffect } from "react";
import Students from "./examples/Students";
import { useNavigate } from "react-router-dom";
// reactstrap components
import {
  Container,
} from "reactstrap";


const Index = (props) => {
  const navigate = useNavigate();

  // This is simple authentication,we have to add jwt after somettime.
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token)
      navigate("/auth/login")
    },[])
  
  return (
    <>
      <Container className="mt--7" fluid>
        <Students/>
      </Container>
    </>
  );
};

export default Index;
