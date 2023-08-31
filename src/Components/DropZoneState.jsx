import { Stack, Text } from "@mantine/core"

export const DropZoneState = ({Icon, Caption, SubCaption, Color}) => {
    return (
        <Stack align="center">
            {Icon}

            {Caption && 
                <Text ta="center" inline>
                    {Caption}
                </Text>
            }

            {SubCaption && 
                <Text fz="xs" ta="center" inline c={Color ? Color : "dimmed"}>
                    {SubCaption}
                </Text>
            }
        </Stack>
    )
}
