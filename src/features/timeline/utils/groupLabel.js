// src/features/timeline/utils/groupLabel.js

import { groupConfig } from "./timelineMeta";

export function makeGroupLabel(type, title, showLegend) {
  if (!showLegend) {
    return `<div style="width:240px">${title}</div>`;
  }
  const EMOJI = {
    RUN: "🟦RUN ",
    IDLE: "🟨IDLE ",
    PM: "🟩PM ",
    DOWN: "🟥DOWN ",
    OPEN: "🟦OPEN ",
    CLOSE: "🟥CLOSE ",
    ALARM: "🟥ALARM ",
    WARN: "🟧WARN ",
    TTM_FAIL: "🟥TTM_FAIL ",
    TTM_WARN: "🟨TTM_WARN ",
    CREATED: "🟩CREATED ",
    IN_PROGRESS: "🟦IN_PROGRESS ",
    RESOLVED: "🟪RESOLVED ",
    CLOSED: "⬜CLOSED ",
    REOPENED: "🟧REOPENED ",
    BLOCKED: "🟥BLOCKED ",
  };
  const config = groupConfig[type];
  if (!config) return `<div style="width:240px"></div>`;
  const legendHtml = Object.keys(config.stateColors)
    .map((state) => `<span>${EMOJI[state] || "▪️"}</span>`)
    .join(" ");
  return `<div style="width:240px;">${legendHtml}</div>`;
}
