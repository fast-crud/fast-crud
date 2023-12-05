import { useMerge } from "../use-merge";

describe("useMerge", function () {
  it("#cloneDeep", async function () {
    const { cloneDeep, UnMergeable } = useMerge();
    class TestDict extends UnMergeable {
      constructor() {
        super();
        this.name = "test";
      }
    }
    const target = new TestDict();
    target.cloneable = false;
    const cloned = cloneDeep(target);
    expect(target).not.toBe(cloned);

    const target2 = { target };
    const cloned2 = cloneDeep(target2);
    expect(cloned2.target).not.toBe(target2.target);

    target.cloneable = false;
    const cloned3 = cloneDeep(target);
    expect(target).toBe(cloned3);

    const target4 = { target };
    const cloned4 = cloneDeep(target4);
    expect(cloned4.target).toBe(target4.target);
  });

  it("#merge", async function () {
    const { merge, UnMergeable } = useMerge();
    class TestDict extends UnMergeable {
      constructor() {
        super();
        this.name = "test";
      }
    }
    const target = new TestDict();
    const cloned = merge({}, target, undefined);
    expect(target).toBe(cloned);

    const target2 = { target };
    const cloned2 = merge({}, target2, undefined);
    expect(cloned2.target).toBe(target2.target);

    const cloned3 = merge({}, target2, { target: 1 });
    expect(cloned3.target).not.toBe(target2.target);
  });
});
