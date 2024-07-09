import { ITweet } from './Timeline';
import { auth, db, storage } from '../firebase/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useState } from 'react';
import {
  Button,
  Column,
  CrudBox,
  Payload,
  Photo,
  TextArea,
  Username,
  Wrapper,
} from '../styledComponents/Tweet/Tweet';

export default function Tweet({
  username,
  photoUrl,
  tweet,
  userId,
  id,
}: ITweet) {
  console.log('username : ', username);
  console.log('photoUrl : ', photoUrl);
  console.log('tweet : ', tweet);
  console.log('id : ', id);
  console.log('userId : ', userId);
  const user = auth.currentUser;

  const [isEdit, setIsEdit] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null);

  const onDelete = async () => {
    const ok = confirm('Are you sure you want to delete this tweet?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photoUrl) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        console.log('photoRef::', photoRef);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = () => {
    setIsEdit(true);
  };

  const onSave = async () => {
    if (user?.uid !== userId) return;
    try {
      const tweetRef = doc(db, 'tweets', id);
      await updateDoc(tweetRef, { tweet: editedTweet });

      if (editedPhoto) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(photoRef, editedPhoto);
        const url = await getDownloadURL(result.ref);
        await updateDoc(tweetRef, { photoUrl: url });
      }
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTweet(e.target.value);
  };

  const onChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setEditedPhoto(files[0]);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEdit ? (
          <>
            <TextArea style={{}} value={editedTweet} onChange={onChangeTweet} />
            <input type='file' accept='image/*' onChange={onChangePhoto} />
            <Button onClick={onSave}>Save</Button>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <CrudBox>
                <Button onClick={onDelete}>Delete</Button>
                <Button onClick={onEdit}>Edit</Button>
              </CrudBox>
            ) : null}
          </>
        )}
      </Column>
      {photoUrl ? (
        <Column>
          <Photo style={{ margin: 'auto' }} src={photoUrl} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
