import {Box, Breadcrumbs, Link, Typography} from "@mui/material";
import {ChevronRight, Home} from "lucide-react";
import type React from "react";
import {memo, useMemo} from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  component?: React.ElementType;
  to?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

export type BreadcrumbVariant = "default" | "contrast" | "subtle";

export interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
  sx?: any;
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  variant?: BreadcrumbVariant;
}

interface ColorScheme {
  link: string;
  linkHover: string;
  active: string;
  inactive: string;
  underline: string;
}

const COLOR_SCHEMES: Record<BreadcrumbVariant, ColorScheme> = {
  default: {
    link: "#2563eb",
    linkHover: "#1d4ed8",
    active: "#1e40af",
    inactive: "#64748b",
    underline: "#3b82f6",
  },
  contrast: {
    link: "#0f172a",
    linkHover: "#1e293b",
    active: "#0369a1",
    inactive: "#64748b",
    underline: "#0369a1",
  },
  subtle: {
    link: "#64748b",
    linkHover: "#475569",
    active: "#334155",
    inactive: "#94a3b8",
    underline: "#64748b",
  },
};

const TIMING = "0.25s cubic-bezier(0.4, 0, 0.2, 1)";

const containerSx = {
  "& .MuiBreadcrumbs-root": {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  "& .MuiBreadcrumbs-separator": {
    display: "flex",
    alignItems: "center",
    margin: "0 0.25rem",
    color: "rgba(100, 116, 139, 0.5)",
    animation: "fadeIn 0.3s ease-in-out",
  },
  "@keyframes fadeIn": {
    from: {opacity: 0, transform: "translateX(-4px)"},
    to: {opacity: 1, transform: "translateX(0)"},
  },
};

const breadcrumbsSx = {
  "& .MuiBreadcrumbs-li": {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
  },
};

const iconSx = {
  "display": "flex",
  "alignItems": "center",
  "fontSize": "1rem",
  "opacity": 0.85,
  "transition": "opacity 0.2s ease-in-out",
  ".MuiLink-root:hover &, .MuiTypography-root:hover &": {opacity: 1},
};

const linkSx = (isActive: boolean, colors: ColorScheme) => ({
  "fontSize": "0.9375rem",
  "fontWeight": isActive ? 600 : 500,
  "color": isActive ? colors.active : colors.link,
  "textDecoration": "none",
  "transition": `all ${TIMING}`,
  "position": "relative",
  "cursor": "pointer",
  "display": "flex",
  "alignItems": "center",
  "gap": "0.375rem",
  "padding": "0.25rem 0",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: isActive ? "100%" : 0,
    height: "2px",
    backgroundColor: colors.underline,
    borderRadius: "2px",
    transition: `width ${TIMING}`,
  },
  "&:hover": {
    "color": colors.linkHover,
    "transform": "translateY(-1px)",
    "&::after": {width: "100%"},
  },
  "&:active": {transform: "translateY(0)"},
});

const typographySx = (isLast: boolean, colors: ColorScheme) => ({
  fontSize: "0.9375rem",
  fontWeight: isLast ? 600 : 500,
  color: isLast ? colors.active : colors.inactive,
  transition: "color 0.3s ease-in-out",
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.25rem 0",
});

const Separator = memo<{icon?: React.ReactNode}>(({icon}) =>
  icon ? (
    <>{icon}</>
  ) : (
    <ChevronRight
      size={16}
      strokeWidth={2}
      style={{opacity: 0.4, transition: "opacity 0.2s", color: "#64748b"}}
    />
  )
);
Separator.displayName = "Separator";

const BreadcrumbItemComponent = memo<{
  item: BreadcrumbItem;
  isLast: boolean;
  variant: BreadcrumbVariant;
}>(({item, isLast, variant}) => {
  const colors = COLOR_SCHEMES[variant];
  const icon = useMemo(
    () => (item.icon ? <Box sx={iconSx}>{item.icon}</Box> : null),
    [item.icon]
  );
  const isClickable = Boolean(item.href || item.to);

  return isClickable ? (
    <Link
      sx={linkSx(item.isActive ?? false, colors)}
      underline="none"
      {...(item.component && {component: item.component})}
      {...(item.to && {to: item.to})}
      {...(item.href && {href: item.href})}
    >
      {icon}
      <span>{item.label}</span>
    </Link>
  ) : (
    <Typography sx={typographySx(isLast, colors)}>
      {icon}
      <span>{item.label}</span>
    </Typography>
  );
});
BreadcrumbItemComponent.displayName = "BreadcrumbItemComponent";

export const CustomBreadcrumbs = memo<CustomBreadcrumbsProps>(
  ({
    items,
    sx = {},
    showHomeIcon = false,
    separator,
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    variant = "default",
  }) => {
    const processedItems = useMemo(() => {
      if (!items.length) return [];
      return showHomeIcon && !items[0].icon
        ? [{...items[0], icon: <Home size={16} />}, ...items.slice(1)]
        : items;
    }, [items, showHomeIcon]);

    const renderedItems = useMemo(
      () =>
        processedItems.map((item, index) => (
          <BreadcrumbItemComponent
            key={item.href || item.to || `${item.label}-${index}`}
            item={item}
            isLast={index === processedItems.length - 1}
            variant={variant}
          />
        )),
      [processedItems, variant]
    );

    if (!items.length) return null;

    return (
      <Box sx={{...containerSx, ...sx}}>
        <Breadcrumbs
          separator={<Separator icon={separator} />}
          sx={breadcrumbsSx}
          maxItems={maxItems}
          itemsBeforeCollapse={itemsBeforeCollapse}
          itemsAfterCollapse={itemsAfterCollapse}
        >
          {renderedItems}
        </Breadcrumbs>
      </Box>
    );
  }
);

CustomBreadcrumbs.displayName = "CustomBreadcrumbs";
export default CustomBreadcrumbs;
