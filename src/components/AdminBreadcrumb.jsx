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
import { GlobeIcon, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import LogoutButton from "./LogoutButton";

export default function AdminBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);

  if (pathSegments.length <= 1) {
    return (
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/">
            <GlobeIcon />
          </Link>
        </Button>
        <LogoutButton icon={true} />
      </div>
    );
  }

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
