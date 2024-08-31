import React, { useState, useEffect } from 'react';
import { getChannels } from '../services/api';

// Channels component
// This component fetches and displays a list of channels
function Channels({ handleChannelSelect }) {
  // State to hold the fetched channels
  const [channels, setChannels] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Handling any fetch errors
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch channels data
    const fetchChannels = async () => {
      try {
        const fetchedChannels = await getChannels();
        setChannels(fetchedChannels);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Conditionals for loading, errors, or no data
  if (loading) return <p>Loading channels...</p>;
  if (error) return <p>Error loading channels: {error.message}</p>;
  if (channels.length === 0) return <p>No channels available</p>;

  return (
    <div className="channel-list">
      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel)}>
            # {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Channels;

// Note: This component now uses the getChannels function from api.js.
// When you're ready to integrate with the JHipster backend:
// 1. Update the api.js file to use actual API calls instead of mock data.
// 2. Ensure that any authentication or error handling is implemented in api.js.
// 3. The component will automatically use the real API data once api.js is updated.