import { observable, computed } from "mobx";
import { Track } from "../lib/Tracks";

interface IPlayerStoreInitialState {
  shuffle?: boolean;
  repeat?: boolean;
  volume?: number;
}

export class PlayerStore {
  @observable private _volume: number = 0.2;
  @observable public progress: number = 0;
  @observable public shuffle: boolean = false;
  @observable public repeat: boolean = false;
  @observable public paused: boolean = true;
  @observable public track: Track | null = null;
  @observable public tracks: Track[] = [];
  @observable public playlistActive: boolean = false;
  @observable public audioPlayerProgressNeedsUpdate: boolean = false;
  @observable public sidebarIsActive: boolean = false;

  constructor({ volume, shuffle, repeat }: IPlayerStoreInitialState = {}) {
    if (typeof volume === "number") {
      this.volume = volume;
    }

    if (typeof shuffle === "boolean") {
      this.shuffle = shuffle;
    }

    if (typeof repeat === "boolean") {
      this.repeat = repeat;
    }
  }

  @computed
  get volume(): number {
    return this._volume;
  }

  set volume(volume: number) {
    if (volume > 1) {
      this._volume = 1;
    } else if (volume < 0) {
      this._volume = 0;
    } else {
      this._volume = volume;
    }
  }
}

let config: IPlayerStoreInitialState = {};

try {
  const json = localStorage.getItem("playerConfiguration");

  if (json) {
    const data = JSON.parse(json);

    config.shuffle = data.shuffle;
    config.repeat = data.repeat;
    config.volume = data.volume;
  }
} catch (err) {}

export const store = new PlayerStore(config);
