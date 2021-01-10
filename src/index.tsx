import React from 'react';
import ReactDOM from 'react-dom';
import Video from './video'; // video.tsx
import { connection as AyameConnection, defaultOptions } from '@open-ayame/ayame-web-sdk';
import { v4 as uuidv4 } from 'uuid';
import { MouseEvent } from 'react';

import './index.css';

// ---- TODO -----
//  - DONE:roomID (DONE:input, DONE:url)
//  - DONE: signalingKey (DONE:input, DONE:url)
//  - DONE: codec (DONE:video, NO:audio)
//  - DONE: button enable/disable control
//  - DONE: github actions for deploy github pages
//  - DONE: inline
//  - DONE: volume
//  - DONE: controls

// ------ params -----
const signalingUrl = 'wss://ayame-labo.shiguredo.jp/signaling';
let signalingKey = '';
const keyFromUrl = getKeyFromUrl();
if (keyFromUrl && (keyFromUrl !== '')) {
  signalingKey = keyFromUrl;
}
let roomId = 'mm-react-ayame-test';
const roomFromUrl = getRoomFromUrl();
if (roomFromUrl && (roomFromUrl !== '')) {
  roomId = roomFromUrl;
}

let clientId = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
//let videoCodec = null;
//let audioCodec = null;
//let signalingKey = null;

// --- Ayame options ---
const options = defaultOptions;
console.log('Ayame default options:', options);
options.clientId = clientId ? clientId : options.clientId;
if (signalingKey) {
  options.signalingKey = signalingKey;
}

// ---- URL ----
function getRoomFromUrl() {
  const search = window.location.search;
  const re = new RegExp('room=([^&=]+)');
  const results = re.exec(search);
  let room = '';
  if (results) {
    room = results[1];
  }
  return room;
}

function getKeyFromUrl() {
  const search = window.location.search;
  const re = new RegExp('key=([^&=]+)');
  const results = re.exec(search);
  let key = null;
  if (results) {
    key = results[1];
  }
  return key;
}

// ------ App class ------
// interface SoraAppPropsInterface {
//   text?: string;
// }

interface AyameAppStateInterface {
  playing: boolean;
  connected: boolean;
  gotRemoteStream: boolean;
  roomId: string;
  signalingKey: string;
  videoCodec: "H264" | "VP8" | "VP9" | undefined; //VideoCodecOption; //VideoCodecType;
  //remoteStreams: { [key: string]: MediaStream; }
}

class App extends React.Component {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  conn: any;
  state: AyameAppStateInterface;

  constructor(props: object) {
    super(props);
    this.localStream = null;
    this.state = {
      playing: false,
      connected: false,
      gotRemoteStream: false,
      roomId: roomId,
      signalingKey: signalingKey,
      videoCodec: 'H264',
    };

    // This binding is necessary to make `this` work in the callback
    //this.startVideoHandler = this.startVideoHandler.bind(this);
    //this.stopVideoHandler = this.stopVideoHandler.bind(this);
    //this.stopVideo = this.stopVideo.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    //this.handleCodecChange = this.handleCodecChange.bind(this);

    // -- Ayame connection --
    this.conn = null;
    this.remoteStream = null;
  }

  componentDidMount() {
    console.log('App DidMound()');
  }

  componentWillUnmount() {
    console.log('App WillUnmount()');
    // if (this.localStream) {
    //   this.stopVideo();
    // }
  }

  // -----------

  // startVideoHandler(e: MouseEvent<HTMLButtonElement>) {
  //   e.preventDefault();
  //   console.log('start Video');
  //   if (this.localStream) {
  //     console.warn('localVideo ALREADY started');
  //     return;
  //   }

  //   const constraints = { video: true, audio: true };
  //   navigator.mediaDevices.getUserMedia(constraints)
  //     .then(stream => {
  //       this.localStream = stream;
  //       this.setState({ playing: true });
  //     })
  //     .catch(err => console.error('media ERROR:', err));
  // }

