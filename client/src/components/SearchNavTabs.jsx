import { Tabs } from "flowbite-react";
import FilteredUsers from "../components/FilteredUsers";
import FilteredPosts from "./FilteredPosts";

const customTheme = {
  base: "flex flex-col",
  tablist: {
    base: "flex text-center",
    variant: {
      fullWidth:
        "grid w-full grid-flow-col divide-x divide-light-secondaryText text-xl text-light-primaryText font-medium shadow dark:divide-dark-secondaryText dark:text-dark-primaryText ",
    },
    tabitem: {
      base: " flex items-center justify-center p-4 text-sm font-medium first:ml-0 first:rounded-tl-[10px] last:rounded-tr-[10px]",
      variant: {
        fullWidth: {
          active: {
            on: "active bg-light-background text-xl font-bold p-4 text-light-secondaryText dark:bg-dark-background dark:text-dark-secondaryText ",
            off: "bg-light-secondaryBackground text-light-primaryText hover:bg-light-accent dark:bg-dark-secondaryBackground dark:hover:bg-dark-accent dark:text-dark-primaryText",
          },
        },
      },
    },
  },
};

export default function SearchNavTabs() {
  return (
    <div className="min-h-full mt-[20px] bg-light-background dark:bg-dark-background rounded-[10px]">
      {/* Tabs component with custom theme */}
      <Tabs
        theme={customTheme}
        aria-label="Full width tabs"
        variant="fullWidth"
        className="w-full"
      >
        <Tabs.Item active title="Posts">
          <FilteredPosts />{" "}
        </Tabs.Item>
        <Tabs.Item title="Users">
          <FilteredUsers />{" "}
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
