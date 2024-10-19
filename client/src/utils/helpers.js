export function capitalizeName(name) {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(" ");
  }
}

const BASE_URL = "https://lynkus-3.onrender.com";

export const formatImageUrl = (imagePath, type = "headerImg") => {
  if (!imagePath) return ""; // Return empty string if no image path provided

  // Check if the imagePath is already a full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's just a filename, construct the full URL
  return `${BASE_URL}/users/${type}/${imagePath}`;
};
