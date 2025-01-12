import { nextTick } from "vue";
import { useUi } from "./use-ui";
export type DragModalOptions = { getModal: () => HTMLElement };

async function dragModalForAntdv(opts: DragModalOptions) {
  await nextTick();
  const dialogEl = opts.getModal();
  if (dialogEl == null) {
    return;
  }
  const dialogHeaderEl = <HTMLElement>dialogEl.querySelector(".ant-modal-header");
  if (dialogHeaderEl == null) {
    return;
  }
  // const dragDom = <HTMLElement>dialogEl.querySelector(".ant-modal");
  // const styDom = <HTMLElement>dialogEl.querySelector(".ant-modal");
  const dragDom = dialogEl;
  const styDom = dialogEl;
  const sty = styDom.style;
  dialogHeaderEl.style.cursor = "move";
  dialogHeaderEl.onmousedown = (e) => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const X = e.clientX; //鼠标位置
    const Y = e.clientY;
    //$(dragDom).css({ margin: '0px', left: disX, top: disY })
    dragDom.style.transform = "translate(0px, 0px)";
    // 获取到的值带px 正则匹配替换
    let styL: any, styT: any;

    //注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (sty.left.includes("%")) {
      styL = +document.body.clientWidth * (+sty.left.replace(/%/g, "") / 100);
      styT = +document.body.clientHeight * (+sty.top.replace(/%/g, "") / 100);
    } else {
      styL = +sty.left.replace(/px/g, "");
      styT = +sty.top.replace(/px/g, "");
      styT = styT === 0 ? 100 : styT;
    }
    document.onmousemove = function (e) {
      // 通过事件委托，计算移动的距离
      const l = e.clientX - X;
      const t = e.clientY - Y;
      // console.log(l, t, styL, styT);
      // 移动当前元素
      dragDom.style.left = `${l + styL}px`;
      dragDom.style.top = `${t + styT}px`;
    };

    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}
async function dragModalForNaive(opts: DragModalOptions) {
  await nextTick();
  const dialogEl = opts.getModal();
  if (dialogEl == null) {
    return;
  }
  const dialogHeaderEl = <HTMLElement>dialogEl.querySelector(".n-card-header");
  if (dialogHeaderEl == null) {
    return;
  }
  // const dragDom = <HTMLElement>dialogEl.querySelector(".ant-modal");
  // const styDom = <HTMLElement>dialogEl.querySelector(".ant-modal");
  const dragDom = dialogEl;
  const styDom = dialogEl;
  const sty = styDom.style;
  dialogHeaderEl.style.cursor = "move";
  dialogHeaderEl.onmousedown = (e) => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const X = e.clientX; //鼠标位置
    const Y = e.clientY;
    //$(dragDom).css({ margin: '0px', left: disX, top: disY })
    dragDom.style.transform = "translate(0px, 0px)";
    // 获取到的值带px 正则匹配替换
    let styL: any, styT: any;
    //注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (sty.left.includes("%")) {
      styL = +document.body.clientWidth * (+sty.left.replace(/%/g, "") / 100);
      styT = +document.body.clientHeight * (+sty.top.replace(/%/g, "") / 100);
    } else {
      styL = +sty.left.replace(/px/g, "");
      styT = +sty.top.replace(/px/g, "");
    }
    // console.log("start :", styL, styT);

    document.onmousemove = async function (e) {
      if (e.clientX == 0 && e.clientY == 0) {
        return;
      }
      // 通过事件委托，计算移动的距离
      const l = e.clientX - X;
      const t = e.clientY - Y;
      // 移动当前元素
      dragDom.style.left = `${l + styL}px`;
      dragDom.style.top = `${t + styT}px`;
    };
    // @ts-ignore
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}
async function dragModal(opts: DragModalOptions) {
  const { ui } = useUi();
  if (ui.type === "antdv") {
    await dragModalForAntdv(opts);
  } else if (ui.type === "element") {
    // await dragModalForElement(opts);
  } else {
    await dragModalForNaive(opts);
  }
}

export function useDrag() {
  return {
    dragModal
  };
}
