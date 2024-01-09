import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    const [tree, setTree] = useState([
        {
            title: "Dashboard",
            url: "/admin",
            status: false,
            children: []
        },
        {
            title: "Ticket Management",
            url: "#",
            status: false,
            children: [
                {
                    title: "Booking Information",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Booking",
                            url: "#",
                            status: false,
                        },
                        {
                            title: "Booking List",
                            url: "#",
                            status: false,
                        }
                    ]
                },
                {
                    title: "Passenger Information",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Passenger",
                            url: "#",
                            status: false,
                        },
                        {
                            title: "Passenger List",
                            url: "#",
                            status: false,
                        }
                    ]
                }
            ],
        },
        {
            title: "Fleet Management",
            url: "#",
            status: false,
            children: [
                {
                    title: "Fleet Type",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Fleet",
                            url: "fleet/create",
                            status: false,
                        },
                        {
                            title: "Fleet List",
                            url: "fleet/list",
                            status: false,
                        }
                    ]
                },
                {
                    title: "Vehicles",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Vehicles",
                            url: "#",
                            status: false,
                        },
                        {
                            title: "Vehicles List",
                            url: "#",
                            status: false,
                        }
                    ]
                }
            ],
        },
        {
            title: "Trip Management",
            url: "#",
            status: false,
            children: [
                {
                    title: "Destination",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Destination",
                            url: "destination/create",
                            status: false,
                        },
                        {
                            title: "Destination List",
                            url: "destination/list",
                            status: false,
                        }
                    ]
                },
                {
                    title: "Route",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Route",
                            url: "route/create",
                            status: false,
                        },
                        {
                            title: "Route List",
                            url: "route/list",
                            status: false,
                        }
                    ]
                },
                {
                    title: "Schedule",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Schedule",
                            url: "schedule/create",
                            status: false,
                        },
                        {
                            title: "Schedule List",
                            url: "schedule/list",
                            status: false,
                        }
                    ]
                },
                {
                    title: "Trip",
                    url: "#",
                    status: false,
                    children: [
                        {
                            title: "Add Trip",
                            url: "#",
                            status: false,
                        },
                        {
                            title: "Trip List",
                            url: "#",
                            status: false,
                        }
                    ]
                }
            ],
        }
    ]);

    const cleanPath = (path) => {
        const withoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
        return withoutLeadingSlash.startsWith('admin/') ? withoutLeadingSlash.substring(6) : withoutLeadingSlash;
    };

    const updateStatusRecursively = (items, currentPath) => {
        return items.map((item) => {
            const updatedItem = { ...item };
            const cleanedPath = cleanPath(currentPath);
            const itemUrl = item.url;
            const withoutLeadingSlash = itemUrl.startsWith('/') ? itemUrl.substring(1) : itemUrl;
            if (withoutLeadingSlash === cleanedPath) {
                updatedItem.status = true;
            } else if (item.children && item.children.length > 0) {
                updatedItem.children = updateStatusRecursively(item.children, cleanedPath);
                updatedItem.status = updatedItem.children.some((child) => child.status);
            } else {
                updatedItem.status = false;
            }
            return updatedItem;
        });
    };

    useEffect(() => {
        setTree((prevTree) => updateStatusRecursively(prevTree, location.pathname));
    }, [location.pathname]);

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
        childToggleTree(index, null)
    };

    const childToggleTree = (parentIndex, childIndex) => {
        setChildOpenStates((prev) => {
            const newStates = [...prev];
            newStates[parentIndex] = [];
            newStates[parentIndex][childIndex] = !newStates[parentIndex][childIndex];
            return newStates;
        });
    };

    const renderTree = (item, parentIndex) => (
        <li className={`treeview ${openStates[parentIndex] || item?.status ? 'menu-open active' : ''}`} key={parentIndex}>
            <Link to={item?.url} onClick={() => toggleTree(parentIndex)}>
                <i className="fa fa-circle-o text-red"></i> <span>{item.title}</span>
                {item?.children?.length > 0 && (
                    <span className="pull-right-container">
                        <i className="fa fa-angle-left pull-right"></i>
                    </span>
                )}
            </Link>
            {item?.children?.length > 0 && (
                <ul className="treeview-menu" style={{ display: openStates[parentIndex] || item?.status ? 'block' : 'none', paddingLeft: '20px' }}>
                    {item.children.map((childItem, childIndex) => (
                        childRenderTree(childItem, parentIndex, childIndex)
                    ))}
                </ul>
            )}
        </li>
    );

    const childRenderTree = (item, parentIndex, childIndex) => (
        <li className={`treeview ${childOpenStates[parentIndex][childIndex] || item?.status ? 'menu-open active' : ''}`} key={childIndex}>
            <Link to={item?.url} onClick={() => childToggleTree(parentIndex, childIndex)}>
                <i className="fa fa-circle-o"></i> <span>{item.title}</span>
                {item?.children?.length > 0 && (
                    <span className="pull-right-container">
                        <i className="fa fa-angle-left pull-right"></i>
                    </span>
                )}
            </Link>
            {item?.children?.length > 0 && (
                <ul className="treeview-menu" style={{ display: childOpenStates[parentIndex][childIndex] || item?.status ? 'block' : 'none' }}>
                    {item.children.map((subChildItem, subChildIndex) => (
                        <li className={`treeview ${subChildItem?.status ? 'menu-open active' : ''}`} key={subChildIndex}>
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
