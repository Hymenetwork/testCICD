import { Group, Stack, Text, createStyles, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconPhotoCancel, IconPhotoDown, IconVideo } from '@tabler/icons-react';

const useStyles = createStyles(() => ({
    GlobalStyle: {
        minHeight: rem(220),
        pointerEvents: "none"
    }
}))

export const VideoUpload = ({ disabled, onChange }) => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const DropZoneState = ({Icon, Caption, SubCaption, Color}) => {
        return <Stack align="center">
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
    }

    return (
        <Dropzone
            disabled={disabled}
            onDrop={(files) => onChange(files[0])}
            onReject={(files) => console.log('rejected files', files)}
            maxFiles={1}
            multiple={false}
            accept={[MIME_TYPES.mp4]}
            className="CustomStylingForDropZone"
        >
            <Group position="center" className={classes.GlobalStyle}>
                <Dropzone.Idle>
                    <DropZoneState 
                        Icon={<IconVideo size="3.2rem" stroke={1.5} />}
                        Caption="Drag your highlight video here or click to select file"
                        SubCaption="Only *.mp4 will be accepted!"
                    />
                </Dropzone.Idle>

                <Dropzone.Accept>
                    <DropZoneState 
                        Icon={<IconPhotoDown size="3.2rem" stroke={1.5} color={theme.colors[theme.primaryColor][4]} />}
                        SubCaption="That seems good, let's drop it!"
                        Color={theme.colors[theme.primaryColor][4]}
                    />
                </Dropzone.Accept>

                <Dropzone.Reject>
                    <DropZoneState 
                        Icon={<IconPhotoCancel size="3.2rem" stroke={1.5} color={theme.colors.red[6]} />}
                        SubCaption="The file you trying to upload is not accepted!"
                        Color={theme.colors.red[6]}
                    />
                </Dropzone.Reject>
            </Group>
        </Dropzone>
    )
}
