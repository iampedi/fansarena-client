import { Fragment } from "react";
import { useLocation, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AdminBreadcrumb() {
  const location = useLocation(); // مسیر فعلی
  const pathSegments = location.pathname
    .replace(/^\/|\/$/g, "") // حذف / اول و آخر
    .split("/")
    .filter(Boolean); // حذف موارد خالی

  const breadcrumbs = pathSegments.map((segment, index) => {
    const fullPath = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    if (fullPath === "/admin") {
      segment = "Dashboard";
    }

    return (
      <Fragment key={fullPath}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={fullPath}>{formatLabel(segment)}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </Fragment>
    );
  });

  function formatLabel(str) {
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
    </Breadcrumb>
  );
}
