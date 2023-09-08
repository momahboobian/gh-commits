import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

const ProfileCard = ({ username, selectedWeek, commits }) => {
  // Define a function to choose the appropriate icon based on the number of commits
  const chooseIcon = (commits) => {
    if (commits >= 10) {
      return <FontAwesomeIcon icon={faStar} />;
    } else if (commits >= 5) {
      return <FontAwesomeIcon icon={faHeart} />;
    } else {
      return <FontAwesomeIcon icon={faComment} />;
    }
  };

  return (
    <div className="profile-card">
      <h2>{username}'s Profile</h2>
      <p>Selected Week: {selectedWeek}</p>
      <div className="contributions">
        <div className="contribution">
          {chooseIcon(commits)} Commits: {commits}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
