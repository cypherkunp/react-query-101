import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import "./App.css";

const posts = [
  { id: 1, title: "post1" },
  { id: 2, title: "post2" },
  { id: 3, title: "post3" },
  { id: 4, title: "post4" },
  { id: 5, title: "post5" },
];

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function App() {
  const [count, setCount] = useState(0);
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...posts]),
  });

  const newPostMutation = useMutation({
    mutationFn: (title) =>
      wait(1000).then(() => {
        posts.push({ id: crypto.randomUUID(), title });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (postQuery.isError) {
    return <pre>{JSON.stringify(postQuery.error)}</pre>;
  }

  return (
    <div className="App">
      {postQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button
        disable={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("Post 99")}
      >
        {newPostMutation.isLoading ? "Loading..." : "Add Post"}
      </button>
    </div>
  );
}

export default App;
