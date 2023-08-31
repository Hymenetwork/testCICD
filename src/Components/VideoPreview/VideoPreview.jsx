export const VideoPreview = ({File, HasData}) => {
    const VideoURL = (file) => {
        return URL.createObjectURL(file)
    }

    return (
        <>
            {HasData
                ?
                    <video src={File} height={250} width={250} controls />
                :
                    File.map((f, i) => 
                        <video src={VideoURL(f)} height={250} width={250} controls key={i} />
                    )
            }
        </>
    )
}
