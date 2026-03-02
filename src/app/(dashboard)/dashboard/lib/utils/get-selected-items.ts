export const getSelectedItems = (preSelection: string[], currentSelection: string[]) => {
    if (preSelection.includes("all") && currentSelection.includes("all")) {
        return currentSelection.filter((key: string) => key !== "all");
    } else if (
      !preSelection.includes("all") &&
      currentSelection.includes("all")
    ) {
      return ["all"]
    } else {
        return currentSelection;
    }
}