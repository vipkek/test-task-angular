export const formattedTime = (timeLeft: number): string => {
  const minutes: number = Math.floor(timeLeft / 60);
  const seconds: number = timeLeft % 60;
  return `${padNumber(minutes)}:${padNumber(seconds)}`;
};

export const padNumber = (num: number): string => {
  return num < 10 ? '0' + num : num.toString();
};
