# Our Story — anniversary website

Open `index.html` in a browser. She types the anniversary date (14/10/2025, also accepts
"14 October 2025" or 2025-10-14) and the story opens.

## What to edit

| What | Where |
|---|---|
| Anniversary date | `script.js`, top: `ANNIVERSARY` |
| Moment titles, dates, captions | `index.html`, each `MOMENT 1` … `MOMENT 6` block |
| Which photo/video goes in a moment | change the number in `images/momentN.jpg` / `videos/momentN.mp4` |
| Your long paragraph | `index.html`, the `THE LETTER` block (one `<p>` per paragraph) and `— Your name` |
| Colours and fonts | `style.css`, top `:root` block |

Floating photos are picked automatically: every photo that is not used in a moment
floats in the background, so after you shuffle you don't need to update anything else.
If you add or remove photos, update `TOTAL_PHOTOS` in `script.js`.

`RENAMED-FILES.txt` lists each old file name and its new `momentN` name.

## Songs

Put these mp3 files in the `music/` folder:

| File | When it plays |
|---|---|
| `song.mp3` | The song of the whole website. Starts when she taps Enter. |
| `song2.mp3` | While the moment 2 video plays |
| `song3.mp3` | While the moment 3 video plays |
| `song4.mp3` | While the moment 4 video plays |
| `song5.mp3` | While the moment 5 video plays |
| `song6.mp3` | While the moment 6 video plays |

The videos in moments 2 to 6 have no sound of their own; their song plays instead, and
`song.mp3` comes back when the video is paused or ends. The moment 1 video keeps its own
sound and the music waits for it. Every song fades in and out instead of cutting off.
If a video's song file is missing, `song.mp3` just keeps playing. A ♫ button in the
corner turns the music off and on.

To give another video its own song, add `muted data-song="music/yourfile.mp3"` to its
`<video>` tag in `index.html`.
