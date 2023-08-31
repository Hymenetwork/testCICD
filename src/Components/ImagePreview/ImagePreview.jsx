import { Image } from "@mantine/core"

export const ImagePreview = ({File, HasData, Size}) => {
    const ImageURL = (file) => {
        return URL.createObjectURL(file)
    }

    return (
        <>
            {HasData 
                ? 
                    <Image src={File} maw={Size ? Size : 240} mx="auto" />
                :
                    File.map((f, i) => 
                        <Image
                            key={i}
                            src={ImageURL(f)}
                            imageProps={{ 
                                onLoad: () => URL.revokeObjectURL(ImageURL(f)) 
                            }}
                            maw={Size ? Size : 240} mx="auto"
                        />
                    )
            }
        </>
    )
}
