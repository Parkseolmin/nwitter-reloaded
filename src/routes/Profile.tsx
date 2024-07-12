import { auth, db, storage } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
  AvatarImg,
  AvatarInput,
  AvatarUpload,
  Name,
  ProfileName,
  Tweets,
  Wrapper,
} from '../styledComponents/Profile/Profile';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { Button } from '../styledComponents/Tweet/Tweet';
import { ITweet } from '../components/Timeline';
import Tweet from '../components/Tweet';

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  useEffect(() => {
    if (!user) return;

    const tweetQuery = query(
      collection(db, 'tweets'),
      where('userId', '==', user.uid),
      orderBy('createAt', 'desc'),
      limit(25)
    );

    const unsubscribe = onSnapshot(tweetQuery, (snapshot) => {
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createAt, userId, username, photoUrl } = doc.data();
        return {
          tweet,
          createAt,
          userId,
          username,
          photoUrl,
          id: doc.id,
        };
      });
      setTweets(tweets);
    });

    return () => unsubscribe();
  }, [user]);

  const onEditName = () => {
    setIsEditing(true);
  };

  const onSaveName = async () => {
    if (user && newDisplayName !== user.displayName) {
      try {
        // 사용자 프로필 업데이트
        await updateProfile(user, { displayName: newDisplayName });

        // Firestore의 tweets 컬렉션에서 해당 사용자의 모든 트윗 업데이트
        const tweetsRef = collection(db, 'tweets');
        const q = query(tweetsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, { username: newDisplayName });
        });
        await batch.commit();

        setIsEditing(false);
      } catch (error) {
        console.error('Error updating name:', error);
      }
    }
  };
  return (
    <Wrapper>
      <AvatarUpload htmlFor='avatar'>
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='size-6'
          >
            <path
              fillRule='evenodd'
              d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        id='avatar'
        type='file'
        accept='image/*'
        onChange={onAvatarChange}
      />
      <ProfileName>
        {isEditing ? (
          <>
            <>
              <input
                style={{
                  border: 'none',
                  backgroundColor: 'rgb(60, 60, 60)',
                  color: 'white',
                  borderRadius: '5px',
                }}
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <Button onClick={onSaveName}>Save</Button>
            </>
          </>
        ) : (
          <>
            <Name>{user?.displayName ?? 'Anonymous'}</Name>
            <svg
              onClick={onEditName}
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
              />
            </svg>
          </>
        )}
      </ProfileName>
      <Tweets>
        {tweets.map((tweet: ITweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
