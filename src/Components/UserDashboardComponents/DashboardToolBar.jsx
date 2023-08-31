import { Avatar, Group, Indicator, Stack, Text, Title, UnstyledButton } from "@mantine/core"
import { IconBell } from "@tabler/icons-react"

import { DashboardBreadcrumbs } from "../../Components/"

export const DashboardToolBar = () => {
    const TestAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
    
    return (
        <Group position="apart" align="start" mb="xl">
            <Stack spacing={0}>
                <DashboardBreadcrumbs />
            </Stack>

            <Group align="stretch" spacing="xs">
                <UnstyledButton
                    sx={{
                        background: "var(--CardGradientBackground)",
                        padding: "13px 16px",
                        border: "1px solid var(--BasicBorder)",
                        borderRadius: "12px"
                    }}
                >
                    <Indicator color="red" size={8} withBorder processing>
                        <IconBell className="Icon" />
                    </Indicator>
                    
                </UnstyledButton>

                <UnstyledButton
                    sx={{
                        background: "var(--CardGradientBackground)",
                        padding: "8px 16px",
                        border: "1px solid var(--BasicBorder)",
                        borderRadius: "12px"
                    }}
                >
                    <Group>
                        <Text tt="uppercase">0x4ee8...3da0</Text>
                        <Avatar src={TestAvatar} alt="Test Avatar" radius="xl" />
                    </Group>
                </UnstyledButton>
            </Group>
        </Group>
    )
}
