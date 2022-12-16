import { App, nextTick } from "vue";

export const FsDragModalDirective = {
  install(app: App) {
    app.directive("drag-modal", async (el, bindings, vnode) => {
      await nextTick();
      // @ts-ignore
      const { visible, destroyOnClose } = vnode.componentInstance;
      // 防止未定义 destroyOnClose 关闭弹窗时dom未被销毁，指令被重复调用
      if (!visible) return;
      const [modal] = el.getElementsByClassName("ant-modal");
      const [header] = el.getElementsByClassName("ant-modal-header");
      let left = 0;
      let top = 0;

      // 鼠标变成可移动的指示
      header.style.cursor = "move";

      // 未定义 destroyOnClose 时，dom未被销毁，关闭弹窗再次打开，弹窗会停留在上一次拖动的位置
      if (!destroyOnClose) {
        left = modal.left || 0;
        top = modal.top || 0;
      }
      // top 初始值为 offsetTop
      top = top || modal.offsetTop;
      header.onmousedown = (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        header.left = header.offsetLeft;
        header.top = header.offsetTop;
        el.onmousemove = (event) => {
          const endX = event.clientX;
          const endY = event.clientY;
          modal.left = header.left + (endX - startX) + left;
          modal.top = header.top + (endY - startY) + top;
          modal.style.left = modal.left + "px";
          modal.style.top = modal.top + "px";
        };
        el.onmouseup = () => {
          left = modal.left;
          top = modal.top;
          el.onmousemove = null;
          el.onmouseup = null;
          header.releaseCapture && header.releaseCapture();
        };
        header.setCapture && header.setCapture();
      };
    });
  }
};
