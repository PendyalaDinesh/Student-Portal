// Week 1 — Utility helpers
import { formatDistanceToNow, format } from 'date-fns';
import { getCategoryById } from './constants';

export const timeAgo = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

export const formatDate = (date, fmt = 'MMM d, yyyy') =>
  date ? format(new Date(date), fmt) : '';

export const formatCurrency = (n) =>
  n != null ? `$${Number(n).toLocaleString()}` : '';

export const truncate = (str, n = 120) =>
  str?.length > n ? str.slice(0, n) + '...' : str;

// Extract the display price from a post based on its category
export const getPostPrice = (post) => {
  switch (post.category) {
    case 'housing':   return post.housing?.rent        ? `${formatCurrency(post.housing.rent)}/mo`  : null;
    case 'rides':     return post.rides?.costPerPerson  ? `${formatCurrency(post.rides.costPerPerson)}/person` : null;
    case 'jobs':      return post.jobs?.payRate         ? `${formatCurrency(post.jobs.payRate)}/hr`  : null;
    case 'community': return post.community?.price != null ? formatCurrency(post.community.price) : null;
    default: return null;
  }
};

export const getPostBadgeInfo = (post) => {
  switch (post.category) {
    case 'housing':   return post.housing?.type         ? `🏠 ${post.housing.type}` : null;
    case 'rides':     return (post.rides?.from && post.rides?.to) ? `${post.rides.from} → ${post.rides.to}` : null;
    case 'jobs':      return post.jobs?.jobType         ? `💼 ${post.jobs.jobType}` : null;
    case 'community': return post.community?.subCategory ? `📝 ${post.community.subCategory}` : null;
    default: return null;
  }
};

export const categoryColor = (id) => getCategoryById(id)?.color || 'gray';
