import { create } from "zustand";

export const useSelectionStore = create((set) => ({
  /* —— A. 테이블·타임라인 동기 선택 —— */
  selectedRow: null,
  source: null,
  setSelectedRow: (row, src) => set({ selectedRow: row, source: src }),

  /* —— B. 드릴다운 상태 —— */
  lineId: "",
  sdwtId: "",
  prcGroup: "", // PRC Group 추가
  eqpId: "",
  setLine: (id) => set({ lineId: id, sdwtId: "", prcGroup: "", eqpId: "" }),
  setSdwt: (id) => set({ sdwtId: id, prcGroup: "", eqpId: "" }),
  setPrcGroup: (id) => set({ prcGroup: id, eqpId: "" }), // PRC Group setter 추가
  setEqp: (id) => set({ eqpId: id }),

  /* —— C. vis-timeline 인스턴스 풀 —— */
  pool: [],
  register: (tl) => set((s) => ({ pool: [...s.pool, tl] })),
  unregister: (tl) => set((s) => ({ pool: s.pool.filter((t) => t !== tl) })),

  syncRange: (self, start, end) =>
    set((state) => {
      state.pool.forEach((tl) => {
        if (tl !== self) tl.setWindow(start, end, { animation: false });
      });
      return state;
    }),
}));
