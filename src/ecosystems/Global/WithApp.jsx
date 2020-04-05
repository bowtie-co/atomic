import React from 'react';
import { WithNavbar, WithAlert, WithChildren } from '.';

export const WithApp = ({ children, ...props }) => {
  console.debug('WithApp', { children, props });

  return (
    <WithNavbar {...props}>
      <WithAlert>
        <WithChildren {...props} children={children} />
      </WithAlert>
    </WithNavbar>
  );
};
