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
        const subSlots = {
          title() {
            return sub.title;
          },
        };
        if (sub.children && sub.children.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          subSlots.default = () => {
            return buildMenus(sub.children);
          };
          slots.push(
            <el-submenu index={"index" + sub.index} v-slots={subSlots} />
          );
        } else {
          slots.push(
            <el-menu-item
              index={"index" + sub.index}
              v-slots={subSlots}
              onSelect={onSelect(sub)}
            />
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
      return <el-menu v-slots={slots} />;
    };
  },
};
