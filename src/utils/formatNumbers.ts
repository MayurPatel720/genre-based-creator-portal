
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatViews = (views: number): string => {
  return formatNumber(views);
};

export const formatFollowers = (followers: number): string => {
  return formatNumber(followers);
};
