// TODO: Use this as soon as the scheduler is published
// import { unstable_scheduleCallback } from "scheduler";
// export default unstable_scheduleCallback;

let scheduleCallback;
if (typeof requestAnimationFrame === "function") {
  scheduleCallback = callback => {
    Promise.resolve().then(() => {
      requestAnimationFrame(callback);
    });
  };
} else {
  scheduleCallback = callback => {
    callback();
  };
}

export default scheduleCallback;
