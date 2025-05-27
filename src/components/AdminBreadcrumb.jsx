// src/components/AdminBreadcrumb.jsx
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
  const location = useLocation();
  const pathSegments = location.pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);

  if (pathSegments.length <= 1) {
    return null;
  }

  const segmentLabels = {
    admin: "Dashboard",
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    const fullPath = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

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
    const label = segmentLabels[str] || str;

    return label
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
    </Breadcrumb>
  );
}
