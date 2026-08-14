import { Slot, Slots } from "vue";
import { filterCrudSlots, mergeCrudSlots } from "../src/components/fs-crud-slots";

describe("fs-crud slots", () => {
  it("normalizes configured layout slot names to camel case", () => {
    const configuredSlot: Slot = () => "configured" as any;

    expect(mergeCrudSlots({ "pagination-left": configuredSlot }, {}).paginationLeft).toBe(configuredSlot);
  });

  it("prefers an explicitly declared template slot", () => {
    const configuredSlot: Slot = () => "configured" as any;
    const templateSlot: Slot = () => "template" as any;

    expect(mergeCrudSlots({ paginationLeft: configuredSlot }, { "pagination-left": templateSlot }).paginationLeft).toBe(
      templateSlot
    );
  });

  it("prefers camel case when both configured formats are provided", () => {
    const dashedSlot: Slot = () => "dashed" as any;
    const camelSlot: Slot = () => "camel" as any;

    expect(mergeCrudSlots({ "pagination-left": dashedSlot, paginationLeft: camelSlot }, {}).paginationLeft).toBe(
      camelSlot
    );
  });

  it("keeps only slots for the requested child component prefix", () => {
    const cellSlot: Slot = () => "cell" as any;
    const formSlot: Slot = () => "form" as any;
    const slots: Slots = { cell_name: cellSlot, form_name: formSlot };

    expect(filterCrudSlots(slots, "cell")).toEqual({ cell_name: cellSlot });
  });
});
