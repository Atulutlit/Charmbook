
import Students from "./examples/Students";
// reactstrap components
import {
  Container,
} from "reactstrap";


const Index = (props) => {


  
  return (
    <>
      <Container className="mt--7" fluid>
        <Students/>
      </Container>
    </>
  );
};

export default Index;
