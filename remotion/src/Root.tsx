import React from "react";
import {Composition} from "remotion";
import {FPS, H, TOTAL, totalOf, W} from "./theme";
import {Video} from "./Video";

export const Root: React.FC = () => (
  <>
    <Composition id="MasarJadid" component={Video} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
    <Composition id="MasarJadidShort" component={Video} width={W} height={H} fps={FPS} durationInFrames={totalOf("short")} defaultProps={{cut: "short" as const}} />
  </>
);
