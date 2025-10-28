import {Box, Breadcrumbs, Link, Typography} from "@mui/material";
import {ChevronRight, Home} from "lucide-react";
import type React from "react";
import {memo, useMemo} from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  component?: React.ElementType;
  to?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  sx?: any;
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  variant?: "default" | "contrast" | "subtle";
}

const containerStyles = {
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

const breadcrumbsStyles = {
  "& .MuiBreadcrumbs-li": {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
  },
};

const getColorScheme = (variant: "default" | "contrast" | "subtle") => {
  switch (variant) {
    case "contrast":
      return {
        linkColor: "#0f172a",
        linkHoverColor: "#1e293b",
        activeColor: "#0369a1",
        inactiveColor: "#64748b",
        underlineColor: "#0369a1",
      };
    case "subtle":
      return {
        linkColor: "#64748b",
        linkHoverColor: "#475569",
        activeColor: "#334155",
        inactiveColor: "#94a3b8",
        underlineColor: "#64748b",
      };
    default:
      return {
        linkColor: "#2563eb",
        linkHoverColor: "#1d4ed8",
        activeColor: "#1e40af",
        inactiveColor: "#64748b",
        underlineColor: "#3b82f6",
      };
  }
};

const getLinkStyles = (
  isActive?: boolean,
  variant: "default" | "contrast" | "subtle" = "default"
) => {
  const colors = getColorScheme(variant);

  return {
    "fontSize": "0.9375rem",
    "fontWeight": isActive ? 600 : 500,
    "color": isActive ? colors.activeColor : colors.linkColor,
    "textDecoration": "none",
    "transition": "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "position": "relative",
    "cursor": "pointer",
    "display": "flex",
    "alignItems": "center",
    "gap": "0.375rem",
    "padding": "0.25rem 0",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: 0,
      width: isActive ? "100%" : 0,
      height: "2px",
      backgroundColor: colors.underlineColor,
      borderRadius: "2px",
      transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "&:hover": {
      "color": colors.linkHoverColor,
      "transform": "translateY(-1px)",
      "&::after": {
        width: "100%",
      },
    },
    "&:active": {
      transform: "translateY(0)",
    },
  };
};

const getTypographyStyles = (
  isLast: boolean,
  variant: "default" | "contrast" | "subtle" = "default"
) => {
  const colors = getColorScheme(variant);

  return {
    fontSize: "0.9375rem",
    fontWeight: isLast ? 600 : 500,
    color: isLast ? colors.activeColor : colors.inactiveColor,
    transition: "color 0.3s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.25rem 0",
  };
};

const Separator = memo<{icon?: React.ReactNode}>(({icon}) => {
  if (icon) return <>{icon}</>;

  return (
    <ChevronRight
      size={16}
      strokeWidth={2}
      style={{
        opacity: 0.4,
        transition: "opacity 0.2s ease-in-out",
        color: "#64748b",
      }}
    />
  );
});
Separator.displayName = "Separator";

const BreadcrumbItemComponent = memo<{
  item: BreadcrumbItem;
  isLast: boolean;
  showIcon?: boolean;
  variant?: "default" | "contrast" | "subtle";
}>(({item, isLast, showIcon, variant = "default"}) => {
  const icon =
    showIcon && item.icon ? (
      <Box
        sx={{
          "display": "flex",
          "alignItems": "center",
          "fontSize": "1rem",
          "opacity": 0.85,
          "transition": "opacity 0.2s ease-in-out",
          ".MuiLink-root:hover &, .MuiTypography-root:hover &": {
            opacity: 1,
          },
        }}
      >
        {item.icon}
      </Box>
    ) : null;

  if (item.href || item.to) {
    const linkProps: any = {
      sx: getLinkStyles(item.isActive, variant),
      ...(item.component && {component: item.component}),
      ...(item.to && {to: item.to}),
      ...(item.href && {href: item.href}),
      underline: "none",
    };

    return (
      <Link {...linkProps}>
        {icon}
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Typography sx={getTypographyStyles(isLast, variant)}>
      {icon}
      <span>{item.label}</span>
    </Typography>
  );
});
BreadcrumbItemComponent.displayName = "BreadcrumbItemComponent";

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = memo(
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
    const combinedStyles = useMemo(() => ({...containerStyles, ...sx}), [sx]);

    const processedItems = useMemo(() => {
      if (!items.length) return [];

      if (showHomeIcon && !items[0].icon) {
        return [{...items[0], icon: <Home size={16} />}, ...items.slice(1)];
      }

      return items;
    }, [items, showHomeIcon]);

    const renderedItems = useMemo(
      () =>
        processedItems.map((item, index) => (
          <BreadcrumbItemComponent
            key={item.href || item.to || `${item.label}-${index}`}
            item={item}
            isLast={index === processedItems.length - 1}
            showIcon={!!item.icon}
            variant={variant}
          />
        )),
      [processedItems, variant]
    );

    return (
      <Box sx={combinedStyles}>
        <Breadcrumbs
          separator={<Separator icon={separator} />}
          sx={breadcrumbsStyles}
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
