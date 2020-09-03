export class Framer {
    constructor(video, frameRate) {
        this.video = video;
        ///////////////////////////////////////////////////////////////////////
        // FRAME VARIABLES
        //
        // framerate
        // As of writing this, I know of no good way to determine framerate in
        // javascript. Thus is needs to be supplied.
        //
        //
        ///////////////////////////////////////////////////////////////////////
        this.FRAMERATE = frameRate * 1000/1001;
        this.FRAME_DURATION = 1/this.FRAMERATE;
        this._lastframe = 0;
        this.offset = 0.001;

        ///////////////////////////////////////////////////////////////////////
        // Set up listeners
        ///////////////////////////////////////////////////////////////////////
        requestAnimationFrame(() => this._onAnimationFrame());

        this.onpause = function(){};
        this.onseeked = function(){};
        this.frozen = false;
    }

    _onAnimationFrame() {
        if (!this.video.paused) {
            const frame = this.getCurrentFrame();
            if (frame != this._lastframe) {
                this._lastframe = frame;
                this.onframeupdate(this);
            }
        }
        requestAnimationFrame(() => this._onAnimationFrame());
    }

    ////////////////////////////////////////////////////////////////////////////
    // Listeners
    ////////////////////////////////////////////////////////////////////////////

    on(listener, callback) {
        if (listener == "pause") {
            this.onpause = callback;
        }
        else if (listener == "frameupdate") {
            this.onframeupdate = callback;
        }
        else if (listener == "seeked") {
            this.onseeked = callback;
        }
        return this;
    }

    onframeupdate() {}

    _fixframe() {
        if (!this.frozen) {
            this.frozen = true;
            console.log("fixed", this.getCurrentFrame());
            this.video.currentTime = framey.FRAME_DURATION * this.getCurrentFrame();
        }
    }

    get onpause() {
        return this.video.onpause;
    }

    set onpause(callback) {
        this.video.onpause = (event) => {
            callback(event);
            this.frozen = false;
            this._fixframe();
        };
    }

    get onseeked() {
        return this.video.onseeked;
    }

    set onseeked(callback) {
        this.video.onseeked = (event) => {
            callback(event);
            this.onframeupdate(this);
        };
    }

    ////////////////////////////////////////////////////////////////////////////
    // On Pause
    ////////////////////////////////////////////////////////////////////////////

    stepForward() {
        this.frozen = true;
        const frame = this.getCurrentFrame() + 1 - this.offset;
        this.video.currentTime = frame * this.FRAME_DURATION;
        this.onframeupdate(this);
    }

    stepBackward() {
        this.frozen = true;
        const frame = this.getCurrentFrame() - 1 - this.offset;
        this.video.currentTime = frame * this.FRAME_DURATION;
        this.onframeupdate(this);
    }

    getCurrentFrame() {
        const frame = Math.round((this.video.currentTime - this.offset) * this.FRAMERATE);
        if (frame * this.FRAME_DURATION < this.video.currentTime) {
            return frame + 1;
        }
        if (frame != this._lastframe) {
            this._lastframe = frame;
        }
        return frame;
    }
}

