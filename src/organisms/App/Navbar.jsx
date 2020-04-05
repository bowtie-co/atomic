import React, { useState } from 'react';
// import { navigate } from 'hookrouter';
import { auth } from '../../lib';
import {
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand
} from 'reactstrap';

import {
  ServiceSelector
} from '../Service';

export const AppNavbar = ({ children, navItems = [], ...props }) => {
  // const { isAuthorized } = props;
  const [ isNavOpen, setIsNavOpen ] = useState(false);
  const toggleNav = () => setIsNavOpen(prevState => !prevState);

  console.debug('AppNavbar', { props });

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href='/'>
        <span className="logo">
          <img alt="Bowtie CI Logo"src="/logo.png" />
        </span>
        &nbsp;
        Bowtie CI
      </NavbarBrand>
      <NavbarToggler onClick={toggleNav} />
      <Collapse isOpen={isNavOpen} navbar>
        <Nav className="mr-auto" navbar>
          {navItems.map((nav, index) => (
            <NavItem key={index} active={window.location.pathname.indexOf(nav.href) > -1}>
              <NavLink href={nav.href}>
                {nav.text}
              </NavLink>
            </NavItem>
          ))}
          {auth.authorized && (
            <NavItem>
              <NavLink onClick={() => auth.logout()} href='/'>
                Logout
              </NavLink>
            </NavItem>
          )}
        </Nav>
        <Nav className="ml-auto" navbar>
          <ServiceSelector {...props} />
        </Nav>
      </Collapse>
    </Navbar>
  );
};
