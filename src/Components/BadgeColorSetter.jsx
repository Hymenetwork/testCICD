export const BadgeColorSetter = (Status) => {
    let color = ""

    switch (Status) {
        case 0: color = "dark"
            break;
        case 1: color = "orange"
            break;
        case 2: color = "green"
            break;
        case 3: color = "red"
            break;
        case 4: color = "red"
            break;
        case 5: color = "green"
            break;
        default:
                color = "red"
            break;
    }
    
    return color
}
