import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';
import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { setLocale } from './shared/reducers/locale';
import { List, ListItemText, Drawer } from '@mui/material';

import { Translate, translate } from 'react-jhipster';

const menuItems = [
  { id: Math.random(), label: 'global.menu.home', href: '/' },
  { id: Math.random(), label: 'global.menu.children', href: '/child' },
  { id: Math.random(), label: 'global.menu.setting', href: '/setting' },
  { id: Math.random(), label: 'global.menu.relChildKafeel', href: '/rel-child-kafeel' },
];

export const App = () => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [toggleMenu, setToggleMenu] = useState<boolean>(true);
  const location = useLocation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const [open, setOpen] = useState<boolean>(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);
  const currentUser = useAppSelector(state => state.authentication.account);

  const getFirstPathSegment = pathname => {
    if (pathname == '/') {
      return '/';
    } else {
      return `/${pathname.split('/')[1]}`;
    }
  };

  useEffect(() => {
    const { pathname } = window?.location;
    const path = getFirstPathSegment(pathname);
    setCurrentPath(path);
  }, [location, location.pathname]);

  const paddingTop = '60px';
  return (
    <div className="app-container" style={!currentPath.includes('login') ? { paddingTop } : { paddingTop: 0 }}>
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />
      <div className="custom_container flex-wrap d-flex">
        {!currentPath.includes('login') && (
          <div className="w-100 header-container d-flex">
            <ErrorBoundary>
              <Header
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                currentLocale={currentLocale}
                onLocaleChange={setLocale}
                ribbonEnv={ribbonEnv}
                isInProduction={isInProduction}
                isOpenAPIEnabled={isOpenAPIEnabled}
              />
            </ErrorBoundary>

            {/* <div className="px-4">
          <IconButton
                      color="inherit"
                      edge="start"
                      onClick={handleDrawerOpen}
                      aria-label="open drawer"
                    >
                      <MenuIcon />
                    </IconButton>
          </div> */}
          </div>
        )}

        {isAuthenticated && (
          <div className="side-menu-container">
            <Drawer variant="permanent" anchor="left" open={open} onClose={handleDrawerClose}>
              <List>
                {menuItems.map(item => (
                  <Link className={`side-link ${currentPath == item.href ? 'active' : ''}`} key={item.id} to={item.href}>
                    <ListItemText primary={translate(item.label)} />
                  </Link>
                  // <ListItem button key={item.id} onClick={() => handleMenuItemClick(item.href)}>
                  //   {/* {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>} */}
                  //   <ListItemText primary={item.label} />
                  // </ListItem>
                ))}
              </List>
            </Drawer>
          </div>
        )}

        <div className={`view-content-container ${!isAuthenticated && 'full-width'} `}>
          <div
            className={`container-fluid relative view-container ${currentPath.includes('login') && 'form-page-view login-view'}`}
            id="app-view-container"
          >
            <Card className="jh-card">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Card>
            {!currentPath.includes('login') && <Footer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
