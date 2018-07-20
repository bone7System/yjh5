import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd';
import path from './images/403.png';
import styles from './index.css';

export default class Error403 extends React.Component {
	render() {
		return (
			<div className={styles.exception}>
				<div className={styles.imgBlock}>
					<div className={styles.imgEle} style={{ backgroundImage: `url(${path})` }}></div>

				</div>

				<div className={styles.content}>
					<h1>403</h1>
					<div className={styles.desc}>抱歉，你无权访问该页面</div>
					<div className={styles.action}></div>
				</div>

			</div>
		)
	}

}