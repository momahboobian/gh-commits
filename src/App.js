import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import { startOfWeek, endOfWeek, format, subMonths } from "date-fns";
import ProfileCard from "./ProfileCard";

function App() {
  const [username, setUsername] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [commitData, setCommitData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
  };

  const fetchCommits = () => {
    if (!username || !selectedWeek) {
      return;
    }

    // Parse the selected week as a Date object
    const selectedWeekDate = new Date(selectedWeek);

    // Calculate the start of the selected week (Sunday)
    const startOfSelectedWeek = startOfWeek(selectedWeekDate, {
      weekStartsOn: 0,
    });

    // Calculate the end of the selected week (Saturday)
    const endOfSelectedWeek = endOfWeek(selectedWeekDate, { weekStartsOn: 0 });

    // Format the dates as YYYY-MM-DD for the GitHub API query
    const formattedStartOfWeek = format(startOfSelectedWeek, "yyyy-MM-dd");
    const formattedEndOfWeek = format(endOfSelectedWeek, "yyyy-MM-dd");

    // Construct the GitHub API query with the entered username and selected week
    const githubApiQuery = `https://api.github.com/search/commits?q=author:${username}+committer-date:${formattedStartOfWeek}..${formattedEndOfWeek}`;

    // Fetch GitHub commit data
    setLoading(true);
    axios
      .get(githubApiQuery)
      .then((response) => {
        setCommitData(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching commit data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Generate a list of the past 3 months' weeks
  const generateWeekOptions = () => {
    const options = new Set(); // Use a Set to store unique dates
    const currentDate = new Date();

    // Iterate through the past 3 months
    for (let i = 0; i < 3; i++) {
      const monthAgo = subMonths(currentDate, i);
      let currentWeek = startOfWeek(monthAgo, { weekStartsOn: 0 });

      while (currentWeek <= currentDate) {
        options.add(format(currentWeek, "yyyy-MM-dd")); // Add to the Set
        currentWeek = new Date(currentWeek);
        currentWeek.setDate(currentWeek.getDate() + 7);
      }
    }

    const sortedOptions = Array.from(options).sort(); // Sort the dates

    return sortedOptions;
  };

  const weekOptions = generateWeekOptions();

  // Check if the user's commits meet the criteria
  const meetsCriteria = commitData.length >= 10;

  return (
    <div className="App">
      <ProfileCard
        username={username}
        selectedWeek={selectedWeek}
        commits={commitData.length} // Pass the actual number of commits
      />

      <h1>GitHub Commit Data for a Specific Week</h1>
      <div>
        <label htmlFor="username">Enter GitHub Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label htmlFor="week">Select a Week:</label>
        <select id="week" value={selectedWeek} onChange={handleWeekChange}>
          <option value="">Select a Week</option>
          {weekOptions.map((week, index) => (
            <option key={index} value={week}>
              {format(new Date(week), "MMM dd, yyyy")} -{" "}
              {format(
                endOfWeek(new Date(week), { weekStartsOn: 0 }),
                "MMM dd, yyyy"
              )}
            </option>
          ))}
        </select>
        <button onClick={fetchCommits}>Search Commits</button>
      </div>
      <p>Total Commits This Week: {commitData.length}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {meetsCriteria ? (
            <p>Commits meet the criteria (at least 10 commits per week).</p>
          ) : (
            <p>
              Commits do not meet the criteria (less than 10 commits per week).
            </p>
          )}
          <ul>
            {commitData.map((commit, index) => (
              <li key={index}>
                <strong>
                  {format(
                    new Date(commit.commit.author.date),
                    "MMM dd, yyyy HH:mm:ss"
                  )}
                </strong>
                : {commit.commit.message}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
