import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    const [tree, setTree] = useState([
        {
            title: "Dashboard",
            url: "/admin",
            children: []
        },
        {
            title: "Ticket Management",
            url: "#",
            children: [
                {
                    title: "Booking Information",
                    url: "#",
                    children: [
                        {
                            title: "Add Booking",
                            url: "#"
                        },
                        {
                            title: "Booking List",
                            url: "#"
                        }
                    ]
                },
                {
                    title: "Passenger Information",
                    url: "#",
                    children: [
                        {
                            title: "Add Passenger",
                            url: "#"
                        },
                        {
                            title: "Passenger List",
                            url: "#"
                        }
                    ]
                }
            ],
        },
        {
            title: "Fleet Management",
            url: "#",
            children: [
                {
                    title: "Fleet Type",
                    url: "#",
                    children: [
                        {
                            title: "Add Fleet",
                            url: "#"
                        },
                        {
                            title: "Fleet List",
                            url: "#"
                        }
                    ]
                },
                {
                    title: "Vehicles",
                    url: "#",
                    children: [
                        {
                            title: "Add Vehicles",
                            url: "#"
                        },
                        {
                            title: "Vehicles List",
                            url: "#"
                        }
                    ]
                }
            ],
        },
        {
            title: "Trip Management",
            url: "#",
            children: [
                {
                    title: "Destination",
                    url: "#",
                    children: [
                        {
                            title: "Add Destination",
                            url: "destination/create"
                        },
                        {
                            title: "Destination List",
                            url: "destination/list"
                        }
                    ]
                },
                {
                    title: "Route",
                    url: "#",
                    children: [
                        {
                            title: "Add Route",
                            url: "route/create"
                        },
                        {
                            title: "Route List",
                            url: "route/list"
                        }
                    ]
                },
                {
                    title: "Schedule",
                    url: "#",
                    children: [
                        {
                            title: "Add Schedule",
                            url: "#"
                        },
                        {
                            title: "Schedule List",
                            url: "#"
                        }
                    ]
                },
                {
                    title: "Trip",
                    url: "#",
                    children: [
                        {
                            title: "Add Trip",
                            url: "#"
                        },
                        {
                            title: "Trip List",
                            url: "#"
                        }
                    ]
                }
            ],
        }
    ]);

    const [openStates, setOpenStates] = useState(tree.map(() => false));
    const [childOpenStates, setChildOpenStates] = useState(tree.map(() => []));

    const toggleTree = (index) => {
        setOpenStates((prev) => {
            const newStates = [...prev];
            const beforeActiveIndex = newStates.findIndex((item) => item === true);
            newStates[beforeActiveIndex] = index === beforeActiveIndex ? true : false;
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    const childToggleTree = (parentIndex, childIndex) => {
        setChildOpenStates((prev) => {
            const newStates = [...prev];
            newStates[parentIndex][childIndex] = !newStates[parentIndex][childIndex];
            return newStates;
        });
    };

    const renderTree = (item, parentIndex) => (
        <li className={`treeview ${openStates[parentIndex] ? 'menu-open' : ''}`} key={parentIndex}>
            <Link to={item?.url} onClick={() => toggleTree(parentIndex)}>
                <i className="fa fa-circle-o text-red"></i> <span>{item.title}</span>
                {item?.children?.length > 0 && (
                    <span className="pull-right-container">
                        <i className="fa fa-angle-left pull-right"></i>
                    </span>
                )}
            </Link>
            {item?.children?.length > 0 && (
                <ul className="treeview-menu" style={{ display: openStates[parentIndex] ? 'block' : 'none', paddingLeft: '20px' }}>
                    {item.children.map((childItem, childIndex) => (
                        childRenderTree(childItem, parentIndex, childIndex)
                    ))}
                </ul>
            )}
        </li>
    );

    const childRenderTree = (item, parentIndex, childIndex) => (
        <li className={`treeview ${childOpenStates[parentIndex][childIndex] ? 'menu-open' : ''}`} key={childIndex}>
            <Link to={item?.url} onClick={() => childToggleTree(parentIndex, childIndex)}>
                <i className="fa fa-circle-o"></i> <span>{item.title}</span>
                {item?.children?.length > 0 && (
                    <span className="pull-right-container">
                        <i className="fa fa-angle-left pull-right"></i>
                    </span>
                )}
            </Link>
            {item?.children?.length > 0 && (
                <ul className="treeview-menu" style={{ display: childOpenStates[parentIndex][childIndex] ? 'block' : 'none' }}>
                    {item.children.map((subChildItem, subChildIndex) => (
                        <li className={`treeview `} key={subChildIndex}>
                            <Link to={subChildItem?.url}>
                                <i className="fa fa-circle-o"></i> <span>{subChildItem.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );

    return (
        <aside className="main-sidebar">
            <section className="sidebar">
                <ul className="sidebar-menu" data-widget="tree">
                    <li className="header">MAIN NAVIGATION</li>
                    {tree.map((item, index) => renderTree(item, index))}
                </ul>
            </section>
        </aside>
    );
}

export default Sidebar;
