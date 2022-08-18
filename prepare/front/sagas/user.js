import { all, call, fork, takeLatest, put, delay } from 'redux-saga/effects';
import axios from 'axios';

import {
    FOLLOW_FAILURE,
    FOLLOW_REQUEST,
    FOLLOW_SUCCESS,
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_OUT_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    SIGN_UP_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    UNFOLLOW_FAILURE,
    UNFOLLOW_REQUEST,
    UNFOLLOW_SUCCESS,
    LOAD_MY_INFO_REQUEST,
    LOAD_MY_INFO_SUCCESS,
    LOAD_MY_INFO_FAILURE,
    CHANGE_NICKNAME_REQUEST,
    CHANGE_NICKNAME_SUCCESS,
    CHANGE_NICKNAME_FAILURE,
    LOAD_FOLLOWERS_REQUEST, 
    LOAD_FOLLOWERS_SUCCESS,
    LOAD_FOLLOWERS_FAILURE, 
    LOAD_FOLLOWINGS_FAILURE,
    LOAD_FOLLOWINGS_REQUEST, 
    LOAD_FOLLOWINGS_SUCCESS,
    REMOVE_FOLLOWER_FAILURE,
    REMOVE_FOLLOWER_REQUEST, 
    REMOVE_FOLLOWER_SUCCESS,
} from '../reducers/user';


//이거는 제러레이터 아님!!! 주의
function logInAPI(data) {
    //여기에는 return axios.post('api/login')이러한 코드를 적어서 서버에게 요청을 보낸다.
    return axios.post('/user/login', data);
}
//요청이 항상 성공하는 것은 아니다 이를 대비해 try, catch를 통해서 이를 대비
function* logIn(action) {
    try {
        //서버에 요청한 결과값도 받을 수 있다.
        //action.data값이 logInAPI로 들어간다.
        //원래는 logInAPI(action.data) 이런식으로 표현 
        //call를 사용하면 다 펼쳐주어야 한다. 
        //call(logInAPI, action.data)이런식으로 

        //현재 데이터가 없어서 에러 
        //delay를 사용해서 비동기의 효과를 보여준다. 데이터가 완성이 되면 제거
        //const result = yield call(logInAPI, action.data);
        const result = yield call(logInAPI, action.data)
        //그 받은 결과값을 사용
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data
        })
    } catch (err) {
        console.error(err)
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data
        })
    }

}
function logOutAPI() {
    return axios.post('/user/logout');
}
function* logOut() {
    try {
        yield call(logOutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        })
    } catch (err) {
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data
        })
    }
}

function signUpAPI(data) {
    console.log('여기에는 들어온다.')
    return axios.post('/user', data);    //data -> email,password, nickname
}
function* signUp(action) {
    console.log(action.data)
    try {
        const result = yield call(signUpAPI, action.data);
        console.log(result);
        yield put({
            type: SIGN_UP_SUCCESS,
        })
    } catch (err) {
        console.error(err);
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data,
        })
    }

}
function loadMyInfoAPI() {
    return axios.get('/user');
}

function* loadMyInfo() {
    try {
        const result = yield call(loadMyInfoAPI);
        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error: err.response.data,
        });
    }
}

function changeNicknameAPI(data) {
    console.log(data)
    return axios.patch('/user/nickname', { nickname: data });
}

function* changeNickname(action) {
    try {
        const result = yield call(changeNicknameAPI, action.data);
        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            error: err.response.data,
        });
    }
}
function followAPI(data) {
    return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
    try {
        const result = yield call(followAPI, action.data);
        yield put({
            type: FOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: FOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}

function unfollowAPI(data) {
    return axios.post(`/user/${data}/follow`);
}

function* unfollow(action) {
    try {
        const result = yield call(unfollowAPI, action.data);
        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: UNFOLLOW_FAILURE,
            error: err.response.data,
        });
    }
};
function loadFollowersAPI(data) {
    return axios.get('/user/followers', data);
}

function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data);
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: err.response.data,
        });
    }
}

function loadFollowingsAPI(data) {
    return axios.get('/user/followings', data);
}

function* loadFollowings(action) {
    try {
        const result = yield call(loadFollowingsAPI, action.data);
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: err.response.data,
        });
    }
}

function removeFollowerAPI(data) {
    return axios.delete(`/user/follower/${data}`);
  }
  
function* removeFollower(action) {
    try {
      const result = yield call(removeFollowerAPI, action.data);
      yield put({
        type: REMOVE_FOLLOWER_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: REMOVE_FOLLOWER_FAILURE,
        error: err.response.data,
      });
    }
  }


//thuck의 경우 비동기 액션 크리에이터를 직접 실행햇지만 
//saga는 직접 실행되는 것이 아니라 이벤트 리스너와 같이 실행이 된다. - 'LOG_IN' 액션이 실행이 되면 logIn함수가 실행
function* watchLogIn() {
    yield takeLatest(LOG_IN_REQUEST, logIn);
}
function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}
function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}
function* watchChangeNickname() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}
function* watchLoadFollowers() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}
function* watchLoadFollowings() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}
function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}
export default function* userSaga() {
    yield all([
        fork(watchRemoveFollower),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchChangeNickname),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchLoadMyInfo),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ])
}