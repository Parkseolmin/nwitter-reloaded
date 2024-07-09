import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db, storage } from '../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  AttachFileButton,
  AttachFileInput,
  Form,
  SubmitBtn,
  TextArea,
} from '../styledComponents/PostTweetForm/PostTweetForm';

export default function PostTweetForm() {
  const MAX_FILES_SIZE_IN = 1024 ** 2;
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const selectedFile = files[0];
      if (selectedFile.size <= MAX_FILES_SIZE_IN) {
        setFile(selectedFile);
        setFileError(null);
      } else {
        setFile(null);
        setFileError('File size must be less then 1MB.');
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === '' || tweet.length > 180) return;

    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photoUrl: url,
        });
      }
      setTweet('');
      setFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        value={tweet}
        placeholder='What is happening?'
        onChange={onChange}
        required
      />
      <AttachFileButton htmlFor='file'>
        {file ? 'Photo added⭐' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        type='file'
        id='file'
        accept='image/*'
        onChange={onFileChange}
      />
      {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
      <SubmitBtn
        type='submit'
        value={isLoading ? 'Posting...' : 'Post Tweet'}
      />
    </Form>
  );
}
