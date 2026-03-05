// Week 1 — App-wide constants from PPT slide 2 & 4
export const CATEGORIES = [
  {
    id: 'housing',
    label: 'Housing',
    icon: '🏠',
    color: 'blue',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    badgeBg: 'bg-blue-900/50',
    description: 'Find rooms, apartments & houses near your campus',
  },
  {
    id: 'rides',
    label: 'Rides',
    icon: '🚗',
    color: 'green',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    badgeBg: 'bg-emerald-900/50',
    description: 'Share rides and split travel costs with students',
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: '💼',
    color: 'amber',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    badgeBg: 'bg-amber-900/50',
    description: 'On-campus and student-friendly job opportunities',
  },
  {
    id: 'community',
    label: 'Community',
    icon: '📝',
    color: 'purple',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    badgeBg: 'bg-purple-900/50',
    description: 'Buy/sell, events, Q&A and general posts',
  },
];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);

export const COMMUNITY_SUB_CATEGORIES = ['Buy/Sell', 'Events', 'Q&A', 'General'];
export const JOB_TYPES    = ['On-campus', 'Off-campus', 'Remote', 'Hybrid'];
export const HOUSING_TYPES = ['Room', 'Apartment', 'House', 'Studio', 'Other'];
export const CONDITIONS    = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
export const SORT_OPTIONS  = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'oldest',    label: 'Oldest First' },
  { value: 'popular',   label: 'Most Popular' },
  { value: 'priceLow',  label: 'Price: Low → High' },
  { value: 'priceHigh', label: 'Price: High → Low' },
];
