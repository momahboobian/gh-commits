import React from "react";

const ProfileProgressBar = ({ username, selectedWeek, commits }) => {
  // Calculate the percentage of commits relative to the criteria
  const criteria = 10; // Define the criteria here (e.g., 10 commits)
  const percentage = (commits / criteria) * 100;

  return (
    <div className="profile-progress-bar">
      <h2>{username}'s Profile</h2>
      <p>Selected Week: {selectedWeek}</p>

      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={commits}
          aria-valuemin="0"
          aria-valuemax={criteria} // Set the criteria as the maximum value
        >
          {commits} Commits
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;
