/* eslint-disable react/prop-types */
function Head({ username, name, profileImg }) {
  return (
    <div className="flex items-center justify-start gap-2">
      <img
        src={profileImg}
        className="h-14 rounded-full object-cover"
        alt="Logo"
      />
      <div className="flex flex-col">
        <p className="text-light-primaryText font-semibold text-xl dark:text-dark-primaryText line-clamp-1">
          {name}
        </p>
        <p className="text-light-secondaryText font-medium text-sm dark:text-dark-secondaryText line-clamp-1">
          @{username}
        </p>
      </div>
    </div>
  );
}

export default Head;
