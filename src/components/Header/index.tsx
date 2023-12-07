import React from 'react';
import {Link} from "react-router-dom";
import styles from './header.module.scss'
import { Logo } from '../../icons';

const Header = () => {
    return (
        <div className={"f-c-col"}>
            <div className={`${styles.headerBlock} pd-20 f-c-col`}>
                <Logo width={200}/>
            </div>
        </div>
    );
};

export default Header;