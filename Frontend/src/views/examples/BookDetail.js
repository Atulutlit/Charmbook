import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import Header from 'components/Headers/Header';

const BookDetail = ({ book }) => {
  // Sample book data (replace with actual data fetching logic)
  const bookData = book || {
    id: 1,
    title: 'Sample Book',
    author: 'John Doe',
    genre: 'Fiction',
    // Omit other book details for brevity
    image: 'https://via.placeholder.com/150', // Placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum urna eget magna tincidunt condimentum.',
    publishedYear: '2020',
    pageCount: '300',
    language: 'English',
    publisher: 'Publisher X',
  };

  return (
    <>
      <Header />
      <div className="container">
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="shadow">
              <CardHeader className='d-flex justify-content-between align-items-center'>
                <h3>{bookData.title}</h3>
                <img
                  src={bookData.image}
                  alt="Book Cover"
                  className="img-thumbnail"
                />
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <dl className="row">
                      <dt className="col-sm-4">Author:</dt>
                      <dd className="col-sm-8">{bookData.author}</dd>

                      <dt className="col-sm-4">Genre:</dt>
                      <dd className="col-sm-8">{bookData.genre}</dd>

                      <dt className="col-sm-4">Published Year:</dt>
                      <dd className="col-sm-8">{bookData.publishedYear}</dd>

                      <dt className="col-sm-4">Page Count:</dt>
                      <dd className="col-sm-8">{bookData.pageCount}</dd>

                      <dt className="col-sm-4">Language:</dt>
                      <dd className="col-sm-8">{bookData.language}</dd>

                      <dt className="col-sm-4">Publisher:</dt>
                      <dd className="col-sm-8">{bookData.publisher}</dd>
                    </dl>
                  </Col>
                  <Col md="6">
                    <p>{bookData.description}</p>
                  </Col>
                </Row>
                {/* Add sections for reviews, ratings, etc., if needed */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BookDetail;
