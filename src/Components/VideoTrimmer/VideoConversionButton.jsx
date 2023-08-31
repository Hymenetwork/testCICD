import { Button } from "@mantine/core"
import { fetchFile } from "@ffmpeg/ffmpeg"
import { SliderValueToVideoTime } from "../../Utils"

export const VideoConversionButton = ({ videoPlayerState, sliderValues, videoFile, ffmpeg, ProcessVideoTrim, TrimmedVideoCreated, ResultFile, getBase64Trailer }) => {
    const TrimVideo = async () => {
        ProcessVideoTrim(true)

        const inputFileName = "OriginalVideo.mp4"
        const outputFileName = "TrimmedVideo.mp4"

        // Write the file to memory 
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

        const [min, max] = sliderValues
        const minTime = SliderValueToVideoTime(videoPlayerState.duration, min)
        const maxTime = SliderValueToVideoTime(videoPlayerState.duration, max)

        // Run the FFMpeg command
        await ffmpeg.run(
            "-i",
            inputFileName,
            "-ss",
            `${minTime}`,
            "-to",
            `${maxTime}`,
            "-t",
            "20",
            "-c",
            "copy",
            outputFileName        
        )
        
        // Read the result
        const data = ffmpeg.FS('readFile', outputFileName);
        const TrimmedVideo = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        TrimmedVideoCreated(TrimmedVideo)

        const ResFile = new File([data.buffer], "trailer-video", { type: 'video/mp4' })

        ResultFile(ResFile)
        getBase64Trailer(ResFile)

        ProcessVideoTrim(false)
    }

    return (
        <Button onClick={() => TrimVideo()}>Trim Video</Button>
    )
}
