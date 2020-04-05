import React, { Fragment } from 'react';
// import { navigate } from 'hookrouter';

import {
  Alert, Container, Row, Col
} from 'reactstrap';

export const AppAlert = ({ children, ...props }) => {
  console.debug('AppAlert', { props });

  // const [ alertOpen, setAlertOpen ] = useState(false);
  // const [ alertText, setAlertText ] = useState();
  // const [ alertColor, setAlertColor ] = useState('info');

  // const toggleAlert = () => setAlertOpen(prevState => !prevState);
  // const dismissAlert = () => setAlertOpen(false);

  const {
    alertOpen, // setAlertOpen,
    alertText, // setAlertText,
    alertColor, // setAlertColor,
    dismissAlert, // toggleAlert,
  } = props;

  if (alertOpen && alertText && alertText.trim() !== '') {
    return (
      <Container>
        <Row>
          <Col>
            <Alert
              color={alertColor}
              isOpen={alertOpen}
              toggle={dismissAlert}
            >
              {alertText}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return <Fragment />;
  }
};
