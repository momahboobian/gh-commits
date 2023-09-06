import React, { useEffect, useState } from "react";
import axios from "axios";
import { startOfWeek, endOfWeek, format } from "date-fns";

function Commits() {
  const [commitData, setCommitData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Calculate the start of the calendar week (Sunday)
    const startOfCalendarWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

    // Calculate the end of the calendar week (Saturday)
    const endOfCalendarWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

    // Format the dates as YYYY-MM-DD for the GitHub API query
    const formattedStartOfWeek = format(startOfCalendarWeek, "yyyy-MM-dd");
    const formattedEndOfWeek = format(endOfCalendarWeek, "yyyy-MM-dd");

    // Construct the GitHub API query
    const githubApiQuery = `https://api.github.com/search/commits?q=author:momahboobian+committer-date:${formattedStartOfWeek}..${formattedEndOfWeek}`;

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
  }, []);

  return (
    <div className="App">
      <h1>GitHub Commit Data for the Current Calendar Week</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {commitData.map((commit, index) => (
            <li key={index}>{commit.commit.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Commits;
