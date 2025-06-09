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
    ISSUED: "🟦ISSUED ",
    CLOSED: "🟪CLOSED ",
  };
  const config = groupConfig[type];
  if (!config) return `<div style="width:240px"></div>`;
  const legendHtml = Object.keys(config.stateColors)
    .map((state) => `<span>${EMOJI[state] || "▪️"}</span>`)
    .join(" ");
  return `<div style="width:240px;">${legendHtml}</div>`;
}

export function makeTipGroupLabel(process, step, ppid, showLegend) {
  // PPID만 표시하도록 수정
  const displayText = `<div class="tip-group-label-simple">${
    ppid || "N/A"
  }</div>`;

  if (!showLegend) {
    return `<div style="width:240px">${displayText}</div>`;
  }

  // Legend 모드일 때는 OPEN/CLOSE 범례 표시
  const legendHtml = `<span>🟦OPEN </span><span>🟥CLOSE </span>`;
  return `<div style="width:240px;">${legendHtml}</div>`;
}
