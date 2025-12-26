import { getGreeting } from "@/core/utils/dateHelper";

export const useGreeting = () => {
  const greeting = getGreeting();
  return greeting;
};