"use client";

import { useMemo, useTransition } from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { useWindowSize } from "usehooks-ts";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { usePagination } from "~/hooks/use-pagination";

interface PaginationProps extends React.ComponentProps<"nav"> {
  page: number;
  pageCount: number;
  siblings: number;
  boundaries: number;
  onPageChange: (page: number) => void;
}

export const DOTS = "dots";

export function Pagination({
  page: currentPage,
  pageCount,
  siblings,
  boundaries,
  className,
  onPageChange,
  ...props
}: PaginationProps) {
  const { width } = useWindowSize();

  const isMobile = width <= 640;

  const { range, first, last, next, previous, setPage } = usePagination({
    total: pageCount,
    boundaries: isMobile ? 0 : boundaries,
    onChange: onPageChange,
    initialPage: 1,
    page: currentPage,
    siblings: isMobile ? 0 : siblings,
  });

  const [isPending, startTransition] = useTransition();

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center gap-1", className)}
      {...props}
    >
      {!isMobile && (
        <Button
          variant={"outline"}
          disabled={currentPage === 1}
          onClick={first}
          size="icon"
        >
          <DoubleArrowLeftIcon className="size-4" />
          <span className="sr-only">Найперша сторінка</span>
        </Button>
      )}
      <Button
        size="icon"
        variant={"outline"}
        className="mr-2"
        disabled={currentPage === 1}
        onClick={previous}
      >
        <ChevronLeftIcon className="size-4" />
        <span className="sr-only">Минула сторінка</span>
      </Button>
      {range.map((page, i) => {
        if (page === "dots") {
          return (
            <Button
              key={i}
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                const isRight = i > Math.ceil(range.length / 2);
                if (isRight) {
                  setPage(
                    currentPage + 5 > pageCount ? pageCount : currentPage + 5,
                  );
                } else {
                  setPage(currentPage - 5 < 1 ? 1 : currentPage - 5);
                }
              }}
            >
              <DotsHorizontalIcon className="size-4" />
            </Button>
          );
        }

        return (
          <Button
            key={i}
            variant={"outline"}
            size={"icon"}
            disabled={page === currentPage}
            onClick={() => {
              startTransition(() => {
                setPage(page);
              });
            }}
          >
            {page}
          </Button>
        );
      })}
      <Button
        variant={"outline"}
        className="ml-2"
        size="icon"
        disabled={currentPage === pageCount}
        onClick={next}
      >
        <ChevronRightIcon className="size-4" />
        <span className="sr-only">Наступна сторінка</span>
      </Button>
      {!isMobile && (
        <Button
          variant={"outline"}
          size="icon"
          disabled={currentPage === pageCount}
          onClick={last}
        >
          <DoubleArrowRightIcon className="size-4" />
          <span className="sr-only">Остання сторінка</span>
        </Button>
      )}
    </nav>
  );
}
