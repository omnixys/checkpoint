import { useCallback, useState } from "react";

export function useMailSelection(allIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;

  const partiallySelected = selectedIds.length > 0 && !allSelected;

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(allSelected ? [] : allIds);
  }, [allIds, allSelected]);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    hasSelection: selectedIds.length > 0,
    allSelected,
    partiallySelected,
    isSelected: (id: string) => selectedIds.includes(id),
    toggle,
    selectAll,
    clear,
    count: selectedIds.length,
  };
}
