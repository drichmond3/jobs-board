export const getDisplayAge = (ageInHours: number): string => {
  const HOURS_PER_MONTH = 24 * 365 / 12;
  if (ageInHours < 24) {
    return `${ageInHours} Hours`;
  }
  else if (ageInHours < HOURS_PER_MONTH) {
    return `${Math.round(ageInHours / 24)} Days`;
  }
  else {
    return `${Math.round(ageInHours / HOURS_PER_MONTH)} Months`
  }
}