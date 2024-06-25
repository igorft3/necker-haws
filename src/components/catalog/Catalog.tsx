import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./Catalog.module.css"; // Correctly importing CSS module

type Story = {
  id: number;
  title: string;
  by: string;
  score: number;
  url: string;
};

export default function Catalog() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState<number>(0);
  const [sortType, setSortType] = useState<string>("topstories");

  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/${sortType}.json?print=pretty`
      );
      const storyIds = await response.json();
      const paginationIds = storyIds.slice(page * 20, (page + 1) * 20);

      const storyPromises = paginationIds.map(async (id: number) => {
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        );
        return res.json();
      });

      const stories = await Promise.all(storyPromises);
      setStories((prev) => [...prev, ...stories]);
    } catch (error) {
      console.error("Ошибка получения данных", error);
    }
  }, [page, sortType]);

  useEffect(() => {
    fetchStories();
    const interval = setInterval(() => {
      setPage(0);
      setStories([]);
      fetchStories();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStories]);

  const handleSortChange = (type: string) => {
    setSortType(type);
    setPage(0);
    setStories([]);
  };

  const handleLoad = () => {
    setPage((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setPage(0);
    setStories([]);
    fetchStories();
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button onClick={() => handleSortChange("beststories")}>
          Best Stories
        </button>
        <button onClick={() => handleSortChange("newstories")}>
          New Stories
        </button>
        <button onClick={() => handleSortChange("topstories")}>
          Top Stories
        </button>
      </div>
      <button onClick={handleRefresh}>Refresh</button>
      <ul>
        {stories.map((story, index) => (
          <li key={story.id + index}>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
            <p>by: {story.by}</p>
            <p>score: {story.score}</p>
            <Link to={`/news/${story.id}`}>Comments</Link>
          </li>
        ))}
      </ul>
      <button onClick={handleLoad}>Load more</button>
    </div>
  );
}
