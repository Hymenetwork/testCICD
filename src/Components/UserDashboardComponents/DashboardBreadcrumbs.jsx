import { Link, useLocation } from "react-router-dom"
import { Breadcrumbs, Text, Title } from "@mantine/core"

export const DashboardBreadcrumbs = () => {
    const Location = useLocation()
    let CurrentLink = ""

    const Crumbs = Location.pathname.split("/")
    .filter(crumb => crumb !== "")
    .map((crumb, index) => {
        CurrentLink += `/${crumb}`

        return (
            <Text c="dimmed" fz="sm" tt="capitalize" key={index} component={Link} to={CurrentLink}>{crumb}</Text>
        )
    })

    const CrumbsHeader = Location.pathname.split("/").filter(crumb => crumb !== "").pop()
    
    return (
        <>
            <Title order={2} tt="capitalize">{CrumbsHeader}</Title>
            {CrumbsHeader !== "dashboard" && <Breadcrumbs>{Crumbs}</Breadcrumbs> }
        </>
    )
}
