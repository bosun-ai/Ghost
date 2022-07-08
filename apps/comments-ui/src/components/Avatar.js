import React, {useContext} from 'react';
import AppContext from '../AppContext';
import {getInitials} from '../utils/helpers';

const Avatar = (props) => {
    const {member} = useContext(AppContext);

    const getHashOfString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return hash;
    };

    const normalizeHash = (hash, min, max) => {
        return Math.floor((hash % (max - min)) + min);
    };

    const generateHSL = () => {
        let commentMember = (props.comment ? props.comment.member : member);

        if (!commentMember || !commentMember.name) {
            return [0,0,10];
        }

        const saturation = isNaN(props.saturation) ? 50 : props.saturation;

        const hRange = [0, 360];
        const lRangeTop = Math.round(saturation / (100 / 30)) + 30;
        const lRangeBottom = lRangeTop - 20;
        const lRange = [lRangeBottom, lRangeTop];

        const hash = getHashOfString(commentMember.name);
        const h = normalizeHash(hash, hRange[0], hRange[1]);
        const l = normalizeHash(hash, lRange[0], lRange[1]);
        
        return [h, saturation, l];
    };

    const HSLtoString = (hsl) => {
        return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
    };

    const commentGetInitials = () => {
        let commentMember = (props.comment ? props.comment.member : member);

        if (!commentMember || !commentMember.name) {
            return getInitials('Anonymous');
        }
        return getInitials(commentMember.name);
    };

    let dimensionClasses = (props.size === 'small' ? 'w-8 h-8' : 'w-11 h-11');
    let initialsClasses = (props.size === 'small' ? 'text-sm' : 'text-lg');
    let commentMember = (props.comment ? props.comment.member : member);

    const bgColor = HSLtoString(generateHSL());
    const avatarStyle = {
        background: bgColor
    };

    return (
        <figure className={`relative ${dimensionClasses}`}>
            <div className={`flex justify-center items-center rounded-full ${dimensionClasses}`} style={avatarStyle}>
                <p className={`text-white font-sans font-semibold ${initialsClasses}`}>{ commentGetInitials() }</p>
            </div>
            <img className={`absolute top-0 left-0 rounded-full ${dimensionClasses}`} src={commentMember.avatar_image} alt="Avatar"/>
        </figure>
    );
};

export default Avatar;
