import React, { Component, useState, useRef } from 'react';
import { Row, Col, Button, Menu, Anchor, Card } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import Cookies from 'js-cookie';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Language from '@/locales/index';

const { SubMenu } = Menu;

class Header extends React.Component {
  state = {
    current: 'home',
  };

  handleClick = (e) => {
    this.setState({ current: e.key });
    if (e.key === 'signup') history.push('/user/login');
    else if (e.key === 'signout') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('imageURL');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      history.push('/user/login');
      
    }
    else if (e.key === 'introduce') history.push('/introduction')
    else if (e.key === 'join') {
      if (localStorage.getItem('codejoy-authority') == '["developer"]')
        history.push('/developer')
      else
      history.push('/creator')
    }
  };

  isLogin = localStorage.getItem('currentUser');
  render() {
    const { current } = this.state;
    return (
      this.isLogin ? 
      <Menu
        onClick={this.handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        className={styles.menu}
      >
        <Menu.Item key="home" style={{textShadow: "#467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px, #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px"}}>{Language.home_home}</Menu.Item>
        <Menu.Item style={{textShadow: "#000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px, #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px"}} key="introduce">{Language.home_introduce}</Menu.Item>
        <Menu.Item key="join" style={{color: 'pink', fontWeight: 'bold', }}>{Language.home_letstart}</Menu.Item> 
        {this.isLogin ? (
          <SubMenu style={{textShadow: "#000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px, #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px"}} title={Language.home_welcome.concat(", ").concat(localStorage.getItem('currentUser'))}>
          <Menu.Item key="signout">{Language.home_signOut}</Menu.Item>
        </SubMenu>
          
        ) : (
          <Menu.Item key="signup" style={{textShadow: "#467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px, #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px"}}>{Language.home_login}</Menu.Item>
        )}
      </Menu>
      :
      <Menu
        onClick={this.handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        className={styles.menu}
      >
        <Menu.Item key="home" style={{textShadow: "#467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px, #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px"}}>{Language.home_home}</Menu.Item>
        <Menu.Item key="introduce" style={{textShadow: "#467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px, #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px"}}>{Language.home_introduce}</Menu.Item>
        {this.isLogin ? (
          <Menu.Item key="signout" style={{textShadow: "#467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px, #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px"}}>{Language.home_signOut}</Menu.Item>
        ) : (
          <Menu.Item key="signup" style={{textShadow: "#467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px, #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px,   #467ab8 0px 0px 1px"}}>{Language.home_login}</Menu.Item>
        )}
      </Menu>
   
    );
  }
}
const Content = () => {
  const [page, setPage] = useState(0);
  const handleScroll = (e) => {
    if (
      window.pageYOffset < document.documentElement.offsetHeight * 1.5 &&
      window.pageYOffset > document.documentElement.offsetHeight * 0.5
    )
      setPage(1);
    if (window.pageYOffset > document.documentElement.offsetHeight * 1.5) setPage(2);
    if (window.pageYOffset < document.documentElement.offsetHeight * 0.5) setPage(0);
  };
  return (
    <>
      <div
        className={styles.container}
        onScroll={(e) => console.log(e)}
        onWheel={(e) => handleScroll(e)}
      >
        <div className={styles.body}>
          <div id="p1" key="0" className={styles.page}>
            <div className={styles.one}>
              <video className={styles.videoTag} autoPlay loop muted>
                <source
                  src="https://firebasestorage.googleapis.com/v0/b/devcheckpro.appspot.com/o/Logo%2FCodeJOY%20(2).mp4?alt=media&token=a742ee85-ea79-4a87-807a-00f16df87ecd"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
          <div id="p2" key="1" className={styles.page}>
            <div className={styles.two + ' ' + styles.specialDesign}>
              <Row>
                <Col span={12} className={styles.specialContent}>
                  <div className={styles.specialTitle}>{Language.home_codejoy}</div>
                  <div className={styles.specialSubTitle}>
                    {Language.home_ultimateResource}
                  </div>
                  <div className={styles.specialSubTitle}>
                    {Language.home_environment}
                  </div>
                  <Row gutter={24} style={{ marginTop: '32px' }}>
                    <Col span={12}>
                      <div className={styles.card}>
                        <div className={styles.cardIcon}>
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/devcheckpro.appspot.com/o/GuestPage%2Flist-rich-64.png?alt=media&token=0202b3ba-ea71-480d-8ac4-367864d1364d"
                            alt=""
                          />
                        </div>
                        <div className={styles.cardTitle}>{Language.home_hundreds}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.card}>
                        <div className={styles.cardIcon}>
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/devcheckpro.appspot.com/o/GuestPage%2Fcode-64.png?alt=media&token=b30b4c8e-3bd3-4450-8b61-fa1f46a99049"
                            alt=""
                          />
                        </div>
                        <div className={styles.cardTitle}>{Language.home_support}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{ marginTop: '24px' }}>
                    <Col span={12}>
                      <div className={styles.card}>
                        <div className={styles.cardIcon}>
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/devcheckpro.appspot.com/o/GuestPage%2Ftop-navigation-toolbar-64.png?alt=media&token=8981b21b-478f-4d6b-9e7f-fb8aa56c011b"
                            alt=""
                          />
                        </div>
                        <div className={styles.cardTitle}>{Language.home_codeExecution}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.card}>
                        <div className={styles.cardIcon}>
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/devcheckpro.appspot.com/o/GuestPage%2Fcomputer-64.png?alt=media&token=ccd8ffd8-32a4-4101-ba88-6f9f3edeca9f"
                            alt=""
                          />
                        </div>
                        <div className={styles.cardTitle}>{Language.home_spaceTime}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} style ={{maxWidth:"45%", display:"flex", alignItems:"center"}}>
                  <div className={styles.perspectiveWrapper}>
                    <div className={styles.container}>
                      <img src="https://firebasestorage.googleapis.com/v0/b/devcheckpro.appspot.com/o/GuestPage%2Fezgif.com-gif-maker.gif?alt=media&token=1bff5b70-4bd8-4cb4-a3c1-721947a3b9d7" alt=""/> 
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
         <div className={styles.thumbs}>
            <AnchorLink
              href="#p1"
              onClick={() => {
                setPage(0);
              }}
            >
              <div
                className={styles.thumb}
                style={page == 0 ? { backgroundColor: 'white' } : null}
              ></div>
            </AnchorLink>
            <AnchorLink
              href="#p2"
              onClick={() => {
                setPage(1);
              }}
            >
              <div
                className={styles.thumb}
                style={page == 1 ? { backgroundColor: 'white' } : null}
              ></div>
            </AnchorLink>
            
          </div>
        </div>
      </div>
    </>
  );
};

class Home extends React.Component {
  render() {
    return (
      <div style={{ overflow: 'hidden', backgroundColor: 'black' }}>
    
        <div
          className="header"
          style={{
            position: 'fixed',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Header />
        </div>
        <Content></Content>
      </div>
    );
  }
}

export default Home;
