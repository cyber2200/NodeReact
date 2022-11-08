import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Form,
  Button,
  Alert,
  InputGroup,
  Spinner,
  CardColumns,
  Card,
} from "react-bootstrap";
import { searchArtworks } from "../../api";
import env from "react-dotenv";

function Homepage({ onLogout }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNumberOfRowsError, setIsNumberOfRowsError] = useState(false);
  const [noArtworksFound, setNoArtworksFound] = useState(false);

  let defaultKeywordValue = '';
  if (env.DEFAULT_KEYWORD !== '') {
    defaultKeywordValue = env.DEFAULT_KEYWORD;
  }
  const [keyword, setKeyword] = useState(defaultKeywordValue);
  const [numberOfRows, setNumberOfRows] = useState("");
  const [artworks, setArtworks] = useState([]);

  const onChangeKeyword = (event) => {
    setKeyword(event.target.value);
  };

  const onChangeNumberOfRows = (event) => {
    setNumberOfRows(event.target.value);
  };

  useEffect(() => {
    if (env.DEFAULT_KEYWORD !== '') {
      const getData = async () => {
        await searchAction();
      }
      getData();
    }
    console.log('useEffect');
  }, []);

  const searchAction = async () => {
    setIsNumberOfRowsError(false);
    setIsLoading(true);
    const artworks = await searchArtworks({ keyword, numberOfRows });
    setArtworks(artworks);
    setNoArtworksFound(!artworks || !artworks.length);
    setIsLoading(false);
  }

  const onSearchArtworks = async (event) => {
    event.preventDefault();

    // Number of rows validation
    if (numberOfRows !== ''){
      if (! /^\d+$/.test(numberOfRows)) { // If it's not a number
        setIsNumberOfRowsError(true);
        return;
      }
      if (parseInt(numberOfRows) < 5 || parseInt(numberOfRows) > 50) { // If it's not in range
        setIsNumberOfRowsError(true);
        return;
      }
    }
    await searchAction();
  };
  return (
    <Container fluid>
      <Row className="mt-2 mb-2 justify-content-end" noGutters>
        <Button variant="outline-danger" onClick={onLogout}>
          Log out
        </Button>
      </Row>
      <Row noGutters>
        <h1>Welcome!</h1>
      </Row>
      <Row className="mt-2" noGutters>
        <h6>
          Enter one or multiple keywords below to search for artworks in the Art
          Institute of Chicago.
        </h6>
      </Row>
      <Row noGutters>
        <Form className="w-100 mb-5" onSubmit={onSearchArtworks}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="e.g. Monet, O'Keeffe, Ancient Greek..."
              onChange={onChangeKeyword}
              value={keyword}
            />
            { env.LIMIT_FEATURE_FLAG === "1" &&
              <Form.Control
                type="text"
                placeholder="Number of rows, between 5-50"
                onChange={onChangeNumberOfRows}
                value={numberOfRows}
              />
            }
            <InputGroup.Prepend>
              <Button
                variant="outline-primary"
                disabled={!keyword}
                type="submit"
              >
                Search artworks
              </Button>
            </InputGroup.Prepend>
          </InputGroup>
        </Form>
      </Row>
      {isNumberOfRowsError && (
        <Alert variant={"info"}>
          Number of rows should be from 5 to 50
        </Alert>
      )} 
      {isLoading && (
        <Row className="justify-content-center mb-5">
          <Spinner animation="border" variant="primary" />
        </Row>
      )}
      {noArtworksFound && !isLoading ? (
        <Alert variant={"info"}>
          No results were found for the entered keyword/s.
        </Alert>
      ) : (
        <CardColumns>
          {artworks.map((artwork, idx) => {
            const {
              id,
              title,
              image_url,
              artist_display,
              date_display,
              medium_display,
              place_of_origin,
            } = artwork;
            return (
              <Card key={`artwork-${id}`}>
                <a
                  href={image_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-current="true"
                >
                  <Card.Img variant="top" src={image_url} />
                </a>
                <Card.Body>
                  <Card.Title>{title}</Card.Title>
                  <Card.Text
                    className="text-muted"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {place_of_origin}, {date_display}
                    <br />
                    <small className="text-muted">{artist_display}</small>
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">{medium_display}</small>
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      )}
    </Container>
  );
}

export default Homepage;
