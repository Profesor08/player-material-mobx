import React, { Component } from "react";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import Utils from "../lib/Utils";

interface ITrackShortInfo {
  title: string;
  user: string;
  duration: number;
}

@observer
export default class TrackInfo extends Component {
  render() {
    const track: ITrackShortInfo = {
      title: store.track ? store.track.title : "No Track",
      user: store.track ? store.track.user.username : "No User",
      duration: store.track ? store.track.duration : 0,
    };

    return (
      <div
        className="track-info"
        onClick={() => {
          store.playlistActive = !store.playlistActive;
        }}
      >
        <div className="visualization-waves">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>
        <div className="track-title">{track.title}</div>
        <div className="track-user">{track.user}</div>
        <div className="track-time">
          <div className="current-time">0:00</div>
          <div className="separator">/</div>
          <div className="current-duration">
            {Utils.formatTimestamp(track.duration)}
          </div>
        </div>
      </div>
    );
  }
}
