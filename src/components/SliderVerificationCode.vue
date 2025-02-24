<script lang="ts" setup>
import _ from "lodash";

let shouldMove = false;

const emit = defineEmits(["isPassed"]);

const y = _.random(-100, 100);

onMounted(() => {
  const captcha = document.querySelector("#captcha") as HTMLElement;
  const handle = document.querySelector("#handle")!;
  const button = document.querySelector("#handle span")!;

  captcha.style.setProperty("--puzzle-offset-y", `${y}px`);

  button.addEventListener("mousedown", (_e) => {
    shouldMove = true;
  });

  window.addEventListener("mousemove", (e) => {
    if (shouldMove) {
      const offsetLeft = handle.getBoundingClientRect().left;
      const buttonWidth = button.getBoundingClientRect().width;

      captcha.style.setProperty(
        "--moved",
        `${e.clientX - offsetLeft - buttonWidth / 2}px`
      );
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (shouldMove) {
      const finalOffset = e.clientX - handle.getBoundingClientRect().left;

      if (finalOffset >= 430 && finalOffset <= 450) {
        // pass
        captcha.classList.add("passed");
        emit("isPassed", true);
      } else {
        // failed
        captcha.style.setProperty("--moved", "0px");
      }

      shouldMove = false;
    }
  });
});
</script>

<template>
  <div id="captcha">
    <div id="handle">
      <span></span>
    </div>
  </div>
</template>

<style scoped>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#captcha {
  --width: 400px;
  --height: 260px;
  --puzzle-width: 80px;
  --puzzle-height: 80px;
  --offset-left: var(--width) * -1;
  --moved: 0px;
  --puzzle-offset-x: 0px; /* 新增：拼图水平偏移 */
  --puzzle-offset-y: 0px; /* 新增：拼图垂直偏移 */

  display: block;
  width: var(--width);
  height: var(--height);
  border-radius: 4px;
  background-image: url(https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2700&q=80);
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}

#captcha::before,
#captcha::after {
  position: absolute;
  content: "";
  display: block;
  width: inherit;
  height: inherit;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  clip-path: inset(
    calc((var(--height) - var(--puzzle-height)) / 2 - var(--puzzle-offset-y)) /* 90px */
      calc(var(--puzzle-width) + var(--puzzle-offset-x)) /* 90px */
      calc((var(--height) - var(--puzzle-height)) / 2 + var(--puzzle-offset-y)) /* 90px */
      calc((var(--width) - var(--puzzle-width) * 2) - var(--puzzle-offset-x)) /* 230px */
  );
  -webkit-clip-path: inset(
    calc((var(--height) - var(--puzzle-height)) / 2 - var(--puzzle-offset-y)) /* 90px */
      calc(var(--puzzle-width) + var(--puzzle-offset-x)) /* 90px */
      calc((var(--height) - var(--puzzle-height)) / 2 + var(--puzzle-offset-y)) /* 90px */
      calc((var(--width) - var(--puzzle-width) * 2) - var(--puzzle-offset-x)) /* 230px */
  );
}

#captcha::after {
  transform: translatex(
    clamp(
      calc(var(--width) * -1),
      calc((var(--width) * -1) + var(--moved)),
      calc(var(--puzzle-width))
    )
  );
  transition: 0.25s all ease-in-out;
}

#captcha:active::after {
  transition: none;
}

#captcha::before {
  background-color: rgba(0, 0, 0, 0.6);
  background-blend-mode: multiply;
}

#handle {
  width: calc(var(--width) + var(--puzzle-width) * 2);
  height: 30px;
  border-radius: 18px;
  background-color: #eee;
  position: absolute;
  bottom: -50px;
  left: calc(var(--puzzle-width) * 2 * -1);
  box-shadow: inset 0px 0px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid #ccc;
}

#handle span {
  display: block;
  width: var(--puzzle-width);
  height: inherit;
  border-radius: inherit;
  background-color: #fff;
  box-shadow: inset 0px 0px 6px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.3);
  position: absolute;
  cursor: move;
  transform: translatex(
    clamp(0px, var(--moved), calc(var(--width) + var(--puzzle-width)))
  );

  transition: 0.25s all ease-in-out;
}

#captcha:active #handle span {
  transition: none;
}

#captcha.passed::before,
#captcha.passed::after,
#captcha.passed #handle {
  opacity: 0;
}
</style>
