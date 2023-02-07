import React, { useEffect } from "react";

function App({ url }) {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const progress = event.data;
      console.log(`Operation progress: ${progress}%`);
      // update the progress in the UI
    };
  }, []);

  return <div>Operation progress: </div>;
}

export default App;
