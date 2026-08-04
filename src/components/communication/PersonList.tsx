"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { List as VList } from "react-window";
import { CommunicationSearch } from "./CommunicationSearch";
import { type PersonData, PersonListItem } from "./PersonListItem";

const ITEM_HEIGHT = 64;

const SKELETON_PLACEHOLDERS = [0, 1, 2, 3, 4, 5];

interface Props {
  title?: string;
  persons: PersonData[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function PersonList({
  title,
  persons,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  loading = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No results",
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setListHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return persons;
    const q = search.toLowerCase().trim();
    return persons.filter(
      (p) => p.name.toLowerCase().includes(q) || p.roles?.some((r) => r.toLowerCase().includes(q)),
    );
  }, [persons, search]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {title && (
        <Typography
          variant="subtitle2"
          sx={{
            px: 2,
            py: 1.5,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            color: "text.secondary",
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ px: 1.5, pb: 1 }}>
        <CommunicationSearch
          placeholder={searchPlaceholder}
          value={search}
          onChange={onSearchChange}
        />
      </Box>

      <Box ref={listRef} sx={{ flex: 1, overflow: "hidden", px: 1 }}>
        {loading ? (
          SKELETON_PLACEHOLDERS.map((id) => (
            <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={12} />
              </Box>
            </Box>
          ))
        ) : filtered.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            {emptyMessage}
          </Typography>
        ) : (
          <VList
            style={{ height: listHeight, width: "100%" }}
            rowCount={filtered.length}
            rowHeight={ITEM_HEIGHT}
            overscanCount={5}
            rowProps={{}}
            rowComponent={({ index, style }) => {
              const person = filtered[index];
              if (!person) return null;
              return (
                <div style={style}>
                  <PersonListItem
                    person={person}
                    selected={person.id === selectedId}
                    onClick={onSelect}
                  />
                </div>
              );
            }}
          />
        )}
      </Box>
    </Box>
  );
}
