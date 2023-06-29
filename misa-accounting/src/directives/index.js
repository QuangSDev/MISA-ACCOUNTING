/**
 * Feature: Xử lý khi click ra bên ngoài
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */
export const clickOutside = {
  // Trước khi element được mount
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      // Nếu element bằng hoặc chứa target click và target click không có class được truyền trong argument thì thực hiện hàm truyền vào
      if (
        !(el == event.target || el.contains(event.target)) &&
        !event.target.classList.contains(binding.arg)
      ) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent, true);
  },
  unmounted: (el) => {
    document.removeEventListener("click", el.clickOutsideEvent, true);
  },
};

/**
 * Feature: Xử lý tab index
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */

// Khởi tạo biến chỉ mục để truy cập element đang được focus
var i = 0;
export const trapFocus = {
  beforeMount: (el) => {
    el.trapFocus = (event) => {
      // Tìm kiếm tất cả các element có tabindex trong form
      const focusables = [
        ...el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ];
      // Sắp xếp các element theo tabindex tăng dần
      focusables.sort((a, b) => a.tabIndex - b.tabIndex);

      // Nếu trong form có element đang được focus thì biến chỉ mục sẽ được gán cho vị trí element có tabindex sau
      if (
        focusables.findIndex((item) => item === document.activeElement) != -1
      ) {
        i = focusables.findIndex((item) => item === document.activeElement) + 1;
      }

      if (event.key === "Tab") {
        /**
         * Nếu focus tới element cuối của danh sách thì quay ngược lại element đầu tiên
         * còn không focus theo thứ tự tabindex
         */
        if (document.activeElement === focusables[focusables.length - 1]) {
          focusables[0].focus();
          i = 1;
        } else {
          focusables[i].focus();
          i++;
        }
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", el.trapFocus, true);
  },

  unmounted: (el) => {
    document.removeEventListener("keydown", el.trapFocus, true);
  },
};

/**
 * Feature: Tắt focus khi tab khỏi dropdown
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */
export const focusOutDropDown = {
  beforeMount: (el, binding) => {
    el.focusOutDropDown = (event) => {
      if (document.activeElement === el) {
        if (event.key == "Tab") {
          binding.value();
        }
      }
    };
    document.addEventListener("keydown", el.focusOutDropDown, true);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.focusOutDropDown, true);
  },
};

/**
 * Feature: Thêm một số phím tắt
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */
export const actionOnKeyPress = {
  beforeMount: (el, binding) => {
    el.actionOnKeyPress = (event) => {
      // Nếu có ctrl hoặc có shift hoặc cả 2
      if (
        event.ctrlKey == binding.value.isCtrl &&
        event.shiftKey == binding.value.isShift
      ) {
        if (binding.value.key === event.keyCode) {
          event.preventDefault();
          binding.value.fn();
          return;
        }
      }

      // Nếu không có ctrl và shift
      if (!binding.value.isCtrl && !binding.value.isShift) {
        if (event.keyCode === binding.value.key) {
          binding.value.fn();
          return;
        }
      }
    };
    document.addEventListener("keydown", el.actionOnKeyPress, true);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.actionOnKeyPress, true);
  },
};

