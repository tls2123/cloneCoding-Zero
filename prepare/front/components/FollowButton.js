import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {UNFOLLOW_REQUEST, FOLLOW_REQUEST} from '../reducers/user'

const FollowButton = ({post}) => {
    const dispatch = useDispatch();
    //팔로우를 하고 잇는지 않하고 잇는지 여부 파악
    const {me, followLoading, unfollowLoading} = useSelector((state) => state.user);
    
    //me && me.FollowButton과 같음
    const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
    //팔로잉을 끊는것
    const onClickButton = useCallback(() => {
        if(isFollowing){
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: post.User.id,
            })
        }else{
            dispatch({
                type: FOLLOW_REQUEST,
                data: post.User.id,
            })
        }
    }, [isFollowing]);

    if(post.User.id === me.id){
        return null;
    }
    return(
        <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
            {isFollowing ? '언팔로우' : '팔로우'}
        </Button>
    )
}

FollowButton.propTypes = {
    post: PropTypes.object.isRequired,
}

export default FollowButton;