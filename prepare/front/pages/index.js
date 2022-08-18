import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from 'redux-saga';
import axios from "axios";

import AppLayout from "../components/AppLayout";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';


const Home = () => {
    const dispatch = useDispatch();
    //이건 구조분해할당을 해준 부분
    const { me } = useSelector((state => state.user));
    const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector((state => state.post));

    useEffect(() => {
        if(retweetError){
            alert(retweetError);
        }
    }, [retweetError]);

    //scroll꼭 지워주어야 한다.안지워 주면 데이터에 계속 쌓이게 된다.
    useEffect(() => {
        function onScroll(){
            //다 내리면 새로운것을 로딩해라
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
               if(hasMorePost && !loadPostsLoading){
                const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId,
                    });
               }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [hasMorePost, loadPostsLoading, mainPosts])
    
    return(
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
        </AppLayout>
    );
};
//화면이 켜질때 게시글이 먼저 보이게 하는 것
//서버 사이드 렌더링을 하면 처음에 데이터를 받아와 느린것을 해결하는 방법
//원래는 브라우저에서 쿠키를 보내주지만 서버사이드렌더링을 하면 처음은 브라우저가 아닌 
//프론트에서 쿠키를 보내주게 된다.
//getServerSideProps 데이터가 변화 할일이 없으면 
export const getServerSideProps = wrapper.getServerSideProps(async(context) => {
    const cookies = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if(context.req && cookies){
        axios.defaults.headers.Cookie = cookies;
    }
        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        })
        context.store.dispatch({
            type: LOAD_POSTS_REQUEST,
        })
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
});

export default Home;