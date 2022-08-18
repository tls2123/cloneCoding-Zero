import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

import {Input, Button} from 'antd';
import { useSelector } from "react-redux";

const {TextArea} = Input;

//'첫번째 게시글 #해시태그 #익스프레스' 여기서 해시태그를 축출해서 사용한다.

const PostCardContent = ({postData, editMode, onCancelUpdata, onChangePost}) => {
    const [editText, setEditText] = useState(postData);
    const { updatePostLoading, updatePostDone } = useSelector( state => state.post)

    useEffect(() => {
        if(updatePostDone){
            onCancelUpdata();
        }
    }, [updatePostDone]);

    const onChangeText = useCallback((e) => {
        setEditText(e.target.value);
    });

    return(
        <div>
            {editMode
                ? (
                    <>
                        <TextArea value={editText} onChange={onChangeText}/>
                        <Button.Group>
                            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
                            <Button type="dander" onClick={onCancelUpdata}>취소</Button>
                        </Button.Group>
                    </>
                )
                :  postData.split(/(#[^\s#]+)/g).map((v, i) => {
                    if(v.match(/(#[^\s#]+)/)){
                        return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
                    }
                    return v;
                })}
        </div>
    )
}

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    onCancelUpdata: PropTypes.func.isRequired,
    onChangePost: PropTypes.func.isRequired,
}
PostCardContent.defaultProps = {
    editMode: false,
}
export default PostCardContent;