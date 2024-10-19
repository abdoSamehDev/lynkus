export const modalTheme = {
  root: {
    base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    show: {
      on: "flex bg-gray-900 bg-opacity-80 ",
      off: "hidden",
    },
    sizes: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
    },
    positions: {
      center: "items-center justify-center",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner:
      "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
  },
  body: {
    base: "flex-1 overflow-auto p-6",
    popup: "pt-0",
  },
  header: {
    base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600",
    popup: "border-b-0 p-2",
    title: "text-xl font-medium text-gray-900 dark:text-white",
    close: {
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-button-default hover:bg-button-hover hover:text-gray-900 ",
      icon: "size-5",
    },
  },
  footer: {
    base: "flex items-center space-x-2 rounded-b border-light-secondaryText p-6 dark:border-dark-secondaryText",
    popup: "border-t",
  },
};

export const textInputTheme = {
  field: {
    input: {
      colors: {
        gray: "border-button-default bg-light-secondaryBackground text-light-primaryText focus:border-button-default focus:ring-light-secondaryText dark:border-button-default dark:bg-dark-secondaryBackground dark:text-dark-primaryText dark:placeholder-gray-400 dark:focus:border-button-default dark:focus:ring-dark-secondaryText",
      },
    },
  },
};

export const textAreaTheme = {
  colors: {
    gray: "border-button-default bg-light-secondaryBackground text-light-primaryText focus:border-button-default focus:ring-light-secondaryText dark:border-button-default dark:bg-dark-secondaryBackground dark:text-dark-primaryText dark:placeholder-gray-400 dark:focus:border-button-default dark:focus:ring-dark-secondaryText",
  },
};

export const tabTheme = {
  base: "flex flex-col gap-2",
  tablist: {
    base: "flex text-center",
    variant: {
      fullWidth:
        "grid w-full grid-flow-col divide-x divide-light-secondaryText text-xl text-light-primaryText font-medium shadow dark:divide-dark-secondaryText dark:text-dark-primaryText ",
    },
    tabitem: {
      base: " flex items-center justify-center p-4 text-sm font-medium first:ml-0 ",
      variant: {
        fullWidth: {
          active: {
            on: "active bg-light-secondaryBackground text-xl font-bold p-4 text-light-secondaryText dark:bg-dark-secondaryBackground dark:text-dark-secondaryText ",
            off: " bg-light-background text-light-primaryText hover:bg-light-accent dark:bg-dark-background dark:hover:bg-dark-accent dark:text-dark-primaryText",
          },
        },
      },
    },
  },
};

export const spinnerTheme = {
  base: "inline animate-spin text-gray-200",
  color: {
    failure: "fill-red-600",
    gray: "fill-gray-600",
    info: "fill-cyan-600",
    pink: "fill-pink-600",
    purple: "fill-purple-600",
    success: "fill-green-500",
    warning: "fill-yellow-400",
  },
  light: {
    off: {
      base: "dark:text-gray-600",
      color: {
        failure: "",
        gray: "dark:fill-gray-300",
        info: "",
        pink: "",
        purple: "",
        success: "",
        warning: "",
      },
    },
    on: {
      base: "",
      color: {
        failure: "",
        gray: "",
        info: "",
        pink: "",
        purple: "",
        success: "",
        warning: "",
      },
    },
  },
  size: {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  },
};

export const alertTheme = {
  base: "flex flex-col gap-2 p-4 text-sm",
  borderAccent: "border-t-4",
  closeButton: {
    base: "-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 focus:ring-2",
    icon: "size-5",
    color: {
      success:
        "bg-transparent text-button-default hover:bg-light-background focus:ring-0 dark:hover:bg-dark-background",
    },
  },
  color: {
    success:
      "border-green-500 bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800",
  },
  icon: "mr-3 inline size-6 fill-light-secondaryText dark:fill-dark-secondaryText flex-shrink-0",
  rounded: "rounded-lg",
  wrapper: "flex items-center",
};
