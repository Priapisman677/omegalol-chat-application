

// import { useEffect, useRef } from "react";

// export function useAutoScroll(triggerDeps: any[] = []) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   // Remember if we should auto-scroll
//   const shouldAutoScroll = useRef(true);

//   // Track user scrolling
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     const onScroll = () => {
//       // if we're within 10px of the bottom, allow auto-scroll
//       shouldAutoScroll.current =
//         el.scrollHeight - (el.scrollTop + el.clientHeight) < 10;
//     };

//     el.addEventListener("scroll", onScroll);
//     // Initialize the flag (in case messages pre-fill)
//     onScroll();

//     return () => el.removeEventListener("scroll", onScroll);
//   }, []);

//   // When messages change, scroll if allowed
//   useEffect(() => {
//   const el = containerRef.current;
//   if (!el) return;

//   if (!shouldAutoScroll.current) return;

//   const timeout = setTimeout(() => {
//     el.scrollTop = el.scrollHeight;
//   }, 50); //* wait for DOM (including image heights) to settle

//   return () => clearTimeout(timeout);
// }, triggerDeps);

//   return containerRef;
// }



import { useEffect, useRef } from "react";

export function useAutoScroll(triggerDeps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tracks if user is near the bottom
  const shouldAutoScroll = useRef(true);
  // Allows one-time scroll when component mounts
  const firstLoad = useRef(true);

  // Listen to scroll events
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
      shouldAutoScroll.current = distanceFromBottom < 10;
    };

    el.addEventListener("scroll", onScroll);
    onScroll(); // initialize

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Handle scroll trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Only scroll if user is at bottom OR just loaded
    if (!shouldAutoScroll.current && !firstLoad.current) return;

    const timeout = setTimeout(() => {
      el.scrollTop = el.scrollHeight;
      firstLoad.current = false;
    }, 50); //* let DOM/layout/images settle after 50ms

    return () => clearTimeout(timeout);
  }, triggerDeps);

  return containerRef;
}
