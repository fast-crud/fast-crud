import menu from "../menu";
export default {
  name: "AsideMenu",
  setup(props, ctx) {
    let index = 0;
    function setIndex(menus) {
      for (let menu of menus) {
        menu.index = index;
        index++;
        if (menu.children && menu.children.length > 0) {
          setIndex(menu.children);
        }
      }
    }
    setIndex(menu.menus);

    function onSelect(item) {
      console.log("select", item);
    }

    const buildMenus = (children) => {
      const slots = [];
      for (let sub of children) {
        if (sub.children && sub.children.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const subSlots = {
            default: () => {
              return buildMenus(sub.children);
            },
          };
          slots.push(
            <a-sub-menu
              title={sub.title}
              key={"index" + sub.index}
              v-slots={subSlots}
            />
          );
        } else {
          slots.push(
            <a-menu-item key={"index" + sub.index} title={sub.title}>
              {sub.title}
            </a-menu-item>
          );
        }
      }
      return slots;
    };
    const slots = {
      default() {
        return buildMenus(menu.menus);
      },
    };
    return () => {
      return (
        <a-menu
          mode={"inline"}
          theme={"dark"}
          v-slots={slots}
          onClick={onSelect}
        />
      );
    };
  },
};
