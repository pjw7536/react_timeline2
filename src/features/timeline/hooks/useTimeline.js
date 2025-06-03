import { useRef } from "react";
import { useTimelineRenderer } from "./useTimelineRenderer";

export const useTimeline = (groupKey, data, options) => {
  const ref = useRef(null);
  useTimelineRenderer(ref, groupKey, data, options);
  return ref;
};
