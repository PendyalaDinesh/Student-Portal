// User avatar with initials fallback
export default function Avatar({ user, size = 40, className = '' }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover border-2 border-gray-700 flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className={`rounded-full bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center
        justify-center text-white font-bold flex-shrink-0 select-none ${className}`}
    >
      {initials}
    </div>
  );
}
