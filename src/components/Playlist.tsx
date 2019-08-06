import React, { Component } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import { Track } from "../lib/Tracks";
import Utils from "../lib/Utils";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";

@observer
export default class Playlist extends Component {
  playlist: HTMLDivElement | null;

  constructor(props: any) {
    super(props);

    this.playlist = null;

    reaction(
      () => store.track,
      () => {
        this.scrollToTrack();
      },
    );
  }

  playTrack(track: Track) {
    if (!store.track || store.track.id !== track.id) {
      store.track = track;
      store.paused = false;
    } else {
      store.paused = !store.paused;
    }
  }

  scrollToTrack() {
    if (this.playlist) {
      const id = store.tracks.findIndex(track => track === store.track);
      const trackHeight = 50;
      const top =
        id * trackHeight - this.playlist.offsetHeight / 2 + trackHeight / 2;

      this.playlist.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
  }

  render() {
    return (
      <div
        className="playlist"
        ref={ref => {
          this.playlist = ref;
        }}
      >
        <div className="tracks-list">
          {store.tracks.map((track, id) => {
            let className: string = "track-item";
            let progressWidth: number = 0;

            if (store.track && track.id === store.track.id) {
              className += " is-active";

              if (store.paused === false) {
                className += " is-playing";
              }

              if (store.progress > 0) {
                progressWidth = (store.progress / store.track.duration) * 100;
              }
            }

            return (
              <div
                className={className}
                key={`track-item-${id}`}
                onClick={() => this.playTrack(track)}
              >
                <div
                  className="track-progress"
                  style={{ width: `${progressWidth}%` }}
                />
                <div className="play-track">
                  <PlayArrow className="play-icon" />
                  <Pause className="pause-icon" />
                </div>
                <div className="track-meta">
                  <div className="track-title">{track.title}</div>
                  <div className="track-user">{track.user.username}</div>
                </div>
                <div className="track-duration">
                  {Utils.formatTimestamp(track.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
