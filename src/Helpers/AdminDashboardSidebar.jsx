import { IconFolder, IconLayoutDashboard, IconUsersGroup } from '@tabler/icons-react';

export const SidebarItems = [
    {
        "Label": "Dashboard",
        "Icon": <IconLayoutDashboard className="Icon" />,
        "Link": "/admin-dashboard",
        "HasChildrens": false
    },
    {
        "Label": "Users",
        "Icon": <IconUsersGroup className="Icon" />,
        "Link": "users",
        "HasChildrens": false
    },
    {
        "Label": "Projects",
        "Icon": <IconFolder className="Icon" />,
        "Link": "projects",
        "HasChildrens": false
    },
    // {
    //     "Label": "Users",
    //     "Icon": <IconUsersGroup className="Icon" />,
    //     "Link": "",
    //     "Links": [
    //         {
    //             "Label": "List",
    //             "Link": "users"
    //         }
    //     ]
    // },
    // {
    //     "Label": "Projects",
    //     "Icon": <IconFolder className="Icon" />,
    //     "Link": "",
    //     "Links": [
    //         {
    //             "Label": "List",
    //             "Link": "projects"
    //         },
    //         // {
    //         //     "Label": "Pending",
    //         //     "Link": "#"
    //         // },
    //         // {
    //         //     "Label": "Approved",
    //         //     "Link": "#"
    //         // },
    //         // {
    //         //     "Label": "Rejected",
    //         //     "Link": "#"
    //         // }
    //     ]
    // }
]