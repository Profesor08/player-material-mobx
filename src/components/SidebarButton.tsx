import React, { Component } from "react";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import PlayerControl from "./PlayerControl";

@observer
export default class SidebarButton extends Component {
  render() {
    return (
      <PlayerControl
        className="sidebar-button"
        active={store.sidebarIsActive}
        action={() => {
          store.sidebarIsActive = !store.sidebarIsActive;
        }}
      >
        <div className="line line-1" />
        <div className="line line-2" />
        <div className="line line-3" />
      </PlayerControl>
    );
  }
}
