import React, { useState, Fragment } from 'react';
import {
  WithChildren
} from '.';
import {
  AppAlert,
} from '../../organisms';

export const WithAlert = ({ children, ...props }) => {
  console.debug('WithAlert', { props });

  const [ alertOpen, setAlertOpen ] = useState(false);
  const [ alertText, setAlertText ] = useState();
  const [ alertColor, setAlertColor ] = useState('info');

  const toggleAlert = () => setAlertOpen(prevState => !prevState);
  const dismissAlert = () => setAlertOpen(false);

  const setAlert = (text, color = 'info') => {
    setAlertText(text);
    setAlertColor(color);
    setAlertOpen(true);
  };

  const alertProps = {
    setAlert,
    alertOpen, setAlertOpen,
    alertText, setAlertText,
    alertColor, setAlertColor,
    toggleAlert, dismissAlert
  };

  return (
    <Fragment>
      <AppAlert {...alertProps} />
      <WithChildren {...props} children={children} />
    </Fragment>
  );
};
