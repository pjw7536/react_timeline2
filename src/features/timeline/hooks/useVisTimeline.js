import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { useSelectionStore } from "@shared/store";
import { useTimelineStore } from "../store/timelineStore";

/**
 * vis-timeline 생성을 공통 처리하는 훅
 * @param {Object} params
 * @param {React.RefObject} params.containerRef - 타임라인 DOM을 가리키는 ref
 * @param {Array} params.groups - vis-timeline 그룹 배열
 * @param {Array} params.items - vis-timeline 아이템 배열
 * @param {Object} params.options - vis-timeline 옵션
 */
export function useVisTimeline({ containerRef, groups, items, options }) {
  // vis-timeline 인스턴스 보관용 ref
  const tlRef = useRef(null);

  // 현재 range를 저장할 ref 추가
  const currentRangeRef = useRef(null);

  // 선택 상태는 shared store에서 가져오기
  const { setSelectedRow, selectedRow } = useSelectionStore();

  // timeline 관련 상태는 timeline store에서 가져오기
  const { register, unregister, syncRange } = useTimelineStore();

  // 1. 컴포넌트 마운트 시 한 번만 인스턴스 생성
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Timeline } = await import("vis-timeline/standalone");
      if (!mounted || !containerRef.current) return;

      // 초기 아이템/그룹으로 타임라인을 생성
      const dataset = new DataSet(items);
      tlRef.current = new Timeline(
        containerRef.current,
        dataset,
        groups,
        options
      );

      register(tlRef.current);

      // 다른 타임라인과 범위 동기화
      tlRef.current.on("rangechange", ({ start, end }) => {
        // 현재 range를 저장
        currentRangeRef.current = { start, end };
        syncRange(tlRef.current, start, end);
      });

      // 아이템 선택 시 전역 상태에 반영
      tlRef.current.on("select", ({ items }) => {
        const currentSelected = useSelectionStore.getState().selectedRow;
        if (items && items.length > 0) {
          if (String(currentSelected) === String(items[0])) {
            setSelectedRow(null, "timeline");
            tlRef.current.setSelection([]);
          } else {
            setSelectedRow(items[0], "timeline");
          }
        } else {
          setSelectedRow(null, "timeline");
        }
      });
    })();

    return () => {
      mounted = false;
      if (tlRef.current) {
        // 스토어와 연결 해제 후 인스턴스 파괴
        unregister(tlRef.current);
        tlRef.current.destroy();
      }
    };
  }, [register, unregister, syncRange, setSelectedRow]);

  // 2. 아이템 배열이 바뀌면 교체
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.setItems(new DataSet(items));
    }
  }, [items]);

  // 3. 그룹 정보 변경 시 갱신 (visibility 처리 포함)
  useEffect(() => {
    if (tlRef.current && groups) {
      // vis-timeline의 그룹 visibility 설정
      const updatedGroups = groups.map((g) => ({
        ...g,
        visible: g.visible !== false,
      }));
      tlRef.current.setGroups(updatedGroups);
    }
  }, [groups]);

  // 4. 옵션의 min/max가 변경될 때만 range 업데이트 (초기 설정 시에만)
  useEffect(() => {
    if (
      tlRef.current &&
      options.min &&
      options.max &&
      !currentRangeRef.current
    ) {
      // 현재 저장된 range가 없을 때만 초기 range 설정
      tlRef.current.setWindow(options.min, options.max, { animation: false });
      currentRangeRef.current = { start: options.min, end: options.max };
    }
  }, [options.min, options.max]);

  // 5. 외부에서 선택된 행을 타임라인에 반영
  useEffect(() => {
    if (tlRef.current) {
      if (selectedRow && tlRef.current.itemsData.get(selectedRow)) {
        // setSelection을 호출하기 전에 현재 range 저장
        const currentWindow = tlRef.current.getWindow();
        currentRangeRef.current = {
          start: currentWindow.start,
          end: currentWindow.end,
        };

        tlRef.current.setSelection([selectedRow]);

        // 선택 후 range 복원
        if (currentRangeRef.current) {
          tlRef.current.setWindow(
            currentRangeRef.current.start,
            currentRangeRef.current.end,
            { animation: false }
          );
        }
      } else {
        tlRef.current.setSelection([]);
      }
    }
  }, [selectedRow]);

  return tlRef;
}
