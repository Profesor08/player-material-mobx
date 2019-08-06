import React, { Component } from "react";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import { next, prev } from "../lib/Tracks";
import PlayerControl from "./PlayerControl";
import Shuffle from "@material-ui/icons/Shuffle";
import SkipPrevious from "@material-ui/icons/SkipPrevious";
import SkipNext from "@material-ui/icons/SkipNext";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import Repeat from "@material-ui/icons/Repeat";
import RepeatOne from "@material-ui/icons/RepeatOne";

@observer
export default class PlayerControls extends Component {
  playToggle() {
    store.paused = !store.paused;
  }

  shuffleToggle() {
    store.shuffle = !store.shuffle;
  }

  repeatToggle() {
    store.repeat = !store.repeat;
  }

  prevTrack() {
    const track = prev(store.tracks, store.track, store.shuffle);

    if (track) {
      store.track = track;
      store.progress = 0;
    }
  }

  nextTrack() {
    const track = next(store.tracks, store.track, store.shuffle);

    if (track) {
      store.track = track;
      store.progress = 0;
    }
  }

  render() {
    const classNames = {
      shuffle: `control control-shuffle`,
      prev: `control control-prev`,
      play: `control control-play`,
      next: `control control-next`,
      repeat: `control control-repeat`,
    };

    classNames.play += !store.paused ? " is-active" : "";
    classNames.shuffle += store.shuffle ? " is-active" : "";
    classNames.repeat += store.repeat ? " is-active" : "";

    return (
      <div className="player-controls">
        <PlayerControl
          className="control-shuffle"
          active={store.shuffle}
          action={() => {
            this.shuffleToggle();
          }}
        >
          <Shuffle className="control-icon icon-shuffle" />
        </PlayerControl>

        <PlayerControl
          className={classNames.prev}
          action={() => {
            this.prevTrack();
          }}
        >
          <SkipPrevious className="control-icon icon-prev" />
        </PlayerControl>

        <PlayerControl
          className="control-play"
          active={!store.paused}
          action={() => {
            this.playToggle();
          }}
          ripple={false}
        >
          <PlayArrow className="control-icon icon-play" />
          <Pause className="control-icon icon-pause" />
        </PlayerControl>

        <PlayerControl
          className={classNames.next}
          action={() => {
            this.nextTrack();
          }}
        >
          <SkipNext className="control-icon icon-next" />
        </PlayerControl>

        <PlayerControl
          className="control-repeat"
          active={store.repeat}
          action={() => {
            this.repeatToggle();
          }}
        >
          <Repeat className="control-icon icon-repeat-inactive" />
          <RepeatOne className="control-icon icon-repeat-active" />
        </PlayerControl>
      </div>
    );
  }
}
