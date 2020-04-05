import React, { Fragment, useState, useEffect } from 'react';
import {
  WithChildren
} from '.';
import {
  AppNavbar
} from '../../organisms';

export const WithNavbar = ({ children, ...props }) => {
  const { serviceName } = props;

  const [ navItems, setNavItems ] = useState([]);

  console.debug('WithNavbar', { props });

  useEffect(() => {
    if (serviceName) {
      setNavItems([
        {
          text: serviceName,
          href: `/services/${serviceName}`
        },
        {
          text: 'Builds',
          href: `/services/${serviceName}/builds`
        },
        {
          text: 'Deploys',
          href: `/services/${serviceName}/deploys`
        }
      ]);
    } else {
      setNavItems([]);
    }
  }, [ serviceName ]);

  return (
    <Fragment>
      <AppNavbar {...props} navItems={navItems} />
      <WithChildren {...props} children={children} navItems={navItems} />
    </Fragment>
  );
};
