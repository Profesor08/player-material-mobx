import { Component } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import throttle from "lodash/throttle";
import { next, Track } from "../lib/Tracks";

interface IAudioPlayerProps {}

interface IAudioPlayerState {}

@observer
export default class AudioPlayer extends Component<
  IAudioPlayerProps,
  IAudioPlayerState
> {
  audio: HTMLAudioElement;

  constructor(props: IAudioPlayerProps, state: IAudioPlayerState) {
    super(props, state);

    this.audio = new Audio();

    this.audio.volume = store.volume;
    this.audio.currentTime = 0;

    reaction(
      () => store.volume,
      volume => {
        this.audio.volume = volume;
      },
    );

    reaction(
      () => store.paused,
      async paused => {
        if (paused) {
          await this.audio.pause();
        } else {
          try {
            await this.audio.play();
          } catch (err) {
            console.log(err);
          }
        }
      },
    );

    reaction(
      () => store.track,
      (track: Track | null) => {
        if (track) {
          this.audio.src = track.stream_url;
        }
      },
    );

    reaction(
      () => store.audioPlayerProgressNeedsUpdate,
      audioPlayerProgressNeedsUpdate => {
        if (audioPlayerProgressNeedsUpdate) {
          this.audio.currentTime = store.progress / 1000;
          store.audioPlayerProgressNeedsUpdate = false;
        }
      },
    );
  }

  componentDidMount() {
    this.audio.addEventListener("error", (err: ErrorEvent) => {
      if (this.audio && store.track) {
        this.audio.src = store.track.stream_url;
      }
    });

    this.audio.addEventListener("canplay", async () => {
      if (!store.paused) {
        try {
          await this.audio.play();
        } catch (err) {
          console.warn(err);
        }
      }
    });

    this.audio.addEventListener("loadstart", async () => {
      if (!store.paused) {
        try {
          await this.audio.play();
        } catch (err) {
          console.warn(err);
        }
      }
    });

    this.audio.addEventListener(
      "timeupdate",
      throttle(() => {
        store.progress = this.audio.currentTime * 1000;
      }, 16),
    );

    this.audio.addEventListener("ended", () => {
      if (!store.repeat) {
        const track = next(store.tracks, store.track, store.shuffle);

        if (track) {
          store.track = track;
          store.progress = 0;
          store.audioPlayerProgressNeedsUpdate = true;
        }
      } else {
        if (store.track) {
          store.progress = 0;
          store.audioPlayerProgressNeedsUpdate = true;
        }
      }
    });
  }

  render() {
    return null;
  }
}