/**
 * Feature: Hiển thị tooltip
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */
export const showTooltip = {
  beforeMount: (el, binding) => {
    el.showTooltip = (event) => {
      // Nếu element bằng target đang hover vào hoặc chứa target đang hover và target có class tooltip-container và có text truyền vào thì hiển thị tooltip
      if (
        (el == event.target || el.contains(event.target)) &&
        event.target.classList.contains("tooltip-container") &&
        binding.value
      ) {
        const tooltip = document.querySelector(".tooltip");
        tooltip.innerHTML = binding.value;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = 1;
        tooltip.style.top = event.y + 10 + "px";
        tooltip.style.left =
          event.x + (binding.arg == "left" ? -60 : 10) + "px";
      }
    };
    el.hideTooltip = (event) => {
      // Ẩn tooltip khi di ra ngoài
      if (
        !(el == event.target || el.contains(event.target)) ||
        !event.target.classList?.contains("tooltip-container")
      ) {
        const tooltip = document.querySelector(".tooltip");
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;
      }
    };
    document.addEventListener("mouseover", el.showTooltip, true);
    document.addEventListener("mousemove", el.showTooltip, true);
    document.addEventListener("mouseleave", el.hideTooltip, true);
  },
  // Dùng để thay đổi text khi chuyển ngôn ngữ
  updated: (el, binding) => {
    el.showTooltip = (event) => {
      if (
        (el == event.target || el.contains(event.target)) &&
        event.target.classList.contains("tooltip-container") &&
        binding.value
      ) {
        const tooltip = document.querySelector(".tooltip");
        tooltip.innerHTML = binding.value;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = 1;
        tooltip.style.top = event.y + 10 + "px";
        tooltip.style.left = event.x + 10 + "px";
      }
    };
    document.addEventListener("mouseover", el.showTooltip, true);
    document.addEventListener("mousemove", el.showTooltip, true);
  },
  unmounted: (el) => {
    document.removeEventListener("mouseover", el.showTooltip, true);
    document.addEventListener("mousemove", el.showTooltip, true);
    document.removeEventListener("mouseleave", el.hideTooltip, true);
  },
};

/**
 * Feature: Xử lý dropdown
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */
// Khởi tạo biến vị trí drop item đang được chọn hoặc hover item
let current = -1;
export const handleDropdownMenu = {
  mounted: (el, binding) => {
    current =
      binding.value.list
        ?.map((item) => item[binding.value.name])
        .findIndex(
          (arrayItem) =>
            arrayItem === binding.value.hoverItem?.[binding.value.name] ||
            arrayItem === binding.value.selectedValue
        ) >= 0
        ? binding.value.list
            ?.map((item) => item[binding.value.name])
            .findIndex(
              (arrayItem) =>
                arrayItem === binding.value.hoverItem?.[binding.value.name] ||
                arrayItem === binding.value.selectedValue
            )
        : current;

    el.handleDropdownMenu = (event) => {
      if (event.key == "ArrowDown" && current < binding.value.list.length - 1) {
        current += 1;
        binding.value.fn(binding.value.list[current]);
      }
      if (event.key == "ArrowUp" && current > 0) {
        current -= 1;
        binding.value.fn(binding.value.list[current]);
      }
      if (event.key == "Enter") {
        if (current >= 0) {
          binding.value.selectOption(binding.value.list[current]);
        }
      }
    };
    document.addEventListener("keydown", el.handleDropdownMenu, true);
  },

  updated: (el, binding) => {
    current = -1;
    current =
      binding.value.list
        ?.map((item) => item[binding.value.name])
        .findIndex(
          (arrayItem) =>
            arrayItem === binding.value.hoverItem?.[binding.value.name]
        ) >= 0
        ? binding.value.list
            ?.map((item) => item[binding.value.name])
            .findIndex(
              (arrayItem) =>
                arrayItem === binding.value.hoverItem?.[binding.value.name]
            )
        : current;
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.handleDropdownMenu, true);
  },
};

export const actionOnEnter = {
  beforeMount: (el) => {
    el.actionOnEnter = (event) => {
      if (event.key === "Enter") {
        if (el.contains(document.activeElement)) console.log("checking");
      }
    };
    document.addEventListener("keydown", el.actionOnEnter, true);
  },

  unmounted: (el) => {
    document.removeEventListener("keydown", el.actionOnEnter, true);
  },
};

/**
 * Feature: Reset tab index
 */
export const resetTabIndex = () => {
  // Body form
  const form = document.querySelector(".user-dialog__body");
  if (form) {
    const focusables = [
      ...form.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ];
    focusables.sort((a, b) => a.tabIndex - b.tabIndex);
    focusables[0].focus();
  }
};
