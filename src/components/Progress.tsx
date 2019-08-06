import React, { Component } from "react";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import throttle from "lodash/throttle";
import InputRange from "./InputRange";

@observer
export default class Progress extends Component {
  updateProgress = throttle((progress: number) => {
    store.progress = progress;
    store.audioPlayerProgressNeedsUpdate = true;
  }, 20);

  changeStart(e: React.MouseEvent | React.TouchEvent) {
    this.setState({
      changing: true,
    });
  }

  changeStop(e: React.MouseEvent | React.TouchEvent) {
    const progress = parseInt((e.target as HTMLInputElement).value);

    this.setState({
      changing: false,
    });

    this.updateProgress(progress);
  }

  render() {
    const max = store.track ? store.track.duration : 0;

    return (
      <InputRange
        className="progress"
        min={0}
        max={max}
        step={1}
        value={store.progress}
        onEnd={value => this.updateProgress(value)}
      />
    );
  }
}
