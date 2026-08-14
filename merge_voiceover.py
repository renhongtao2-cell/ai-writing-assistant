#!/usr/bin/env python3
# Merge the English voiceover (demo_narration.mp3) into a screen-recording video.
# Usage:
#   python merge_voiceover.py <video.mp4>            # replace original audio
#   python merge_voiceover.py <video.mp4> --keep-original   # mix original (low) + narration
# Output: demo_final_with_voiceover.mp4 (next to this script)
import sys, os, subprocess, re
import imageio_ffmpeg

def probe_duration_sec(ffmpeg, video):
    out = subprocess.run([ffmpeg, "-i", video], stderr=subprocess.PIPE, text=True).stderr
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", out)
    if not m:
        return None
    h, mi, s = int(m.group(1)), int(m.group(2)), float(m.group(3))
    return h * 3600 + mi * 60 + s

def main():
    keep = "--keep-original" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 1:
        print("Usage: python merge_voiceover.py <video.mp4> [--keep-original]")
        sys.exit(1)
    video = args[0]
    if not os.path.isfile(video):
        print("ERROR: video not found:", video)
        sys.exit(1)

    here = os.path.dirname(os.path.abspath(__file__))
    narr = os.path.join(here, "demo_narration.mp3")
    out = os.path.join(here, "demo_final_with_voiceover.mp4")
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    dur = probe_duration_sec(ffmpeg, video)
    pad = f"whole_dur={dur:.3f}" if dur else "whole_dur=195"

    if keep:
        filt = f"[0:a]volume=0.3[a0];[1:a]apad={pad}[n];[a0][n]amix=inputs=2:duration=longest[a]"
        cmd = [ffmpeg, "-i", video, "-i", narr, "-filter_complex", filt,
               "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-shortest", out]
    else:
        filt = f"[1:a]apad={pad}[a]"
        cmd = [ffmpeg, "-i", video, "-i", narr, "-filter_complex", filt,
               "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", out]

    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)
    print("WROTE:", out)

if __name__ == "__main__":
    main()
