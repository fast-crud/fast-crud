import { Slot, Slots } from "vue";
import { forEach } from "lodash-es";

export type CrudSlots = Record<string, Slot | undefined>;

const layoutSlotNames: Record<string, string> = {
  default: "default",
  "header-top": "headerTop",
  headerTop: "headerTop",
  "header-bottom": "headerBottom",
  headerBottom: "headerBottom",
  "header-middle": "headerMiddle",
  headerMiddle: "headerMiddle",
  "actionbar-left": "actionbarLeft",
  actionbarLeft: "actionbarLeft",
  "actionbar-right": "actionbarRight",
  actionbarRight: "actionbarRight",
  "toolbar-left": "toolbarLeft",
  toolbarLeft: "toolbarLeft",
  "toolbar-right": "toolbarRight",
  toolbarRight: "toolbarRight",
  "pagination-left": "paginationLeft",
  paginationLeft: "paginationLeft",
  "pagination-right": "paginationRight",
  paginationRight: "paginationRight",
  "footer-top": "footerTop",
  footerTop: "footerTop",
  "footer-bottom": "footerBottom",
  footerBottom: "footerBottom"
};

function normalizeCrudSlots(slots: CrudSlots | Slots | undefined): Slots {
  const normalizedSlots: any = {};
  forEach(slots, (value, key) => {
    if (value == null) {
      return;
    }
    const normalizedKey = layoutSlotNames[key] || key;
    if (key === normalizedKey || normalizedSlots[normalizedKey] == null) {
      normalizedSlots[normalizedKey] = value;
    }
  });
  return normalizedSlots;
}

export function mergeCrudSlots(configuredSlots: CrudSlots | undefined, templateSlots: Slots): Slots {
  return {
    ...normalizeCrudSlots(configuredSlots),
    ...normalizeCrudSlots(templateSlots)
  };
}

export function filterCrudSlots(slots: Slots, keyPrefix: string): Slots {
  const filteredSlots: any = {};
  forEach(slots, (value, key) => {
    if (key.startsWith(keyPrefix)) {
      filteredSlots[key] = value;
    }
  });
  return filteredSlots;
}
