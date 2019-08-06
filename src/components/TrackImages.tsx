import React, { Component } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { store } from "../store/PlayerStore";
import { next, prev, Track } from "../lib/Tracks";
// import throttle from "lodash/throttle";

interface IPointer {
  x: number;
  y: number;
}

interface TrackImagesProps {}

interface TrackImagesState {
  isDragging: boolean;
  pointerStart: IPointer;
  pointer: IPointer;
  prevTrack: Track | null;
  prePrevTrack: Track | null;
  nextTrack: Track | null;
  preNextTrack: Track | null;
}

@observer
export default class TrackImages extends Component<
  TrackImagesProps,
  TrackImagesState
> {
  slider: HTMLElement | null = null;

  constructor(props: TrackImagesProps, state: TrackImagesState) {
    super(props, state);

    const prevTrack = prev(store.tracks, store.track, store.shuffle);
    const prePrevTrack = prev(store.tracks, prevTrack, store.shuffle);
    const nextTrack = next(store.tracks, store.track, store.shuffle);
    const preNextTrack = next(store.tracks, nextTrack, store.shuffle);

    this.state = {
      isDragging: false,
      pointerStart: { x: 0, y: 0 },
      pointer: { x: 0, y: 0 },
      prevTrack,
      prePrevTrack,
      nextTrack,
      preNextTrack,
    };

    reaction(
      () => store.tracks,
      tracks => {
        const prevTrack = prev(tracks, store.track, store.shuffle);
        const prePrevTrack = prev(tracks, prevTrack, store.shuffle);
        const nextTrack = next(tracks, store.track, store.shuffle);
        const preNextTrack = next(tracks, nextTrack, store.shuffle);

        this.setState({
          prevTrack,
          prePrevTrack,
          nextTrack,
          preNextTrack,
        });
      },
    );

    reaction(
      () => store.track,
      track => {
        const prevTrack = prev(store.tracks, track, store.shuffle);
        const prePrevTrack = prev(store.tracks, prevTrack, store.shuffle);
        const nextTrack = next(store.tracks, track, store.shuffle);
        const preNextTrack = next(store.tracks, nextTrack, store.shuffle);

        this.setState({
          prevTrack,
          prePrevTrack,
          nextTrack,
          preNextTrack,
        });
      },
    );
  }

  onPointerDown = (x: number, y: number) => {
    this.setState({
      isDragging: true,

      pointerStart: {
        x: x,
        y: y,
      },

      pointer: {
        x: x,
        y: y,
      },

      prevTrack: prev(store.tracks, store.track, store.shuffle),

      nextTrack: next(store.tracks, store.track, store.shuffle),
    });
  };

  onPointerUp = () => {
    if (this.state.isDragging) {
      const dist = this.state.pointer.x - this.state.pointerStart.x;

      if (Math.abs(dist) > 70) {
        if (dist < 0) {
          store.track = this.state.nextTrack;
        } else {
          store.track = this.state.prevTrack;
        }
      }

      this.setState({
        isDragging: false,
      });
    }
  };

  onPointerMove = (x: number, y: number) => {
    if (this.state.isDragging) {
      this.setState({
        pointer: {
          x: x,
          y: y,
        },
      });
    }
  };

  render() {
    let className = "track-images";

    if (this.state.isDragging) {
      className += " no-transition";
    }

    return (
      <div
        className={className}
        onPointerDown={e => {
          e.preventDefault();
          this.onPointerDown(e.clientX, e.clientY);
        }}
        onPointerUp={e => {
          e.preventDefault();
          this.onPointerUp();
        }}
        onPointerLeave={e => {
          e.preventDefault();
          this.onPointerUp();
        }}
        onPointerMove={e => {
          e.preventDefault();
          this.onPointerMove(e.clientX, e.clientY);
        }}
      >
        {store.tracks.map((track, id) => {
          let className = "track-image";
          let style = {};
          const isActive: boolean =
            store.track !== null && store.track.id === track.id;

          const isPrev: boolean =
            this.state.prevTrack !== null &&
            this.state.prevTrack.id === track.id;

          const isPrePrev: boolean =
            this.state.prePrevTrack !== null &&
            this.state.prePrevTrack.id === track.id;

          const isNext: boolean =
            this.state.nextTrack !== null &&
            this.state.nextTrack.id === track.id;

          const isPreNext: boolean =
            this.state.preNextTrack !== null &&
            this.state.preNextTrack.id === track.id;

          if (isActive) {
            className += " is-active";
          }

          if (isPrev) {
            className += " is-prev";
          }

          if (isPrePrev) {
            className += " is-pre-prev";
          }

          if (isNext) {
            className += " is-next";
          }

          if (isPreNext) {
            className += " is-pre-next";
          }

          if (this.state.isDragging) {
            const x = this.state.pointer.x - this.state.pointerStart.x;

            if (isActive) {
              style = {
                transform: `translate(${x}px, 0)`,
              };
            }

            if (isPrev) {
              style = {
                transform: `translate(calc(-100% + ${x}px), 0)`,
              };
            }

            if (isPrePrev) {
              style = {
                transform: `translate(calc(-200% + ${x}px), 0)`,
              };
            }

            if (isNext) {
              style = {
                transform: `translate(calc(100% + ${x}px), 0)`,
              };
            }

            if (isPreNext) {
              style = {
                transform: `translate(calc(200% + ${x}px), 0)`,
              };
            }
          }

          return (
            <div key={`track-image-${id}`} className={className} style={style}>
              <div
                className="track-cover"
                style={{
                  backgroundImage: `url(${track.artwork_url})`,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
