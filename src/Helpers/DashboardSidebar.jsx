import { IconFolder, IconHeadset, IconLayoutDashboard, IconNews, IconSettings, IconStar, IconTrophy } from '@tabler/icons-react';

export const UpperSidebarItems = [
    {
        "Label": "Dashboard",
        "Icon": <IconLayoutDashboard className="Icon" />,
        "Link": "/dashboard"
    },
    {
        "Label": "Leaderboards",
        "Icon": <IconTrophy className="Icon" />,
        "Link": "leaderboards"
    },
    {
        "Label": "Favorites",
        "Icon": <IconStar className="Icon" />,
        "Link": "favorites"
    },
    {
        "Label": "Projects",
        "Icon": <IconFolder className="Icon" />,
        "Link": "projects"
    },
    {
        "Label": "News",
        "Icon": <IconNews className="Icon" />,
        "Link": "news"
    }
]

export const LowerSidebarItems = [
    {
        "Label": "Support",
        "Icon": <IconHeadset className="Icon" />,
        "Link": "/support"
    },
    {
        "Label": "Settings",
        "Icon": <IconSettings className="Icon" />,
        "Link": "/settings"
    }
]