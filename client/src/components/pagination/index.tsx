import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

export function PaginationComponent() {
  return (
    <Pagination>
      <PaginationContent className="flex items-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="rounded-[20px] bg-[#E4E4E7] px-4 py-2 text-black h-[55px] w-[100px] font-nunito font-normal"
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            className="rounded-[20px] bg-red-100 text-[#484848] px-4 py-2 h-[55px] w-[52px] font-nunito font-normal">
            1
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis className="rounded-[20px] bg-[#E4E4E7] px-4 py-2 text-black h-[55px] w-[52px] font-nunito font-normal" />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            className="rounded-[20px] bg-[#E4E4E7] px-4 py-2 text-black h-[55px] w-[100px] font-nunito font-normal"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
