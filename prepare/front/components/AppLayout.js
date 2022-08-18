import React, { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled, { createGlobalStyle } from "styled-components";
import UserPofile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import { useSelector } from 'react-redux';
import useInput from "../hooks/useInput";
import Router from "next/router";

const SearchInput = styled(Input.Search)`
    verticalAlign: 'middle'
`;

const Global = createGlobalStyle`
    .ant-row{
        margin-rigth: 0 !important;
        margin-left: 0 !important;
    }
    .ant-col:first-child {
        padding-left: 0 !important;
    }
    .ant-col:last-child {
        padding-right: 0 !important;
    }
`;

const AppLayout = ({ children }) => {
    const { me } = useSelector((state) => state.user);
    const [searchInput, onChangeSearchInput] = useInput('');

    const onSearch = useCallback(() => {
        Router.push(`hashtag/${searchInput}`)
    }, [searchInput]);
    return (
        <div>
            <Global />
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href='/'><a>노드 버드</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href='/profile'><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput enterButton
                    value={searchInput}
                    onChange={onChangeSearchInput}
                    onSearch={onSearch}
                    />
                </Menu.Item>
                <Menu.Item>
                    <Link href='/signup'><a>회원 가입</a></Link>
                </Menu.Item>                
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserPofile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="https://naver.com" target="_blank" rel = "noreferrer noopener">네이버</a>
                </Col>
            </Row>
            
        </div>
    )
}

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;