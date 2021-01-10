import React, { useRef, useEffect } from 'react';
import './video.css';

// ------ Video Component ------
interface VideoPropsInterface {
  children: never[];
  volume?: number;
  stream: MediaStream | null;
  id: string;
  controls?: boolean;
  width: string;
  height: string;
}


function Video(props: VideoPropsInterface) {
  const elementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stream = props.stream;
    let volumeValue = 0;
    if (props.volume) {
      volumeValue = props.volume;
    }

    const current: HTMLVideoElement | null = elementRef.current;
    if (current != null) {
      if (current.srcObject === stream) {
        console.log('useEffect() same stream, so skip:', stream);
      }
      else {
        current.srcObject = stream;
        console.log('useEffect() set stream:', stream);
      }

      current.volume = volumeValue;
    }
    else {
      console.log('useEffect() ref.current NULL');
    }

  });

  console.log('Video rendering, id=%s', props.id);
  const controls = props.controls;
  if (controls) {
    return (
      <video className="video_with_border" ref={elementRef} id={props.id} width={props.width} height={props.height} autoPlay muted playsInline controls ></video>
    );
  }
  else {
    return (
      <video className="video_with_border" ref={elementRef} id={props.id} width={props.width} height={props.height} autoPlay muted playsInline ></video>
    );
  }
}

export default Video;
