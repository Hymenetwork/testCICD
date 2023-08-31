export const BadgeLabelSetter = ({Status}) => {
    let label = ""

    switch (Status) {
        case 0: label = "Empty"
            break;
        case 1: label = "In Review"
            break;
        case 2: label = "Approved"
            break;
        case 3: label = "Rejected"
            break;
        case 4: label = "Deleted"
            break;
        case 5: label = "Live"
            break;
        default:
                label = "No status available"
            break;
    }

    return label
}
