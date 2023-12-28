import React from 'react'
import Avatar from "../../assets/backend/dist/img/user2-160x160.jpg"

function Header() {
    return (
        <header className="main-header">
            <a href="index2.html" className="logo">
                <span className="logo-mini"><b>A</b>LT</span>
                <span className="logo-lg"><b>Admin</b>LTE</span>
            </a>
            <nav className="navbar navbar-static-top">
                <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                    <span className="sr-only">Toggle navigation</span>
                </a>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="dropdown user user-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <img src={Avatar} className="user-image" alt="User Image" />
                                <span className="hidden-xs">Alexander Pierce</span>
                            </a>
                            <ul className="dropdown-menu">
                                {/* ... Dropdown content ... */}
                            </ul>
                        </li>
                        <li>
                            <a href="#" data-toggle="control-sidebar"><i className="fa fa-gears"></i></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header