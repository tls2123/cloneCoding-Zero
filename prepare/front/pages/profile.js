// import React, { useEffect, useCallback, useState } from 'react';
// import Head from 'next/head';
// import { useSelector, useDispatch } from 'react-redux';
// import Router from 'next/router';
// import { END } from 'redux-saga';
// import axios from 'axios';
// import useSWR from 'swr';

// import AppLayout from '../components/AppLayout';
// import NicknameEditForm from '../components/NicknameEditForm';
// import FollowList from '../components/FollowList';
// import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
// import wrapper from '../store/configureStore';

// const fetcher = (url) => axios.get(url, {withCredentials: true}).then((result) => result.data);

// const Profile = () => {
//   const dispatch = useDispatch();

//   const { me } = useSelector((state) => state.user);
//   const [followersLimit, setFollowersLimit] = useState(3);
//   const [followingsLimit, setFollowingsLimit] = useState(3);

//   const {data: followersData , error: followerError} = useSWR(`http://localhost:3000/user/followers${followersLimit}`, fetcher);
//   const {data: followingsData, error: followingError} = useSWR(`http://localhost:3000/user/followings${followingsLimit}`, fetcher);

//   // useEffect(() => {
//   //   dispatch({
//   //     type: LOAD_FOLLOWERS_REQUEST,
//   //   });
//   //   dispatch({
//   //     type: LOAD_FOLLOWINGS_REQUEST,
//   //   });
//   // }, []);

//   useEffect(() => {
//     if (!(me && me.id)) {
//       Router.push('/');
//     }
//   }, [me && me.id]);

//   const loadMoreFollowers = useCallback(() => {
//     setFollowersLimit((prev) => prev + 3);
//   }, []);

//   const loadMoreFollowings = useCallback(() => {
//     setFollowingsLimit((prev) => prev + 3);
//   }, []);

//   if (!me) {
//     return '내 정보 로딩중...';
//   }

//   //return이 훅스보다 밑에 있어야 전체가 완료
//   if(followerError || followingError){
//     console.log(followerError || followingError);
//     return <div>팔로잉 팔로우 중 에러가 발생합니다.</div>;
//   }

//   return (
//     <>
//       <Head>
//         <title>내 프로필 | NodeBird</title>
//       </Head>
//       <AppLayout>
//         <NicknameEditForm />
//         <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingError && !followingsData} />
//         <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followerError && !followersData} />
//       </AppLayout>
//     </>
//   );
// };

// export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
//   console.log('getServerSideProps start');
//   console.log(context.req.headers);
//   const cookie = context.req ? context.req.headers.cookie : '';
//   axios.defaults.headers.Cookie = '';
//   if (context.req && cookie) {
//     axios.defaults.headers.Cookie = cookie;
//   }
//   context.store.dispatch({
//     type: LOAD_MY_INFO_REQUEST,
//   });
//   context.store.dispatch(END);
//   console.log('getServerSideProps end');
//   await context.store.sagaTask.toPromise();
// });


// export default Profile;
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const [followersLimit, setFollowersLimit] = useState(3);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return '팔로잉/팔로워 로딩 중 에러가 발생했습니다.';
  }

  if (!me) {
    return '내 정보 로딩중...';
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingError && !followingsData} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followerError && !followersData} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Profile;