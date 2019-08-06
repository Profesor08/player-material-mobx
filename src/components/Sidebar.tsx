import React, { Component } from "react";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import throttle from "lodash/throttle";
import VolumeMute from "@material-ui/icons/VolumeMute";
import VolumeUp from "@material-ui/icons/VolumeUp";
import PlayerControl from "./PlayerControl";
import InputRange from "./InputRange";

@observer
export default class Sidebar extends Component {
  updateVolume = throttle((volume: number) => {
    store.volume = volume;
  }, 20);

  render() {
    let className = "sidebar";
    let volumeClassName = "volume";

    if (store.sidebarIsActive) {
      className += " is-active";
    }

    if (store.volume === 0) {
      volumeClassName += " is-muted";
    }

    return (
      <div className={className}>
        <div
          className="sidebar-back"
          onClick={() => {
            store.sidebarIsActive = false;
          }}
        />
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="profile">
              <img
                className="profile-image"
                src={process.env.PUBLIC_URL + "icon-128.png"}
                alt=""
                width="64"
                height="64"
              />
              <div className="profile-info">
                <div className="profile-name">Prof</div>
                <div className="profile-email">online7890@gmail.com</div>
              </div>
            </div>
          </div>
          <div className="sidebar-controls">
            <div className={volumeClassName}>
              <PlayerControl
                className="volume-button"
                action={() => {
                  store.volume = 0;
                }}
                ripple={true}
              >
                <VolumeUp className="volume-icon volume-up" />
                <VolumeMute className="volume-icon volume-mute" />
              </PlayerControl>
              <InputRange
                min={0}
                max={1}
                step={0.01}
                value={store.volume}
                onChange={volume => this.updateVolume(volume)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
