import router from "../../router";
import { useRoute } from "vue-router";
import { ref } from "vue";
import getEachDeep from "deepdash-es/getEachDeep";
import _ from "lodash-es";
const eachDeep = getEachDeep(_);
export default {
  name: "FsMenu",
  props: {
    menus: {}
  },
  setup(props, ctx) {
    function onSelect(item) {
      console.log("select", item);
      if (item.key.startsWith("http://") || item.key.startsWith("https://")) {
        window.open(item.key);
        return;
      }
      router.push(item.key);
    }

    const buildMenus = (children) => {
      const slots = [];
      if (children == null) {
        return slots;
      }
      for (let sub of children) {
        if (sub.children && sub.children.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const subSlots = {
            default: () => {
              return buildMenus(sub.children);
            }
          };
          slots.push(<a-sub-menu title={sub.title} key={"index" + sub.index} v-slots={subSlots} />);
        } else {
          slots.push(
            <a-menu-item key={sub.path} title={sub.title}>
              {sub.title}
            </a-menu-item>
          );
        }
      }
      return slots;
    };
    const slots = {
      default() {
        return buildMenus(props.menus);
      }
    };
    const selectedKeys = ref([]);
    const openKeys = ref([]);
    const route = useRoute();
    if (route.fullPath) {
      selectedKeys.value = [route.fullPath];
    }

    function openSelectedParents(fullPath) {
      if (props.menus == null) {
        return;
      }
      eachDeep(props.menus, (value, key, parent, context) => {
        if (value.path === fullPath) {
          _.forEach(context.parents, (item) => {
            if (item.value instanceof Array) {
              return;
            }
            openKeys.value.push("index" + item.value.index);
          });
        }
      });
    }
    openSelectedParents(route.fullPath);
    return () => {
      return (
        <a-menu
          mode={"inline"}
          theme={"dark"}
          v-slots={slots}
          onClick={onSelect}
          v-models={[
            [openKeys.value, "openKeys"],
            [selectedKeys.value, "selectedKeys"]
          ]}
        />
      );
    };
  }
};
