import { menus } from "../router/resources";
import router from "../router";
export default {
  name: "AsideMenu",
  setup(props, ctx) {
    let index = 0;
    function setIndex(menus) {
      for (let menu of menus) {
        menu.index = menu.path || "index-" + index;
        index++;
        if (menu.children && menu.children.length > 0) {
          setIndex(menu.children);
        }
      }
    }
    setIndex(menus);

    function onSelect(item) {
      console.log("select", item);
      router.push({ path: item });
    }

    const buildMenus = (children) => {
      const slots = [];
      for (let sub of children) {
        const subSlots = {
          title() {
            return sub.title;
          }
        };
        if (sub.children && sub.children.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          subSlots.default = () => {
            return buildMenus(sub.children);
          };
          slots.push(<el-submenu index={sub.index} v-slots={subSlots} />);
        } else {
          slots.push(<el-menu-item index={sub.index} v-slots={subSlots} />);
        }
      }
      return slots;
    };
    const slots = {
      default() {
        return buildMenus(menus);
      }
    };
    return () => {
      return <el-menu v-slots={slots} onSelect={onSelect} />;
    };
  }
};