  // stopVideoHandler(e: MouseEvent<HTMLButtonElement>) {
  //   e.preventDefault();
  //   console.log('stop Video');
  //   this.stopVideo();
  // }

  // stopVideo() {
  //   if (this.localStream) {
  //     this.localStream.getTracks().forEach(track => track.stop());
  //     this.localStream = null;
  //     this.setState({ playing: false });
  //   }
  // }

  // -----------------
  connect(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('connect');

    if (this.conn) {
      console.warn('ALREADY connected');
      return;
    }

    if (this.state.signalingKey && (this.state.signalingKey !== '')) {
      options.signalingKey = this.state.signalingKey;
    }

    // -- recvonly, so DO NOT specify codec --
    //options.video.codec = this.state.videoCodec;

    // (signalingUrl: string, roomId: string, options: ConnectionOptions, debug: boolean, isRelay: boolean)
    console.log('connecting roomId=%s key=%s', this.state.roomId, options.signalingKey);
    console.log('Ayame connect options:', options);
    this.conn = AyameConnection(signalingUrl, this.state.roomId, options);
    this.conn.on('open', (e: any) => console.log('auth:', e.authzMetadata));
    this.conn.on('disconnect', (e: any) => {
      console.log('disconnected:', e);
      this.handleDisconnect();
    });
    this.conn.on('addstream', async (e: MediaStreamEvent) => {
      console.log(e.stream);
      this.remoteStream = e.stream;
      this.setState({ gotRemoteStream: true });
    });
    this.conn.on('removestream', async (e: MediaStreamEvent) => {
      console.log('removestream:', e);
      this.remoteStream = null;
      this.setState({ gotRemoteStream: false });
    });
    this.conn.connect(this.localStream)
      .then(() => {
        console.log('connected');
        this.setState({ connected: true });
      })
      .catch((err: Error) => { console.error('connect ERROR:', err) });
  }

  disconnect(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('disconnect');
    this.handleDisconnect();
  }

  handleDisconnect() {
    if (this.conn) {
      this.conn.disconnect();
      this.conn = null;
    }

    this.remoteStream = null;
    this.setState({ connected: false, gotRemoteStream: false });
  }

  handleRoomChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ roomId: e.target.value });
  }

  handleKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ signalingKey: e.target.value });
  }

  // handleCodecChange(e: React.ChangeEvent<HTMLSelectElement>) {
  //   this.setState({ videoCodec: e.target.value });
  // }

  // -----------------
  render() {
    console.log('App render()');
    return (
      <div className="App" >
        React-TS Ayame-Labo RecvOnly<br />
        {
          /*
          Video Codec:
          <select value={this.state.videoCodec} onChange={this.handleCodecChange} disabled={this.state.connected} >
            <option value="VP8">VP8</option>
            <option value="VP9">VP9</option>
            <option value="H264">H264</option>
          </select>
          &nbsp;
          <button onClick={this.startVideoHandler} disabled={this.state.playing || this.state.connected}> Start Video</button >
          <button onClick={this.stopVideoHandler} disabled={!this.state.playing || this.state.connected}>Stop Video</button>
          <br />
          */
        }
        SignalingKey: <input id="signaling_key" type="text" value={this.state.signalingKey} onChange={this.handleKeyChange} disabled={this.state.connected}></input>
        <br />
        Room: <input id="room_id" type="text" value={this.state.roomId} onChange={this.handleRoomChange} disabled={this.state.connected}></input>
        <button onClick={this.connect} disabled={this.state.connected}> Connect</button >
        <button onClick={this.disconnect} disabled={!this.state.connected}>Disconnect</button>
        <div className="VideoContainer">
          {
            /*
            <Video id={"local_video"} width={"160px"} height={"120px"} stream={this.localStream}>
            </Video>
            */
          }
          <div className="RemoteContainer">
            <Video id={"remote_video"} width={"320px"} height={"240px"} volume={0.5} controls={true} stream={this.remoteStream}>
            </Video>
          </div>
        </div>
      </div >
    );
  }
}

// ====================== ReactDOM rendering ====================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
