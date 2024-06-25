import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import styles from "./Details.module.css"; // Correctly importing CSS module

type Comment = {
  id: number;
  by: string;
  text: string;
  kids: number[];
  score: number;
};

type Story = {
  id: number;
  title: string;
  by: string;
  url: string;
  score: number;
  kids: number[];
};

interface IMatchParams {
  id: string;
}

export default function Details() {
  const { id } = useParams<IMatchParams>();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        );
        const data = await response.json();
        setStory(data);

        if (data.kids) {
          const commentPromises = data.kids.map(async (id: number) => {
            const res = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
            );
            return res.json();
          });
          const comments = await Promise.all(commentPromises);
          setComments(comments);
        }
      } catch (error) {
        console.error("Ошибка получения данных", error);
      }
    };
    fetchStory();
  }, [id]);

  return (
    <div className={styles.container}>
      {story && (
        <>
          <h1>{story.title}</h1>
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
          <p>by: {story.by}</p>
          <p>score: {story.score}</p>
        </>
      )}
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{parse(comment.text)}</p>
            <p>by: {comment.by}</p>
            <p>score: {comment.score}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
