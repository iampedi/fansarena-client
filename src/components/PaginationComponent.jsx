// src/components/PaginationComponent.jsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponent(props) {
  const { currentPage, totalPages, onPageChange } = props;

  const handleClick = (page) => (e) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handleClick(currentPage - 1)} />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i + 1}
              onClick={handleClick(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 10 && currentPage < totalPages - 9 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext href="#" onClick={handleClick(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
