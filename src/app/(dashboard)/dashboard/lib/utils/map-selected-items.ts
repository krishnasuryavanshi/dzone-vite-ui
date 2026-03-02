export const mapSelectedItems = (
  selectedItems: string[],
  availableItems: { key: string }[]
) => {
  if (selectedItems.includes("all")) {
    return availableItems
      .filter((item) => item.key !== "all")
      .map((item) => item.key);
  } else {
    return selectedItems;
  }
};
