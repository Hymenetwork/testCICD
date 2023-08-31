import { Button, Group, Modal, Stack, Text } from "@mantine/core"
import { IconAlertTriangle } from "@tabler/icons-react"

export const ConfirmationModal = ({isOpen, closeModal, modalSize, modalTitle, modalDescription, callBackAction, label}) => {
    return (
        <Modal
            opened={isOpen}
            onClose={closeModal}
            withCloseButton={false}
            centered
            size={modalSize || "sm"}
            trapFocus={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            className="CMSModal"
        >
            <Stack align="center" justify="center" spacing={0}>
                <Stack align="center" spacing="xs">
                    <IconAlertTriangle size={32} color="orange" />
                    <Text fw="bolder" inline>{modalTitle}</Text>
                    <Text fz="sm" inline>{modalDescription}</Text>

                    <Group spacing="xs">
                        <Button className="PrimaryButton" onClick={callBackAction}>
                            {label || "Yes"}
                        </Button>
                        <Button color="dark" variant="white" onClick={closeModal}>Cancel</Button>
                    </Group>
                </Stack>
            </Stack>
        </Modal>
    )
}
