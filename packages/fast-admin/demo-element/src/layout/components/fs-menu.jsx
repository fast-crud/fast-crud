import { useRouter, useRoute } from "vue-router";

export default {
  name: "FsMenu",
  props: {
    menus: {}
  },
  setup(props, ctx) {
    const router = useRouter();
    function onSelect(item) {
      console.log("select", item);
      if (!item) {
        return;
      }
      if (item.startsWith("http://") || item.startsWith("https://")) {
        window.open(item);
        return;
      }
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
        return buildMenus(props.menus);
      }
    };

    const route = useRoute();
    return () => {
      return <el-menu v-slots={slots} onSelect={onSelect} defaultActive={route.fullPath} />;
    };
  }
};
