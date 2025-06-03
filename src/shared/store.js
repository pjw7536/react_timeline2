import { create } from "zustand";

export const useSelectionStore = create((set) => ({
  /* —— A. 테이블·타임라인 동기 선택 —— */
  selectedRow: null,
  source: null, // 'table' or 'timeline'
  setSelectedRow: (row, src) => set({ selectedRow: row, source: src }),

  /* —— B. 드릴다운 상태 —— */
  lineId: "",
  sdwtId: "",
  eqpId: "",
  setLine: (id) => set({ lineId: id, sdwtId: "", eqpId: "" }),
  setSdwt: (id) => set({ sdwtId: id, eqpId: "" }),
  setEqp: (id) => set({ eqpId: id }),

  /* —— C. vis-timeline 인스턴스 풀 —— */
  pool: [],
  register: (tl) => set((s) => ({ pool: [...s.pool, tl] })),
  unregister: (tl) => set((s) => ({ pool: s.pool.filter((t) => t !== tl) })),

  // 모든 타임라인의 “보이는 구간”을 동기화
  syncRange: (self, start, end) =>
    set((state) => {
      state.pool.forEach((tl) => {
        if (tl !== self) tl.setWindow(start, end, { animation: false });
      });
      return state; // immer 없이 순수 set
    }),
}));
