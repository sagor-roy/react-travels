import React from 'react';
import { Outlet } from 'react-router-dom';
import "../assets/backend/bower_components/bootstrap/dist/css/bootstrap.min.css";
import "../assets/backend/bower_components/font-awesome/css/font-awesome.min.css";
import "../assets/backend/bower_components/Ionicons/css/ionicons.min.css";
import "../assets/backend/dist/css/AdminLTE.min.css";
import "../assets/backend/dist/css/skins/_all-skins.min.css";
import "../assets/backend/bower_components/morris.js/morris.css";
import "../assets/backend/bower_components/jvectormap/jquery-jvectormap.css";
import "../assets/backend/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "../assets/backend/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css";
import Header from '../backend/partials/Header';
import Sidebar from '../backend/partials/Sidebar';
import Footer from '../backend/partials/Footer';


function Backend() {
  return (
    <div className='skin-blue sidebar-mini wysihtml5-supported fixed'>
      <div className="wrapper">
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Backend;
