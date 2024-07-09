import {
  collection,
  // getDocs,
  // limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase/firebase';
import Tweet from './Tweet';

export interface ITweet {
  id: string;
  createAt: number;
  photoUrl?: string;
  tweet: string;
  userId: string;
  username: string;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createAt', 'desc')
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { createAt, photoUrl, tweet, userId, username } = doc.data();
          return {
            createAt,
            photoUrl,
            tweet,
            userId,
            username,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
