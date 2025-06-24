// src/features/timeline/components/TipTreeFilter.jsx
import React, { useState, useMemo, useEffect } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { buildTipGroupTree } from "../utils/tipTreeUtils";

export default function TipTreeFilter({
  tipLogs,
  onFilterChange,
  selectedTipGroups,
  inDrawer = false,
}) {
  const [expandedNodes, setExpandedNodes] = useState(new Set(["LINE01"]));

  // 트리 구조 생성
  const tree = useMemo(() => buildTipGroupTree(tipLogs), [tipLogs]);

  // 초기 선택 상태를 selectedTipGroups 기반으로 설정
  const [selectedPpids, setSelectedPpids] = useState(() => {
    if (selectedTipGroups.includes("__ALL__")) {
      return new Set();
    }
    return new Set(selectedTipGroups);
  });

  const [isAllSelected, setIsAllSelected] = useState(() => {
    return selectedTipGroups.includes("__ALL__");
  });

  // selectedTipGroups prop이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (selectedTipGroups.includes("__ALL__")) {
      setIsAllSelected(true);
      setSelectedPpids(new Set());
    } else {
      setIsAllSelected(false);
      setSelectedPpids(new Set(selectedTipGroups));
    }
  }, [selectedTipGroups]);

  // 모든 ppid 키 가져오기
  const getAllPpidKeys = () => {
    const ppids = [];
    Object.values(tree).forEach((lineNode) => {
      Object.values(lineNode.children).forEach((processNode) => {
        Object.values(processNode.children).forEach((stepNode) => {
          Object.values(stepNode.children).forEach((ppidNode) => {
            ppids.push(ppidNode.key);
          });
        });
      });
    });
    return ppids;
  };

  // 노드 확장/축소
  const toggleExpand = (nodeKey) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeKey)) {
      newExpanded.delete(nodeKey);
    } else {
      newExpanded.add(nodeKey);
    }
    setExpandedNodes(newExpanded);
  };

  // 노드 선택 처리 - onFilterChange 직접 호출
  const handleNodeSelect = (node, checked) => {
    const newSelectedPpids = new Set(selectedPpids);
    let newIsAllSelected = isAllSelected;

    if (isAllSelected && !checked) {
      // 전체 선택 상태에서 하나를 해제하면
      newIsAllSelected = false;
      // 모든 ppid를 선택하고
      getAllPpidKeys().forEach((key) => newSelectedPpids.add(key));
      // 해당 노드의 ppid들만 제거
    }

    // 노드 타입에 따라 처리
    if (node.level === "ppid") {
      // ppid 직접 선택/해제
      if (checked && !isAllSelected) {
        newSelectedPpids.add(node.key);
      } else {
        newSelectedPpids.delete(node.key);
      }
    } else {
      // 상위 노드 선택 시 하위 ppid들 처리
      const ppidsToToggle = [];

      if (node.level === "line") {
        Object.values(node.children).forEach((processNode) => {
          Object.values(processNode.children).forEach((stepNode) => {
            Object.values(stepNode.children).forEach((ppidNode) => {
              ppidsToToggle.push(ppidNode.key);
            });
          });
        });
      } else if (node.level === "process") {
        Object.values(node.children).forEach((stepNode) => {
          Object.values(stepNode.children).forEach((ppidNode) => {
            ppidsToToggle.push(ppidNode.key);
          });
        });
      } else if (node.level === "step") {
        Object.values(node.children).forEach((ppidNode) => {
          ppidsToToggle.push(ppidNode.key);
        });
      }

      if (checked && !isAllSelected) {
        ppidsToToggle.forEach((key) => newSelectedPpids.add(key));
      } else {
        ppidsToToggle.forEach((key) => newSelectedPpids.delete(key));
      }
    }

    // 모든 ppid가 선택되었는지 확인
    if (newSelectedPpids.size === getAllPpidKeys().length) {
      newIsAllSelected = true;
      newSelectedPpids.clear();
    }

    setSelectedPpids(newSelectedPpids);
    setIsAllSelected(newIsAllSelected);

    // 부모 컴포넌트에 바로 알림
    if (newIsAllSelected) {
      onFilterChange(["__ALL__"]);
    } else if (newSelectedPpids.size === 0) {
      onFilterChange([]);
    } else {
      onFilterChange(Array.from(newSelectedPpids));
    }
  };

  // 노드의 선택 상태 확인
  const getNodeCheckState = (node) => {
    if (isAllSelected) return { checked: true, indeterminate: false };

    let childPpids = [];

    if (node.level === "ppid") {
      return { checked: selectedPpids.has(node.key), indeterminate: false };
    } else if (node.level === "line") {
      Object.values(node.children).forEach((processNode) => {
        Object.values(processNode.children).forEach((stepNode) => {
          Object.values(stepNode.children).forEach((ppidNode) => {
            childPpids.push(ppidNode.key);
          });
        });
      });
    } else if (node.level === "process") {
      Object.values(node.children).forEach((stepNode) => {
        Object.values(stepNode.children).forEach((ppidNode) => {
          childPpids.push(ppidNode.key);
        });
      });
    } else if (node.level === "step") {
      Object.values(node.children).forEach((ppidNode) => {
        childPpids.push(ppidNode.key);
      });
    }

    const selectedCount = childPpids.filter((key) =>
      selectedPpids.has(key)
    ).length;

    return {
      checked: selectedCount === childPpids.length,
      indeterminate: selectedCount > 0 && selectedCount < childPpids.length,
    };
  };

  // 전체 선택/해제 - onFilterChange 직접 호출
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPpids(new Set());
      setIsAllSelected(false);
      onFilterChange([]);
    } else {
      setSelectedPpids(new Set());
      setIsAllSelected(true);
      onFilterChange(["__ALL__"]);
    }
  };

  // 레벨별 스타일
  const getLevelStyle = (level) => {
    const styles = {
      line: {
        color: "text-blue-800 dark:text-blue-400",
        indent: 0,
        icon: "📍",
      },
      process: {
        color: "text-blue-800 dark:text-blue-400",
        indent: 10,
        icon: "⚙️",
      },
      step: {
        color: "text-blue-800 dark:text-blue-400",
        indent: 20,
        icon: "📋",
      },
      ppid: {
        color: "text-blue-800 dark:text-blue-400",
        indent: 30,
        icon: "🔧",
      },
    };
    return styles[level] || { color: "", indent: 0, icon: "" };
  };

  // 트리 노드 렌더링
  const renderTreeNode = (node) => {
    const hasChildren = Object.keys(node.children || {}).length > 0;
    const isExpanded = expandedNodes.has(node.key);
    const checkState = getNodeCheckState(node);
    const levelStyle = getLevelStyle(node.level);

    return (
      <div key={node.key} className="select-none">
        <div
          className="flex items-center gap-1 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ paddingLeft: `${levelStyle.indent + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.key)}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={checkState.checked}
              ref={(input) => {
                if (input) {
                  input.indeterminate = checkState.indeterminate;
                }
              }}
              onChange={(e) => handleNodeSelect(node, e.target.checked)}
              className="rounded text-blue-600"
            />
            <span
              className={`text-sm ${levelStyle.color} font-medium flex items-center gap-1`}
            >
              <span>{levelStyle.icon}</span>
              <span>{node.name}</span>
              <span className="text-xs text-gray-500 ml-1">({node.count})</span>
            </span>
          </label>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 border-l-2 border-gray-200 dark:border-gray-700">
            {Object.values(node.children).map((child) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={inDrawer ? "" : "bg-white dark:bg-slate-800 rounded-lg mb-2"}
    >
      <div className="flex items-center justify-between mb-3">
        {!inDrawer && (
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            TIP 그룹 필터
          </h4>
        )}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {isAllSelected ? "전체" : selectedPpids.size}개 선택
          </span>
          <button
            onClick={handleSelectAll}
            className="text-xs text-blue-700 dark:text-blue-300 hover:underline"
          >
            {isAllSelected ? "전체 해제" : "전체 선택"}
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto ml-0">
        {Object.values(tree).map((lineNode) => renderTreeNode(lineNode))}
      </div>
    </div>
  );
}
